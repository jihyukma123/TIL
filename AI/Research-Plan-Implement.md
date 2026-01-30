# [Advanced Context Engineering](https://www.youtube.com/watch?v=IS_y40zY-hc) 을 보고

Context를 sub-agent로 관리하는걸 넘어서, 일부러 컴팩트를 여러 번 진행한다고 함

그리고 research -> plan -> implement 3단계를 거쳐서 기능을 구현한다고 함.

## 인상깊었던 부분

1. Leverage가 높은 활동에 시간을 많이 투자해라.

research -> plan -> implement 로 구성된 프로세스로 작업을 한다고 하면,

2.

## 문서 및 프롬프트 링크

- the document -> https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md
- research prompt -> https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/research_codebase.md
- plan prompt -> https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/create_plan.md
- implement prompt -> https://github.com/humanlayer/humanlayer/blob/main/.claude/commands/implement_plan.md

## 나라면 어떻게 할까?

목표

- LLM에게 일 시켜서 프로덕트 만들기(내가 최대한 코딩을 하지 않는 것이 목표임)
- Context 관리 구조를 명시적으로 이해하기
- 시켜야되는 작업의 성격을 명확하게 분리(Plan -> Implement를 한 번의 Turn에 하지 않는다.)
- 적절한 HITL Point 탐색.
- 표준화된 방법 도출(여러 단계를 걸쳐서 human이 link가 되어서 넘긴다면, 나눠지는 단계별로 어떤 output/input 스키마를 가져야할지?)
- fully-controlled, fully-human-aware AI SDLC가 되어야 한다.

나에게 주어진 도구는

- cli 기반 AI-Assisted Coding Agent

### 흠흠

일단 보면, 가장 먼저 생각해서 테스트 했던 방법은 Main Agent와 여러 Sub Agent를 활용해서

예를 들면

Main Agent -> add-feature-workflow 라고 한다면, 그 아래에, spec-agent/implement-agent/review-agent 등등을 두고,

sequential하게 작업을 하도록 지시하였음.

이 단계를 좀 많이 써본 다음에 다른 단계에 대해서 논의를 할 수 있을 것 같은데...

이 방식하고,

방식 B 하고 어떤게 더 완성도 있는 결과물로 이어지는지에 대해서 생각을 해봐야하나?

둘 다 만들어보되 최대한 구조화를 해보자.

어떤 결과물을 원하는지?

그리고 궁금한건 내가 얼마나 기획 부분에 에너지를 쏟아야 하는지?

예를 들어서 Spec Agent가 반환해야되는 결과물은 무엇인지?

본질적인 부분이 뭐지?

-> 내 코드에 LLM이 접근할 수 있는 환경에서,
-> 모델에게 지시를 내려서,
-> 원하는 작업을 수행하도록 한다.

이건데...

Context Engineering -> 지시를 할 때 최대한 필요한 정보, 중요한 정보만 제공을 하자 왜? LLM은 순수함수라서 오로지 input에 의해서 output이 결정됨. input에 유관정보만 입력해야지 output에도 유관정보가 입력된다.

무엇이 각 단계별로 '유관'정보인지 알려면, 먼저 사람이 프로그래밍을 할 때 어떤 과정으로 문제를 해석하고 처리하는지 깊게 생각해보는 과정을 통해서 재구축해보는게 필요할 것 같음.

## 사람은 문제를 풀 때 어떤 과정을 거치는지?

---

사람이 작업을 할 때, 유관 정보가 뭐지? (유의미한건 greenfield보다도 brownfield 프로젝트일테니까, brownfield를 기준으로 생각해보자.)

기존에 이미 복잡도가 어느정도 있는 코드베이스에

1. 새로운 기능을 추가하거나
2. 기존 기능을 수정하거나

model에게 input을 잘 줘야 하는 이유는? 왜 garbage in, garbage out 이라고 하는걸까. -> 대략적으로는 알고 있는데 명확하게 말을 못함. 이것도 기본적인 내용은 잘 숙지하고 있어야지 설명도 가능하고 나도 잘 쓸 수 있고. 왜 하는지 이해하고 해야지
