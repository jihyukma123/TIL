# [스탠포드에서 빅테크로 조용히 퍼지는 개발자 생존법, 대부분 모릅니다 | 미하일 에릭](https://www.youtube.com/watch?v=qEF-eUaTq0Y)


- 탄탄한 기본기 + AI Native로 일할 수 있어야 한다.
- AI native engineering이란?
  - has strong backing foundation on traditional programming like system design and algorithmic thinking
  - and also is very confident in using agentic workflows

추천하는, agentic workflow에 익숙해지는 방법:
- iterably add more work for the agents.
- 내가 하는 일 중에서 에이전트에게 맡겨서 처리하는 일을 반복적으로 늘리는 것.
- make sure you first understand what has to be done -> and then know where the lines are between those items of work.
 - 좋은 팁인듯. 일단 내가 뭘 하려고 하는지를 명확하게 알아야 하고, 그 일을 어떻게 쪼개야지 잘 시킬 수 있는지 알아야 함. 
 

know how to context switch
- 계속 돌아가는 Agent 들 사이에서, 왔다갔다 하면서 작업을 관리해야되기 때문에 이 context switching 능력이 critical 할 것으로 보임. 
  - 이 context managing 은 사실 human manager가 원래도 갖춰야 할 역량이기는 함.
  - 그러네 마치 일을 시키는 사람처럼 사고해야되는걸까 이제는? 누군가 시키는 일을 하는게 아니라 내가 사람을 고용해서 일을 시킨다고 생각하고 구조를 짜야할수도.

Agent friendly Codebase
- 에이전트가 코드베이스를 이해할 수 있을 것인가?
  - 테스트를 강조함. test = contracts that define the correctness of the software.
    - 오호라...테스트는 소프트웨어가 제대로 동작하는지를 정의하는 계약같은거라....
 - 이 contract를 명확하게 정의해야한다.
  - Agent 또한 이 contract가 명확할수록 더 잘 동작할 가능성이 높아진다.
- README는 생각보다 빠르게 codebase와 어긋남. -> 정확하지 않는 README는 agent 입장에서는 없는 것보다 안좋은 데이터

Agent는 오류를 매우 빠르게 증폭시킨다.
- 처음에 잘못되면, 그 wrong의 범위가 iteration이 반복되면서 그걸 기반으로 계속 확장되면 앞단의 잘못된 사항이 계속 뒤로 전파전파 이걸 기반으로 더 잘못되는게 반복됨.
- Reasearch -> Plan -> Implementation
- 코드베이스 일관성이 잘 갖춰져 있는 상태에서 시작해야지 Agent가 정해진 규칙성을 잘 따르게 됨 -> 설계 패턴이 일관되어야 함.

단순히 돌아가게 만드는, 이정도면 됐다 싶은 단계를 넘어선 완성도를 추구할 때 taste가 생긴다.


## Experimentation

직접 많은 실험을 통해서 해보면서 나만의 Workflow를 내재화 해야한다.

## Teaching Software

디지털 수단을 사용해서 복잡한 시스템을 구축하는 방법을 가르치는 것.

알고리즘을 활요...

수학에 더 가깝다는 것. 

사람에게 '생각하는 법'을 가르치는 것

문제를 쪼개서, 

- 작동 방식을 보고, 고치고, 확장하고, 반복적으로 개선하는 사람.

개발자 -> customizing에 적극적임 안되면 고치려고 하고, 왜 이렇게 된건지 궁금해하고 등등...


