# Understanding the AIDLC Concept (V2)

aidlc -> 핵심목적이 뭐지? 

(그리고 그 핵심 목적을 달성하기 위해서 짠 core한 구조 중 한 가지가 이 forwarding loop 메커니즘일진데. 왜? 왜 이렇게 짰을까? 핵심 목적 달성에 어떻게 도달하려고? 이런 생각이 들어서 먼저 흔들리지 않는 목적에 대한 foundational 이해가 필요하다고 생각함 stage가 있고 phase가 있고 이런거 말고 aidlc가 그런거 해서 뭐하려고 하는건데에 대해서 먼저 명확하게 인식하고 가는게 좋을 것 같다.)

Software Development의 범위: requirement ~ deployment

## 배경과 목적

AI-DLC는 인간과 AI Agent가 개발 작업에 참여하는 방식을 구조화한 것.

v1 -> 개발 작업을 여러 stage로 나눠서 적절하게 HITL하는 구조가 AI를 활용한 소프트웨어 개발에 충분히 활용될 가치가 있다는 것을 확인
v2 -> v1 방법론은 유지(큰 작업을 명문화된 단계로 쪼개고, 사람이 개입), 근데 workflow 계층을 progressively towards autonomous software delivery 할 수 있게 새롭게 설계. 

근데 이해가 안되는 부분: v2를 만들게 된 원인 2가지가, 1. 사람들이 더 세분화해서 필요에 따라 조합해서 쓸 수 있는 작업 방식을 원했고, 2. 마침 또 ai 개발 생태계가 발전하면서 구조적으로 세분화 할 수 있는 방법들이 생김(skills + multiagent orchestration through subagents) 
근데 이런 니즈가 왜 workflow 계층을 '점진적 autonomous software delivery가 가능한 형식으로 개선'하는 결과로 이어지는지 캐치가 잘 안됨.
-> 왜 needs for granularity를 autonomy를 plausible 하게 만드는 설계로 해결했는지?
-> GPT가 추측하는 원인은, 
  - `커스텅마이징 요구`는 v2가 필요한 사업적 이유(needs -> solve -> value 관점에서)
  - `Skills & Multi-agent runtime` -> v2를 만들 수 있게 된 기술적인 근거
  - `인간 개입의 점진적 축소`는 v2가 궁극적으로 달성하려는 전략적 목표
  - 둘 사이를 연결하는 `명시적 계약과 검증 가능한 stage 구조`가 브리지 로직에서 생략됨.
    - 뭔소리여...ㅋㅋㅋㅋ
    - v2는 개발을 여러 단계로 나누고 각 단계를 독립적으로 뽑아서 조합 가능한 형태로 구성함. 그리고 각 단계별로 (input/output/검증조건) 명시적으로 정의. -> 이런 구조를 통해서 인간이 수행하던 반복적인 판단/검증을 기계가 실행할 수 있는 계약과 규칙으로 점진적 변환이 가능함. -> skills + multiagent runtime은 단순히 커스터마이징이 가능하게만 하는 기술이 아니라, 인간의 판단을 독립적 자동화 단위로 추출하기 위한 기반

  -> 세분화에 대한 니즈를 기반으로 더 세분화 했을 때, 잘 동작할 수 있는 구조를 짜면서 동시에 그 구조가, 점진적으로 인간의 검증 판단 등을 규칙으로 뽑아내서 기계에 위임하는걸 반복적으로 수행해서 점점 인간의 역할은 축소되고 기계가 처리하는 부분이 확대되는 반복 개선이 가능한 구조가 되도록 설계하려고 목표했다.

aidlc목적 -> 인간과 ai agent가 협업해서 개발하는 구조를 제시
-> v1은 인간과 ai agent 협업을 위해서 개발을 여러 stage로 나누고 중간중간 HITL 잘 하면 된다는거 입증함
-> v2를 더 나아가서, 사람의 개입을 점진적으로 줄이는 것을 목표로 함. 이와 동시에 사람들의 니즈가 v1에 비해서 더 자기들 입맛에 맞춰서 조각처럼 조합할 수 있는 구조였고, (react component 같은 느낌으로 이해하긴함) 그래서 이렇게 작은 조각들을 어떤 구조로 설계해야 2가지를 할 수 있을까를 고민한 것 같음
  - 여러 조각들 중에서 원하는 것만 뽑아다가 조합이 가능한 구조는 어떻게 만들지?
  - 이렇게 조합했을 때, 어떻게 as a whole로 봤을 때 개발자의 판단/검증 규칙 등을 이 구조의 구성요소에 녹여내서 궁극적으로는 사람이 개입하지 않아도 의도에 맞게 기계가 알아서 하는 비중을 높여나갈까?

## Structure

그래서 어떻게 구조화한건데?

구조가 이해가 잘 안돼서 GPT한테 물어봄

```
1. 어떤 설계 원칙을 적용할 것인가?
   └─ DRY, 관심사 분리, 도구별 native 기능 활용

2. 시스템을 어떤 구성요소로 나눌 것인가?
   ├─ Persona-Agent
   ├─ Stage
   ├─ Knowledge
   ├─ Orchestrator
   └─ Package Manager

3. 그중 핵심 구성요소인 Stage는 어떻게 동작할 것인가?
   └─ Generate → Verify → Learn

4. 여러 Stage를 전체 workflow로 어떻게 조정할 것인가?
   └─ Orchestrator

5. 이 공통 구조를 각 도구용 결과물로 어떻게 변환할 것인가?
   └─ Package Manager
```

관통하는 핵심 동작 루프:
  인간 요청 -> clarification loop -> create plan & execute -> 결과로 artifacts 생성 -> 생성된 결과물에 대해 self-verification 수행 -> pass or fail (if pass, AI Loop finishes and asks for human verification, if fails, run self-correction or consult human)
  
## Orchestrator 정의

관심사의 분리 관점에서, Orchestration 계층은 여러 Stage를 적절히 구성하고 실행하며, 각 단계의 결과를 연결해 최종적으로 원래의 목표가 달성되도록 전체 workflow의 흐름과 결과를 책임지는 계층이다. 이 계층은 그 과정에서 다섯 가지 핵심 책임을 수행한다.

1. Goal Ownership

전체 목표와 최종 결과에 대한 책임

2. Workflow Composition

상황에 맞게 Stage들을 조합해 workflow를 구성하는 책임

3. Routing, Observability, and Control

입력 전달, 실행 순서, 상태 추적, 중단·재개·escalation을 관리하는 책임

4. Abstraction Boundary

Stage 내부 구현에는 간섭하지 않고, 선언된 계약과 결과만을 기준으로 다루는 책임

5. Cross-Stage Invariants

여러 Stage에 걸쳐 공통으로 지켜져야 하는 규칙을 확인하고 강제하는 책임


## Package Manager

SSOT stage definition을 개별 도구에 최적화된 내용으로 변환해서 사용하는 형태로 할 수 있게 관리하는 구조를 나타낸 것 같은데....

Codex를 예시로 실제로 뭘 어떻게 변환한다는건지 한 번 알아봐야할 듯.

```
SSOT
canonical stage definition
        ↓
각 도구별 adapter / emitter
        ├─ Claude Code용 실행 정의
        ├─ Codex용 실행 정의
        ├─ Kiro용 실행 정의
        └─ Cursor용 실행 정의
```

## 구현 가이드라인(이자 내가 이해하기로는 설계 철학..?)

Deterministic routing
→ Agent가 멋대로 workflow를 바꾸지 않아야 한다는 통제 철학

Agent specialization
→ 하나의 범용 AI보다 역할과 전문성을 분리해야 한다는 설계 철학

Artifact traceability
→ 결과물이 어디서 왔고 어떻게 만들어졌는지 추적 가능해야 한다는 원칙

Human approval
→ 완전 자동화를 전제하지 않고 인간 판단을 명시적으로 남겨둔다는 철학

Tool-owned state
→ 상태와 audit을 Agent의 자연어 응답에 맡기지 않고 시스템이 관리해야 한다는 원칙

Advisory verification
→ AI 검증을 절대적인 판정으로 과신하지 않고 인간 판단을 보조하도록 한다는 원칙

Controlled learning
→ AI가 규칙을 몰래 바꾸지 못하게 하고, 학습을 통제된 승격 과정으로 만든다는 원칙

No hidden delegation
→ Agent가 보이지 않는 하위 Agent를 무한히 만들지 못하게 하고, 모든 실행을 추적 가능하게 한다는 원칙
