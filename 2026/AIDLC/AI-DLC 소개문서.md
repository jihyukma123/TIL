# [AI-Driven Development Life Cycle: Reimagining Software Engineering](https://aws.amazon.com/ko/blogs/devops/ai-driven-development-life-cycle/)

AI-DLC의 시작을 알린 문서

한 번 읽어보자.


## 우리가 비즈니스 환경에서 추구하는 목표들(North Star goals)

- improve productivity
- increase velocity
- foster experimentation
- reduce TTM(Time-To-Market)
- enhance developer experience

AI가 이런 목표를 달성하기 위해서 많이 사용되는데, 이 과정에서 크게 2가지 방식으로 사용됨
- AI-assisted development -> AI가 SDLC의 특정 task를 효율화
- AI-autonomous development -> AI가 요구사항 기반으로 앱 자체를 만들기

2가지 접근법 모두, 속도 및 퀄리티 측면에서 만족스럽지 않았고, 이런 문제를 AI-DLC를 통해서 해결하고자 함.


## 개발 방법론의 전환이 필요함

기존의 개발 방법론들은 사람이 주도하는 개발 환경에 적합했는데, 이는 AI가 사이클에 포함되어야 하는 상황에서는 적절치 않음.

그래서 정말 AI가 제공하는 이점을 온전히 활용해서 앞서 언급했던 North Star들을 달성하려면, 새로운 접근법이 필요하다는 결론...

그래서 `AI-DLC`라는, 새로운 방법을 제시.

## AI-DLC가 뭔데?

2가지를 강조하고자 하는 방법임

- AI Powered Execution with Human Oversight
  - 중요한 의사결정을 사람에게 맡긴다.
- Dynamic Team Collaboration
  - routine한 작업을 AI에게 맡겨서 확보한 개별 작업자의 시간을, 팀 활동에 더 사용해서 혁신과 딜리버리퀄리티를 높이는 등 더 가치가 높은 팀 collaboration 활동에 투입. (isolated work -> hign energy teamwork. isolated work라고 하면 개발자가 각각 티켓을 받아서 어느정도 다른 사람들이 뭘 하는지 모르고 자기 할일만 하던 그런걸 얘기하는 듯..?)

2가지를 활용해서 더 빠르게 SW를 제공하면서도 퀄리티는 유지


## 그래서 뭐 어떡하라고?

일단 기본 사이클이

Create Plan -> Seek Clarification -> Provide Clarification -> Implement Plan -> Create Plan -> ...

여기서 중요한 포인트 하나는, `AI가 사이클을 시작하는 주체`라는 점. 사람이 아니라 AI가 Create Plan으로 시작.

그리고 4단계 핵심 사이클에서 사람이 수행하는 역할을 provide clarification

이 기본 base를 기반으로, 3가지 단계를 거쳐서 수행함

- Inception: AI가 비즈니스 목적을 상세한 요구사항, story, unit 들로 변환. "mob elaboration" -> 팀 전체가 이 과정에서 AI가 clarification을 위해 물어보는 질문과 제안하는 내용을 검증
- Construction: 인셉션 단계에서 검증된 컨텍스트에 대해서 AI가 아키텍처, 도메인모델, 코드 개발 방향성 및 테스트를 'mob contruction'으로 구축 -> 마찬가지로 팀 차원에서 함께 AI가 제시하는 선택지들에 대해서 clarification 진행 및 Generate code & test
- Operations: AI가 이전 단계들에서 취합한 컨텍스트를 기반으로 배포 파이프라인 구축하고 IaaC 방식으로 배포

## 이 방법의 장점

이 방법을 썼을 때 어떤 부분이 좋아야 하는지, 그 지향점이 뭔지 알아보자.

- 속도: 가장 큰 장점은 개발 속도의 향상.
- 혁신: 개발 속도 향상 그리고 여러 가지 작업을 위임해서 확보한 시간은 innovation을 위해서 사용
- 퀄리티: 여러 단계의 clarification 활동을 통해 intent와 구현 결과 간의 갭을 최대한 줄임. 비즈니스 목표에 맞는 결과가 나오고, 그 결과는 조직의 기준을 잘 준수하고 있음(있기를 기대함.) 비즈니스 목표를 해석하는 단계에서 구현부터 테스트까지 e2e AI 통합은 요구사항 -> 배포로 이어지는 전 단계에서 일관성과 추적 가능성을 향상
- Market responsiveness: 개발 사이클이 빨라지니까 시장 요구사항 변화 및 사용자 피드백에 기민하게 대응 가능
- Developer experience: '이론적으로는' 개발자들이 단순한 코드 작성 작업에서 벗어나서 중요한 문제 해결에 involve 되는 핵심 작업 변화와 더불어서 deeper business context 이해 및 이를 기반으로 각자 하는 일이 어떻게 비즈니스 가치 창출로 이어지는지 더 잘 보게 됨..


## 배운 점

Core Value: `Velocity.`

SDLC의 trivial한 부분을 최대한 AI한테 위임해서 우선 속도를 높이는 것이 가장 본질적인 목표(퀄리티 등등 이거는 부차적인 목표라고 이해함. 결국 속도가 제일 중요한 달성하고자 하는 목표임) 근데 빠르기만 하면 안되니까, 품질 수준은 최소한 동일하게 유지하면서 속도를 빠르게 하는 것.

최우선 목표는 속도구나. 결국 측정해야 되는 건, '그래서 이거 쓰면 빨라짐?' 이거구나.

그러면 측정 지표도 속도가 되어야 하나?

AI DLC를 썼을 때, 안쓰는거 대비 속도가 줄어들면, 즉 안쓴거보다 delivery 속도가 얼마나 올라가는지.
