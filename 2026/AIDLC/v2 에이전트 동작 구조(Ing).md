# AI-DLC v2 에이전트 동작 구조 및 Tier 시스템

> 본 문서는 AI-DLC v2의 에이전트 아키텍처, 오케스트레이션 및 협업 메커니즘, 리뷰어 루프, Tier 시스템의 동작 원리를 정리한 문서입니다.

---

## 1. 아키텍처 철학: Small Mob, Broad Agents

AI-DLC는 수십 개의 좁은 전문 에이전트를 만들어 워터폴식 핸드오프를 유발하는 대신, **11개의 넓은 역량을 가진 도메인 에이전트 + 2개의 리뷰어 에이전트 + 1개의 컴포저 에이전트(총 14개)** 체계를 사용합니다.

```
                  [ SKILL.md (Conductor / Orchestrator) ]
                      /              |              \
             (Inline Mode)      (Subagent)       (Mob / Mesh)
                  /                  |                  \
        [Product Persona]    [Architect Agent]   [Dev + QA + Sec]
```

- **넓은 도메인 커버리지**: 단일 에이전트(예: `aidlc-architect-agent`)가 여러 단계(도메인 설계, NFR, 컴포넌트 분해 등)를 연속해서 맡아 컨텍스트 유실 없이 일관성을 유지합니다.
- **적은 핸드오프(Handoff)**: 에이전트 경계를 최소화하여 핸드오프 과정에서 발생하는 정보 왜곡 및 유실을 방지합니다.

---

## 2. 오케스트레이션 및 중앙 제어 메커니즘

### ① 중앙 집중 오케스트레이션 (Conductor Pattern)
- 전체 워크플로우의 실행 제어 및 흐름 제어는 오케스트레이터인 `SKILL.md` (Conductor)가 총괄합니다.
- 어떤 스테이지를 실행할지, 어떤 에이전트를 어떤 모드로 호출할지는 Conductor가 결정합니다.

### ② 서브에이전트 재귀 호출 금지 (`disallowedTools: Task`)
- 모든 개별 에이전트 정의에는 `disallowedTools: Task`가 필수로 지정되어 있습니다.
- **이유**: 에이전트 A가 에이전트 B를 임의로 연쇄 스폰(Cascading Subagents)하는 것을 차단하여 통제 불가능한 호출 체인, 토큰 폭증, 무한 루프를 방지합니다.
- 오직 최상위 Conductor만이 서브에이전트를 생성/위임(Delegate)할 수 있습니다.

---

## 3. 4가지 협업 토폴로지 (Execution Modes)

각 스테이지(Stage)의 `mode` 속성에 따라 에이전트가 실행되는 구조가 달라집니다.

| 모드 (Mode) | 동작 방식 | 주요 특징 및 사례 |
|---|---|---|
| **`inline`** | Conductor가 현재 세션의 컨텍스트 내에서 해당 에이전트의 페르소나를 전환하여 직접 수행 | 속도가 빠르고 메인 컨텍스트의 연속성이 유지됨 |
| **`subagent`** | 독립된 서브에이전트 컨텍스트로 디스패치하여 격리된 환경에서 작업 수행 | 작업 완료 후 산출물만 Conductor에게 반환하는 허브 앤 스포크 구조 |
| **`mob`** | 리드 에이전트 외에 여러 지원 에이전트(Support Agents)가 동시에 투입되는 메시(Mesh) 협업 구조 | 각 지원 에이전트가 영역별 기여 파일(`contribution file`)을 독립 작성하고, 리드 에이전트가 이를 최종 산출물로 통합 (예: `user-stories` 스테이지) |
| **`pipeline`** | 여러 에이전트가 순차적으로 산출물을 전달받아 점진적으로 발전시키는 체인(Chain) 구조 | 선행 작업물이 다음 에이전트로 순차 파이프라이닝됨 (예: `reverse-engineering` 스테이지) |

---

## 4. 독립 리뷰어 및 품질 게이트 검증 루프

산출물을 만드는 빌더(Builder)와 이를 검증하는 **리뷰어(Reviewer)**가 명확히 분리되어 동작합니다.

```
[Builder Agent] ──(산출물 생성)──> [독립 Reviewer Agent]
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
         [Advisory Mode (자문형)]                        [Adversarial Mode (적대적 루프)]
         • 판정 결과를 Human 승인 게이트에 보고               • NOT-READY 시 Builder 재실행
         • 최종 판단은 사람이 수행                         • 수정 ↔ 재리뷰 루프 (최대 2회 반복)
```

- **독립된 컨텍스트**: 리뷰어는 빌더의 내부 계획이나 메모리를 보지 않고, 요구사항과 최종 산출물만을 대조하여 독립적인 시각으로 평가합니다.
- **검증 방식 (Review Class)**:
  - **Advisory (자문형)**: 기획/분석 단계(`requirements-analysis`, `rough-mockups` 등). `READY` / `NOT-READY` 판정과 상세 지적 사항을 요약하여 사용자 승인 게이트에 전달합니다.
  - **Adversarial (적대적/루프형)**: 설계/구현 단계(`functional-design`, `code-generation` 등). `NOT-READY` 판정 시 빌더가 피드백을 반영해 다시 수정하고 리뷰어가 재검증하는 자동 루프를 돕니다 (`reviewer_max_iterations`, 기본 2회 제한).
- **턴 예산(Turn Budget)**: 리뷰어는 최대 60턴(`maxTurns: 60`) 내에 판정을 내리도록 강제되어 비용 낭비를 방지합니다.

---

## 5. 지식 주입 계층 (Knowledge Loading)

에이전트가 활성화될 때 다음과 같은 우선순위 계층으로 지식이 주입됩니다:
1. **프레임워크 기본 방법론 지식**: `core/knowledge/<agent-name>/`
2. **공통 공유 지식**: `core/knowledge/aidlc-shared/`
3. **팀/프로젝트 전용 커스텀 지식**: `aidlc/knowledge/<agent-name>/`

---

## 6. Tier(티어) 시스템 및 동적 모델 투영 (Projection)

### ① 등장 배경
- **기존 문제**: 에이전트 정의에 `model: opus` / `model: sonnet`을 하드코딩하면, 상위 모델을 쓰는 세션이 강제 다운그레이드되거나 Claude/Kiro/Codex/Cursor 등 CLI마다 모델 식별자가 달라 호환성 에러가 발생함.
- **해결책**: 에이전트 정의에는 작업의 복잡도/성격인 **`tier`**만 명시하고, 패키징 빌드(`package.ts`) 시 각 CLI 하네스에 맞는 네이티브 설정으로 자동 변환(Projection)함.

### ② 3가지 Tier 분류

| Tier | 대상 에이전트 | 작업의 성격 | 모델 & 추론 Effort 할당 정책 |
|---|---|---|---|
| **`judgment`** | `architect`, `developer`, `product`, `design`, `quality`, `aws-platform`, `compliance`, `devsecops`, `composer` (9개) | • 다중 제약 조건 추론<br>• 모호한 요구사항 해석<br>• 아키텍처/코드/보안 등 하류에 큰 영향을 미치는 핵심 결정 | **절대 다운그레이드하지 않음**<br>사용자가 세션에서 선택한 모델과 Reasoning Effort를 100% 그대로 상속(`inherit`). |
| **`balanced`** | `product-lead`, `architecture-reviewer` (2개) | • 기작성된 산출물을 명시적 기준/체크리스트와 대조 평가하는 리뷰 작업 | **중간급 고성능 모델 + 중간 Effort (`medium`)**<br>과도한 추론 비용을 방지하면서도 검증 품질을 유지. |
| **`templated`** | `delivery`, `pipeline-deploy`, `operations` (3개) | • 딜리버리 계획, CI/CD YAML, Runbook 등 이미 패턴이 정형화된 작업 | **비용 절감형 다운그레이드**<br>중간급 모델 + 감축된 Effort (`medium`)를 적용하여 토큰 비용 절감. |

### ③ 전역 비용 상한 제어 (Tier Cap)
- `memory/project.md` 등의 설정 파일에 `tier_cap: balanced`를 선언하거나, 환경 변수 `AIDLC_TIER_CAP=templated`를 통해 프로젝트 전체의 모델 상한선을 한 번에 제어할 수 있습니다.
