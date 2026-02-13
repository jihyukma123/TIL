# [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)

OpenAI에서 Harness Engineering이라고 하는, 손으로 작성한 코드가 단 한줄도 없는 (0 lines of manually written code) 소프트웨어 출시를 목표로 2025년 8월부터 반년간 테스트한 결과에 대한 게시글

> Humans steer. Agents execute.

이렇게 제약을 둔 이유는, 어정쩡하게 사람이 개입할 여지 자체를 없애버려서 정말 일하는 방식, 구조 등을 변경하려고 의도한 것.

일부러 제약을 둬서 AI를 기반으로 개발하는데 최적화된 ecosystem을 만들려고 의도한 것 같음. 극단적인 생산성 향상을 위해서

## background

Software Engineering Team의 역할이 더이상 코드 작성이 아닌, 환경을 설계하고 의도를 명시하고, Codex 등 AI Agent가 안정적으로 작업을 수행할 수 있도록 하는 Feedback loop을 구축하는 것이라는 점을 이해해야 한다고....

역할 변화, 역할이 변하면서 어떤 것을 해야하는지, 어떤 환경적인 변화가 필요한지, 어떻게 리소스를 배분할지 등등..

경험을 통해서 제일 중요한 리소스인, human time and attention을 어디에 쏟을 것인지.

중요한 포인트인것 같다. 나의 인지적 에너지를 어디에 투자할 것인지?

## Redefining the role of the engineer

코드를 작성하지 않으면 이제 뭐해?? -> 다른 종류의 엔지니어링 작업을 해야지

systems, scaffolding, leverage

- systems: AI Agent가 제대로 작동하는 환경. AI가 병목없이 일할 수 있는 구조를 갖춰야 함.
- scaffolding -> 구조적 뼈대를 말하는거임.
- leverage: human resource를 최대한 효율적으로 쓰는 방식

Engineering Team의 primary goal이 프로덕트를 만드는 것이 아니라, 'enabling the agents to do useful work'

그거 어떻게 하는건데?

'소프트웨어 개발'이라는 거대한 block을 작은 block으로 나누고(design, code, review, test 등등)

각각 블록 단위로 처리하는 느낌으로 만들었다고 함. 각각 블록을 잘 만드는데 신경을 많이 쓴거지. 도구를 잘 날카롭게 다듬는 것부터 집중적으로 처리했다고 이해하는 게 맞는 것 같음.

코드 리뷰도 거의 다 agent-to-agent로 돌아가는 형식으로 처리했다고 함.

그리고 늘릴 수 없는 자원(인간)으로 인해서 발생하는 병목이 있었는데 QA를 할 수가 없음 다 그래서 QA의 영역도 Agent에게 위임할 수 있는 시스템을 설계했다고 함.

chrome devtools mcp 같은걸 써서 UI 디버깅, 관찰 등 기능을 넘겨서 이런 부분들도 llm 이 할 수 있게..

logs, metrics, traces 등도 같이 Codex에게 observability 접근성을 줘서, 지표 기반 개선도 가능하다고 함.

바로바로 버그를 해결하거나 하는 것도 가능하겠지 사람이 자고 있을때도..?

## Give codex a map, not a 1000-page instruction manual

AGENTS.md에 다 때려넣고 하는 방식 -> 실패함

- context는 희소자원임. 불필요하게 커지면, 내용이 소실된다.
- too much guidance === no-guidance
- 관리 어려움. 문서 현행화가 제대로 안되어있으면, AI는 그걸 판단할 능력이 없음 그냥 그대로 수행할 뿐.
- 검증하기가 어려움.

여기에 다 때려넣는게 아니라, index처럼 써야한다는거임.

특이한 점은,

- Plan -> first class 산출물 즉 코드와 같은 느낌으로 관리한다는 것.
  - 컨텍스트 관리 대상으로 고려해서 같이 히스토리를 계속 관리해서, 외부 컨텍스트를 참조할 필요를 없게 하는 것.

그리고 문서 관리 역할을 수행하는 agent가 주기적으로 돌면서 obsolete한 문서를 찾거나 해서 개선하는 pr을 오픈하는 식으로 동작함.

문서를 관리하는 것에 정말 신경을 많이 썼다는 걸 알 수 있네

## Agent legibility is the goal

Agent가, repository만 보고서도 바로 business domain에 대해서 이해할 수 있도록 하는 것이 목적임.

그리고 하나 재밌는 점은, Agent에게 legibility를 제공해주려고 심지어 기술적인 것 까지 Agent 친화적으로 변경했다는 것.

예를 들어서, 어떤 기능은 그냥 외부 라이브러리를 쓰는 것보다, 일부 필요한 기능만 뽑아서 다시 구현하는게 더 cheap 하게 먹힌다고 언급하기도 함.(재밌네 그러네 구현이 쉬워졌으니까, 그냥 필요한것만 별도로 만들어서 넣는게 나을지도..?)

Pulling more of the system into a form the agent can inspect, validate, and modify directly increases leverage—not just for Codex, but for other agents (e.g. Aardvark) that are working on the codebase as well.
-> Codex 뿐만 아니라 모든 agent들에게 다 benefitial 하다는 점.

음음 확실히 좀 새로운 관점이긴 하네. AI-DLC도 이런 느낌일 것 같긴한데 그거보다 더 약간 시스템적인 느낌?

## Enforcing architecture and taste

문서만 가지고는 완전히 agent가 개발한 codebase가 coherent하게 유지되지 않는다고 함.

(왜?)

그러면 how?

어떻게 만들지는 자유롭게 두되, 반드시 유지돼야 할 핵심 조건은 기계적으로 강제하라.

핵심 원칙을 탄탄하게 세워서 이걸 강하게 강제하면, agent를 활용해서 빠르게 ship 하면서도 foundation이 무너지지 않을 수 있음.

Agent들은 엄격한 경계와 예측 가능한 구조 안에서 제일 잘 동작함.(아직은 알잘딱깔센 같은 느낌이 아니라는거지. 명확하게 알려줘야해)

아주 견고한 틀을 잘 세워줘서 그 길 밖을 벗어날 일이 없게, 정해진 범위 내에서 자율성을 발휘하게 하는게 포인트임.

그리고 중요한 점은 이게 지켜지는지를 강제하는 mechanical한 방법이 적용되어 있다는 것

linter + test + CI 등 검증

큰 규제 범위 내에서 작은 범위의 자율성 발휘
(대규모 개발 조직이 일하는 것과 비슷한 점 -> 조직 단위 규칙이 있고, 그걸 지키는 범위 내에서 개발자들이 각각 자율성을 발휘)

## 최종 목적

single prompt 입력하면

- 일련의 작업을 통해 일처리를 하고 머지까지 하는

그런 구조로 만들 수 있음.

## 코드베이스 퀄리티 유지하는 것.

처음에는 매주 일정 시간동안 사람이 직접 codebase에 쌓이는 AI Slop을 제거하는 작업을 했음.

근데 이거는 scalable 하지 않음.(사람이 할 수 있는 만큼만 할 수 있음.)

그래서 이 작업을 처리하기 위해서

핵심 원칙, 코드 작성에 대한 내부적인 BP를 세우고 이를 기반으로 주기적으로 agent가 원칙 준수여부 검토하고 개선하는 작업을 처리

garbage collection 같은 느낌인거임. 기술부채가 쌓이는 것을 지속적으로 방지하는...

어려운건 이제 구현이 아니라, Agent가 잘 일하게 만드는 시스템을 설계하는거임.

build and maintain complex, reliable software at scale -> 근데 이게 사람이 아니라 agent가 하는..

- 개발에 규율은 여전히 필요하다.
- 하지만 그 규율은 코드가 아니라 시스템 설계에 들어간다.
- 핵심 역량은 “코드 작성”이 아니라
- “에이전트가 안정적으로 일하도록 환경을 설계하는 것”이 된다.
