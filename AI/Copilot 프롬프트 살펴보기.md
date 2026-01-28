# Codex CLI 프롬프트 살펴보기

Codex CLI로 개발 작업을 지시하면 유난히 오래걸려서, 도대체 왜이러나 궁금증이 생김.

Codex CLI 는 오픈소스라서 프롬프트가 공개되어 있을 듯 하여 살펴보았음.

## 기본 프롬프트: prompt.md

Plan에 대한 부분

- 모호한 작업을 잘 쪼개라는 지시
- 간단한 작업은 플랜 하지말라고 함
- 단계별로 작업 처리 전에, plan의 각 단계를 처리했는지 확인하라는 지시사항이 있음.
  - 필요하다면 plan을 변경하라는 지시도 있음
- plan을 세우는 조건
  - task가 오래걸릴 것 같으면
- Few shot형태의 예시가 주어져있는데, 최소 5~6 단계로 구성된 plan 예시들이 주어짐(그래서 5개 정도로 쪼개는 경우가 많은걸까?)
- 작업이 복잡하거나, 순서가 중요하거나, 모호하거나, 할 일이 많을 때 사용자에게 진행 상황을 투명하게 공유하고 스스로 체계적으로 일하기 위해 '계획(Plan)' 기능을 활용하라는 가이드라인
- update_plan 이라는, plan item 별 진행 상황 및 전체 진행 중인 plan을 관리하는 도구를 항상 호출하도록 되어 있음
  - 이 부분도 추론 과정에서 하나의 새로운 more accurate, but slower의 이유가 될 수 있을 것으로 보임.

## Task Execution ~ Validation

- 작업 잘 하고 있는지 확인하고, 절대 멈추지말라는 지시가 있음.
- 자율적으로 최대한 알아서 일을 끝내라는 형식..

이게 약간 혼자서 멈추지말라는 프롬프트가 많이 들어간 것 보니까 그런 경향성이 있나...?

## 모델별 프롬프트

재밌는 사실은 Codex에는 모델별로 프롬프트가 따로 작성되어 있다.

### GPT 5.2 프롬프트 특징

간단하게 요약하자면,

- 분석만 하지말고 직접 구현도 제대로 해라(아마 general model이라서 이렇게 따로 구현에 대한 강조를 추가하지 않았을까..)
- 함수 호출이 실패해도 포기하지마라

이런 프롬프트들과, 출력규칙에 대한 프롬프트도 있음

- 너무 verbose하게 출력하마라.

요약하자면

> 더 적게 말하고 더 많이 일해라.

### GPT-5.2-Codex 프롬프트 특징

재밌는게, Frontend Task에 대한 명시적인 지시 프롬프트가 들어가있음.

- 누가봐도 AI가 만든 것 같은 전형적인, 평균적인 레이아웃 하지말라고 함
- 의도가 있고, 대담하고 약간 좀 놀라움을 줄 수 있는 UI 짜는 걸 목표로 하라고...(ㅋㅋㅋㅋ 쇼잉이 좀 들어가있네)
- 글씨체, 룩앤필, 애니메이션, 배경색상 등에 대한 지시사항이 있음
- desktop/mobile 둘 다 고려하라는 것도...

그리고 추가로 Git 관련 안전 규칙이 추가되어 있음.

- NEVER revert existing chages
- 전체적으로 원래 있떤 작업을 날려먹는걸 방지하기 위한 프롬프트가 많음
- 절대 destructive command를 쓰지 말라고 되어있음.

아마 어느정도 이미 코딩에 특화된 모델이라,

프롬프트 자체는 짧음(81줄) but 세부적인 최적화 지침이 존재.

# Copilot 프롬프트

Agent mode일 때 적용되는 기본 프롬프트.

앞서 살펴봤던 Codex CLI 프롬프트에 비해서 2가지 차이점이 있음

- Planning에 대한 강조가 상대적으로 떨어짐
- preamble 메세지 표시에 대한 프롬프트 없음

뿐만 아니라, Codex는 프로세스 전반에 걸쳐서 지속적으로 사용자에게 피드백을 제공할 것을 명시함. (전반적으로 프로세스 안정성 및 계획성을 매우 강조하는 것으로 보임)

- nested AGENTS.md 파일이 영향을 줄 수 있는지?(Codex는 하위 디렉토리에도 있을 수 있다고 프롬프트가 들어가있음. 반면에 copilot은 그냥 처음에 한 번 찾고 끝임)

# AI를 활용한 비교

네, 정확합니다! 두 프롬프트를 직접 비교해서 **Codex가 왜 더 많은 추론을 유도하는지** 구체적으로 정리해 드리겠습니다.

---

## 📊 프롬프트 복잡도 직접 비교

### 1. **조건부 판단 요구량**

#### Codex CLI:

```
Be mindful of whether to run validation commands proactively. In the absence of behavioral guidance:
- When running in non-interactive approval modes like **never** or **on-failure**, proactively run tests...
- When working in interactive approval modes like **untrusted**, or **on-request**, hold off on running tests...
- When working on test-related tasks... you may proactively run tests regardless of approval mode.
  Use your judgement to decide whether this is a test-related task.
```

→ **3가지 조건 + 예외 케이스 판단 + 주관적 판단 요구**

#### VS Code Copilot GPT-5.1:

```
If the codebase has tests or the ability to build or run, consider using them
to verify that your work is complete.
```

→ **단순 권장, 조건 분기 없음**

---

### 2. **메타 인지 요구 (자기 상태 판단)**

#### Codex CLI:

```
Before running a command, consider whether or not you have completed the previous step,
and make sure to mark it as completed before moving on to the next step.
```

→ **매 단계마다 자기 상태 점검 필수**

```
Do not repeat the full contents of the plan after an `update_plan` call —
the harness already displays it. Instead, summarize the change made...
```

→ **출력 중복 여부 인지 필요**

#### VS Code Copilot GPT-5.1:

```
Do not repeat the full contents of the plan after an `manage_todo_list` call
```

→ **유사하지만 덜 강조됨**

---

### 3. **상황별 행동 분기 수**

#### Codex CLI (Ambition vs Precision 섹션):

```
For tasks that have no prior context (i.e. the user is starting something brand new),
you should feel free to be ambitious and demonstrate creativity...

If you're operating in an existing codebase, you should make sure you do exactly
what the user asks with surgical precision...

You should use judicious initiative to decide on the right level of detail and
complexity to deliver based on the user's needs.
```

→ **3가지 상황 × 다른 행동 패턴 판단 필요**

#### VS Code Copilot GPT-5:

```
For tasks that have no prior context, you should feel free to be ambitious...
If you're operating in an existing codebase, you should make sure you do exactly
what the user asks with surgical precision.
```

→ **2가지 상황 (동일하지만 "judicious initiative" 판단 요구 없음)**

---

### 4. **출력 포맷 규칙 복잡도**

#### Codex CLI:

```
**Section Headers**
- Use only when they improve clarity — they are not mandatory for every answer.
- Choose descriptive names that fit the content
- Keep headers short (1–3 words) and in `**Title Case**`
- Leave no blank line before the first bullet under a header.
- Section headers should only be used where they genuinely improve scanability

**Bullets**
- Use `-` followed by a space for every bullet.
- Merge related points when possible; avoid a bullet for every trivial detail.
- Keep bullets to one line unless breaking for clarity is unavoidable.
- Group into short lists (4–6 bullets) ordered by importance.

**Monospace**
- Wrap all commands, file paths, env vars, and code identifiers in backticks
- Apply to inline examples and to bullet keywords
- Never mix monospace and bold markers

**File References**
- Use inline code to make file paths clickable.
- Each reference should have a stand alone path.
- Line/column (1‑based, optional): :line[:column] or #Lline[Ccolumn]
- Do not use URIs like file://, vscode://
- Do not provide range of lines

**Don't**
- Don't use literal words "bold" or "monospace"
- Don't nest bullets or create deep hierarchies
- Don't output ANSI escape codes directly
- Don't cram unrelated keywords into a single bullet
- Don't let keyword lists run long
```

→ **20개+ 상세 규칙, 매 출력마다 체크 필요**

#### VS Code Copilot GPT-5.1:

```
Section Headers:
- Use only when they improve clarity
- Keep headers short (1-3 words) and in **Title Case**

Bullets:
- Use `-` followed by a space for every bullet.
- Merge related points when possible
- Keep bullets to one line

Don't:
- Don't nest bullets or create deep hierarchies.
```

→ **10개 미만의 규칙, 상대적으로 단순**

---

### 5. **AGENTS.md 처리 규칙**

#### Codex CLI:

```
- These files can appear anywhere within the repository.
- The scope of an AGENTS.md file is the entire directory tree rooted at the folder that contains it.
- For every file you touch in the final patch, you must obey instructions in any AGENTS.md file whose scope includes that file.
- More-deeply-nested AGENTS.md files take precedence in the case of conflicting instructions.
- Direct system/developer/user instructions take precedence over AGENTS.md instructions.
```

→ **5단계 우선순위 계층 + scope 계산 + 충돌 해결**

#### VS Code Copilot:

```
(코드에서) const uri = joinPath(folder, '.github/copilot-instructions.md');
```

→ **고정 경로 1회 확인**

---

## 📈 추론 복잡도 정량 비교

| 측정 항목                  | Codex CLI | VS Code Copilot GPT-5.1 |
| -------------------------- | --------- | ----------------------- |
| **조건 분기 수**           | ~15개     | ~5개                    |
| **"판단하라" 명시적 요구** | 6회       | 1회                     |
| **상황별 다른 행동**       | 3+ 모드   | 1-2 모드                |
| **출력 포맷 규칙**         | 20+       | ~8                      |
| **우선순위 계층**          | 5단계     | 1단계                   |
| **메타인지 체크포인트**    | 매 단계   | 선택적                  |

---

## 🧠 추론 유도 문구 직접 비교

### Codex CLI의 "생각하라" 문구들:

```
"Use your judgement to decide whether this is a test-related task"
"consider whether or not you have completed the previous step"
"Use judicious initiative to decide on the right level of detail"
"Be mindful of whether to run validation commands"
"You should balance being sufficiently ambitious and proactive"
```

### VS Code Copilot의 문구들:

```
"consider using them to verify"
"you should feel free to be ambitious"
```

---

## 🎯 결론

**Codex CLI 프롬프트가 더 복잡한 이유:**

1. **다중 조건 분기**: approval mode, task type, context 여부 등에 따라 다른 행동 요구
2. **명시적 판단 요구**: "Use your judgement", "judicious initiative" 등 주관적 결정 강제
3. **상세한 출력 규칙**: 20개+ 포맷팅 규칙으로 매 출력마다 compliance 체크 필요
4. **계층적 우선순위**: AGENTS.md의 5단계 우선순위 계산
5. **지속적 자기 점검**: 매 단계마다 상태 확인 및 plan 업데이트 요구

**결과적으로:**

- **Codex**: 모델이 더 많은 **internal reasoning** (내부 추론)을 수행
- **Copilot**: 더 **직관적/즉각적** 행동 유도

이것이 Codex가 더 오래 걸릴 수 있는 **프롬프트 수준의 근본 원인**입니다! 🎯
