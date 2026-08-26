# AI-DLC v2: stage-graph 컴파일과 동작 원리

> 대화 일시: 2026-08-26  
> 주제: AI-DLC의 `stage-graph`, 컴파일의 의미, DAG 구조, `next()` 결정론적 전이 방식, 커스텀 Stage 추가

---

## Q1. 왜 컴파일이 필요한가? (Markdown → JSON 변환이 맞는지?)

### 핵심 요약
**"각 Stage의 Markdown 파일 속 YAML Frontmatter를 파싱하여 최종 JSON(`stage-graph.json`, `scope-grid.json`)으로 빌드하는 과정"**이 맞다.

### 단순 변환이 아닌 "컴파일(Compile)"이라 부르는 이유

1. **Source of Truth 분리와 작성 편의성**
   - 개발자와 프레임워크 작성자는 인간용 행동 지침(Markdown 본문)과 메타데이터(YAML Frontmatter)를 하나의 `.md` 파일(`aidlc-common/stages/<phase>/<stage>.md`)에서 관리하는 것이 훨씬 유지보수에 용이함.
2. **빌드 타임 정적 검증 (Static Invariant Checking)**
   - 런타임 에러를 방지하기 위해 컴파일 시점에 다음을 엄격히 검증:
     - **DAG 사이클 검사**: `requires_stage` 의존성에 순환 참조가 없는지 확인 (Kahn's Algorithm).
     - **Edge-local 불변식 검사**: 선행 스테이지는 반드시 본인보다 낮은 번호(`numericOrder(dep) < numericOrder(stage)`)를 가져야 함.
     - **참조 무결성 검증**: 실제 등록된 Agent, Sensor, Phase 이름과 일치하는지 교차 검증.
     - **플러그인 네임스페이스 및 Slug 중복 방지**.
3. **사전 계산 및 전치 (Pre-resolution & Transposition)**
   - **룰 체인 해결 (`rules_in_context`)**: 조직/팀/프로젝트/페이즈별 적용 규칙 경로를 사전에 계산하여 노드에 주입.
   - **센서 바인딩 (`sensors_applicable`)**: 센서 매니페스트에서 필터링 패턴을 매핑.
   - **스코프 매트릭스 전치 (`scope-grid.json`)**: 각 Stage의 `scopes: [...]` 목록을 거꾸로 뒤집어 Scope별 실행/생략(`EXECUTE`/`SKIP`) 매트릭스를 생성.
   - **자동 번호 할당 (Topological Seeding)**: 새로 추가된 Stage의 의존성을 분석해 고유 번호(예: `2.4`)를 자동 할당.
4. **결정론적 런타임 성능 (Deterministic & Zero-overhead)**
   - 런타임 오케스트레이터는 매번 수십 개의 `.md` 파일을 디스크에서 파싱하지 않고, 사전 검증 완료된 단일 `stage-graph.json`을 $O(1)$로 즉시 읽어 결정론적으로 빠르게 동작.

---

## Q2. `stage-graph.json`은 이번 Scope와 무관하게 33개 전체 Stage를 무조건 다 담고 있는가?

**그렇다. 무조건 등록된 33개 Stage 전체의 정보를 다 담고 있다.**

- `stage-graph.json`은 특정 실행/인텐트/스코프에 종속된 동적 파일이 아니라, AI-DLC 전체 라이프사이클의 **글로벌 청사진이자 구조적 진실(Structural Truth DAG)**이다.
- 이번 워크플로우에서 어떤 Scope(예: `feature`, `bugfix`, `mvp`)를 사용하는지에 따라 실행할 스테이지는 `stage-graph.json`의 각 노드에 적힌 `"scopes": [...]` 목록과 해당 인텐트의 상태 파일(`<record>/aidlc-state.md`)을 대조하여 필터링된다.

---

## Q3. 정보의 형태와 JSON 구조 예시

`stage-graph.json`은 `GraphStage[]` 배열 형태이다.

### 📄 실제 예시: `requirements-analysis` (요구사항 분석 노드)

```json
{
  "slug": "requirements-analysis",
  "number": "2.3",
  "name": "Requirements Analysis",
  "phase": "inception",
  "execution": "ALWAYS",
  "condition": "Always executes — depth scales with project complexity",
  "lead_agent": "aidlc-product-agent",
  "support_agents": [],
  "mode": "inline",
  "produces": [
    "requirements",
    "requirements-analysis-questions"
  ],
  "consumes": [
    { "artifact": "intent-statement", "required": false },
    { "artifact": "business-overview", "required": false, "conditional_on": "brownfield" }
  ],
  "requires_stage": [
    "approval-handoff",
    "reverse-engineering"
  ],
  "sensors": [
    "required-sections",
    "upstream-coverage"
  ],
  "scopes": [
    "enterprise", "feature", "mvp", "poc", "bugfix", "refactor",
    "infra", "security-patch", "classic", "workshop", "express"
  ],
  "reviewer": "aidlc-product-lead-agent",
  "reviewer_max_iterations": 2,
  "review_class": "advisory",
  "summary_confirmation": "required",
  "inputs": "RE artifacts (if brownfield), user's project description...",
  "outputs": "requirements.md, requirements-analysis-questions.md...",
  "rules_in_context": [
    { "path": "aidlc/spaces/default/memory/org.md", "scope": "org" },
    { "path": "aidlc/spaces/default/memory/team.md", "scope": "team" },
    { "path": "aidlc/spaces/default/memory/project.md", "scope": "project" },
    { "path": "aidlc/spaces/default/memory/phases/inception.md", "scope": "phase" }
  ],
  "sensors_applicable": [
    {
      "id": "required-sections",
      "path": ".codex/sensors/aidlc-required-sections.md",
      "matches": "**/{aidlc-docs,intents}/**"
    }
  ]
}
```

### 필드 구성 분류
- **식별 및 순서**: `slug`, `number` (위상 정렬 번호), `phase`, `name`
- **역할 배정**: `lead_agent`, `reviewer`, `review_class`
- **그래프 의존성**: `requires_stage` (선행 스테이지), `consumes` (입력 산출물), `produces` (출력 산출물)
- **스코프/실행**: `scopes` (활성화되는 스코프 목록)
- **컴파일 주입 필드**: `rules_in_context` (적용 룰 경로 체인), `sensors_applicable` (자동 검사 센서 목록)

---

## Q4. `next()` 함수의 동작 방식과 결정론적 경로 실행

오케스트레이터의 `nextInScopeStage()` 함수는 다음과 같이 결정론적(Deterministic)으로 다음 노드를 산출한다:

1. **현재 위치 파악**: `stage-graph.json`의 전체 목록에서 방금 완료된 스테이지(`afterSlug`)의 인덱스 위치를 찾음.
2. **선형 전진 탐색 (Linear Walk)**: 그 다음 인덱스($i+1$)부터 순방향으로 노드를 하나씩 검사.
3. **조건 검사**:
   - 이미 완료(`completed`)되었거나 건너뛴(`skipped`) 스테이지는 패스.
   - 현재 실행 중인 Scope에서 `EXECUTE`로 지정되어 있는지 확인.
   - **상태 우선 법칙(State override wins)**: 만약 사용자가 상태 파일(`<record>/aidlc-state.md`)에서 특정 스테이지를 수동으로 `EXECUTE` / `SKIP`으로 변경했다면 기본 스코프 매핑보다 상태 파일의 지시를 우선함.
4. **결정적 노드 선택**: 조건을 만족하는 **첫 번째 유효 노드를 반환하여 다음 단계로 진입**.

> 💡 **경로 변경 탈출구(Escape Hatches)**: 기본 경로는 결정론적으로 정해져 있지만, 인간 승인 게이트(Gate)에서의 수정/거부, `$aidlc jump` (특정 스테이지로 점프), `$aidlc compose` (맞춤형 계획 재구성)를 통해 필요 시 언제든 경로를 변경할 수 있음.

---

## Q5. AI-DLC에 Stage 추가가 가능한가? JSON도 직접 편집해야 하나?

1. **Stage 추가 가능 여부**: **완전 가능함.** (플러그인 및 오픈 월드 아키텍처)
2. **JSON 직접 편집 필요 여부**: **직접 편집할 필요가 없음.**
   - 신규 스테이지를 만들 때는 디렉토리에 마크다운 파일(예: `my-custom-stage.md`)과 상단 YAML Frontmatter만 작성하면 됨.
   - 이후 컴파일 명령어 실행:
     ```bash
     bun .codex/tools/aidlc-graph.ts compile
     ```
   - 컴파일러가 의존성 그래프를 분석하여 **자동으로 적절한 번호(예: `2.5`)를 부여하고 `stage-graph.json`과 `scope-grid.json`을 자동으로 갱신(컴파일)**함.

---

## Q6. Stage Markdown 원본 파일들의 실제 저장 위치

컴파일의 원본이 되는 Stage Markdown(`.md`) 파일들은 다음 경로에 위치함:

### 📂 기본 경로: `.codex/aidlc-common/stages/`

```text
.codex/aidlc-common/stages/
├── 📁 initialization/  (0.x - 3개)
│   ├── workspace-scaffold.md
│   ├── workspace-detection.md
│   └── state-init.md
│
├── 📁 ideation/        (1.x - 7개)
│   ├── intent-capture.md
│   ├── market-research.md
│   ├── scope-definition.md
│   ├── rough-mockups.md
│   ├── feasibility.md
│   ├── team-formation.md
│   └── approval-handoff.md
│
├── 📁 inception/       (2.x - 9개)
│   ├── practices-discovery.md
│   ├── reverse-engineering.md
│   ├── requirements-analysis.md
│   ├── user-stories.md
│   ├── refined-mockups.md
│   ├── domain-design.md
│   ├── contract-design.md
│   ├── units-generation.md
│   └── delivery-planning.md
│
├── 📁 construction/    (3.x - 7개)
│   ├── functional-design.md
│   ├── nfr-requirements.md
│   ├── infrastructure-design.md
│   ├── nfr-design.md
│   ├── code-generation.md
│   ├── build-and-test.md
│   └── ci-pipeline.md
│
└── 📁 operation/       (4.x - 7개)
    ├── environment-provisioning.md
    ├── deployment-pipeline.md
    ├── deployment-execution.md
    ├── observability-setup.md
    ├── performance-validation.md
    ├── incident-response.md
    └── feedback-optimization.md
```

### 💡 추가 경로
1. **플러그인 커스텀 Stage**: `plugins/<plugin-name>/stages/<phase>/<stage-slug>.md`
2. **실행 시 생성되는 산출물 Markdown (결과물)**: `aidlc/spaces/default/intents/<intent-name>/<phase>/<stage>/`
