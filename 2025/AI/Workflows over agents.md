# Stop Building AI Agents

회사분이 공유해주신 글을 보고 드는 생각들...

[Stop Building AI Agents](https://decodingml.substack.com/p/stop-building-ai-agents)

# Agent 기반 시스템의 문제..?

잘 동작하면 좋은데, Break 했을 때 이유를 알 수가 없다.

- Agent가 주어진 작업을 까먹은건지?
- 잘못된 Tool을 선택한 것인지?
- Involve된 부분이 너무 많아서 디버깅이 어려운건지?
- 애초에 전체 시스템이 fragile 한지?

이러한 Potential issue들에 대해서 명확하게 원인을 짚어내기가 어렵다는게 문제다.

저자가 제시한 문제있는 케이스가 좀 공감이 되었다.

- 에이전트 3개
  - Researcher Agent: browses web pages
  - Summarizer Agent: has access to citation tools
  - Coordinator Agent: Task delegation
- Tool 5개

로 구성된 `Research Crew`를 구성했다고 함. 설계상으로는 정말 완벽해보였는데, 돌리면서는 온갖 문제가 발생했다고 함.

모든 에이전트가 지 할일을 똑바로 못하는 경우가 다반사였다고..

Agent라는 것의 핵심은 LLM이 workflow를 control하도록 하는 것(LLM Output에 따라서 workflow가 돌아가도록 하는 것)

# 곧바로 Agent 만들기로 뛰어들기 전에...

`Simpler patterns often work better`. 저자가 전달하고자 하는 핵심 문장인 듯.

문제를 Agent로 해결하기 전에(즉 workflow controller의 역할을 LLM에 주기 전에), Task를 잘 정의하는 것이 중요하다고 함.

task가 굉장히 동적인 케이스가 아니라면, 보통 LLM에 맡기는 자유로운 방식은 더 좋지 않다고...

# 그러면 어떤 방법들이 있는데..?

저자가 추천하는 몇 가지 문제해결 패턴

## 1. Prompt Chaining

First LLM Call -> Output 평가 -> Second LLM Call -> Ouput -> Third LLM Call -> Output

Task가 sequential하게 실행되어야 하는 경우에 사용하면 좋다. Step-by-Step 구조이기 때문에 단계별로 실패하면 Failure를 터트릴 수 있고 어디에서 어떤 결과로 인해서 Fail되었는지 알 수 있음.

## 2. Routing

✅ Use when: Different inputs need different handling

LLM이 Input을 평가해서 적절한 predefined workflow를 태우는 케이스

Routing 로직이 메세지를 평가해서 적절한 workflow로 보내거나, 명확하지 않다고 판단되면 Generic Handler로 되돌려보냄.

이 때 Routing logic에서 Data Type을 분류하는 작업을 LLM이 진행. 그리고 분류된 카테고리에 따라서 정해진 Workflow를 탄다.

--- 내 생각 ---
내가 여기서 순간 든 생각이, 아니 이러면 Control Flow를 LLM Output으로 결정하는 것이 정체성이라는, 저자가 말했단 `DONT`에 해당되는 Agent아닌가? 하는 생각이 들어서 차이점이 뭔지 좀 이해하고 넘어가야겠다 싶었음.

- 흥미로운 점은 이걸 바로 내가 생각해보는 것이 아니라 ChatGPT에 물어봐야겠다는 생각이 들었다는 점임
  - 이미 좀 의문이 드는 점에 대해서 LLM의 의견을 묻는게 학습이 좀 되어버린 것 같은데. 과거에도 이런 케이스가 있었나? 그리고 그때는 어떤 결정이 옳았을까? 직접 생각하는 습관을 유지하려고 노력하는 것 vs 적절한 도구를 활용해서 의사결정 속도를 올리는 것.(케바케인가..?)
  - LLM이 unprecedented 한 일이긴 한데, 그래도 paradigm shift라는 측면에서는 분명히 과거로부터 배울 점이 있지 않을까 하는 느낌??

무튼...

어떤게 차이점이지? 일단 내가 Agent/Agentic System을 명확하게 정의하고 넘어가야지 차이점을 인지할 수 있을 것 같다.

- Agent란, 앞서 언급된대로 Agent의 판단에 따라서 Workflow가 전체/일부 control 되는 것.
- 궁극적인 형태로는 하나의 거대한 BlackBox가 아닐까?? 자연어 input이 입력되었을 때, 거대한 LLM 두뇌가 어떤 Agent를 굴려야 하는지, 그리고 각각 Agent들이 또 주어진 tool 중에서 어떤걸 호출해야되는지를 결정하는 구조.
- 이 구조에서는 workflow 흐름 판단을 다 llm이 한다. Agent를 태워야한다고 판단하면 어떤 Agent를 태울지, 각 Agent가 또 도구를 사용한다면 어떤 도구를 활용할지 등등..게다가 Output을 또 평가하는 LLM도 필요하겠지.
- 흐름이 sequential하지도 않고, 동일한 Input에 대해서 동일한 workflow를 탄다는 보장도 없음.
- 만약에 여기서 결과가 제대로 나오지 않는다면, 어디에서 뭐가 잘못되었는지 추적하기가 어려움 왜냐하면 LLM이 왜 동일한 input에 대해서 trial1에서는 a workflow를 타고, trial2에서는 b workflow를 타는지 디버깅할 방법이 없음. workflow를 결정하는게 LLM output인데, output 생성 과정을 디버깅하지 못하니까.
- 반대로 지금 저자가 제시하는, workflow의 controller가 사람인 workflow는, 어느정도 미리 정해진 데이터가 있겠지. LLM에게, 이런 타입의 데이터가 주어질테니까 무조건 output으로 이런 타입의 데이터를 출력해 해서 categorization이 진행될거고, handler도 정해진 로직인거지. 그래서 LLM이 판단은 하지만, 판단의 범위가 어떤 로직을 실행할지가 아니라 데이터 분류에 국한되어 있고 데이터 분류가 완료된 이후에 각 데이터를 처리하는 것은 Agent가 판단해서 Tool을 선택하는 agent controlled workflow가 아니라, predefined logic을 무조건 타도록 되어있는 pipeline 같은거임. routing만 llm이 정해진 범위에서 시키고
- 그러면 routing은 왜 llm에게 시키는가..? 아마 최초에 자연어로 데이터를 제공하고 싶겠지? 데이터가 완전히 정형화되어있지는 않을테고, LLM이 이해해서 분류하는 작업의 완성도는 높은 수준의 작업이라고 가정하고 있는 것 같음. 그래서 어느정도 LLM의 기능은 활용하지만, LLM이 잘할만한 그리고 사용자가 실행흐름을 통제하고 추적가능한 범위 내에서 LLM에 작업을 시키는 구조

--- 내 생각 ---

예를 들어 A라는 데이터의 Type에 따라서 Routing을 처리한다고 치면

```python
if dataType == 'A':
  handler = A_type_handler()
elif dataType == 'B'
  handler = B_type_handler()

# process data with selected handler
result = handler.process(data)
```

## 3. Orchestrator-Worker Pattern

UseCase - LLM Breaks down the task into 1 or more dynamic steps

근데 이거는 뭐가 다른거임??

차이를 잘 인지를 못하겠네.

비슷한거같은데....데이터를 2개의 카테고리 중에서 하나로 분류하는 작업을 orchestrator가 수행, 분류된 작업별로 필요한 작업 수행을 worker가 수행.

decision making을 exeution으로부터 분리한다는게 포인트라고 하는디...routing하고 비슷한거 아니야??(바로 저자가 그 내용을 알려주네...후후)

routing은 routing 수행 후 routing을 수행한 llm으로 부터 control이 아예 다음 단계로 넘어가버리고(handler가 control)

orchestrator-worker구조에서는 orchestrator가 control을 계속 가져가는 구조인 것이 차이점이라고 함.

- initiates classification
- selects the worker
- manages the flow from start to finish

아직 잘 이해가 안되긴하네. 그러면 이게 agent가 아니라는거야..? orchestrator가 작업 분류해서 필요하다고 판단하는 worker를 실행하고 subtask를 좆어한다.?

- worker가 세부작업을 판단 기준으로 수행하는게 차이인가..? routing하고 뭐가 다른지 이해가 잘 안되긴 하네.

## 4. Evaluator-Optimizer

Generator LLM이 생성한 데이터를, Evaluator LLM이 평가하는 구조.

기준을 정해두고 Evaluator의 기준을 통과하지 못한 케이스는 Generator에 feedback과 함께 돌려보내서 다시 데이터 생성시키는 Loop을 도는 구조.

이 구조는 Output 퀄리티가 속도보다 중요한 경우에 사용하라고 함.

다만 infinite optimization loop을 돌 수 있으므로 Stop Condition을 명확하게 설정하는 것이 필요함.

# 글에 대한 의견들에서 배운 점들..

- 결정적/비결정적 task 간 구분
- LLMs are nowhere close to energy efficient
- post에 대해서 이렇게 정리한 내용이 있는데 좀 공감되었음. if it can be deterministic, it should be. 나는 좀 더 나아가서 이정도로 말해도 되지 않나 싶다. 그냥 애초에 최대한 결정적으로 결과를 만들어낼려고 시도해보고, 정 안되면 비결정적 방법을 쓰는게 맞지 않나 대부분의 경우에는 창의성보다는 일관된 output이 더 유의미하지 않나 싶다 아직은 그리고 지금의 LLM 성능을 생각하면. 그리고 내 생각에는 단순히 scaleup 해서 output을 개선하는 방식은 한계가 있지 않을까 싶기도 해. 이때부터는 sLLM 같은 것들을 어떻게 더 잘 활용해야될까가 중요할 수도 있고, 결국 적재적소에서 적절하게 사용하는게 정말 중요할 것 같음.

# 별도로..

AI를 활용하는 역량은 생각해보면 종류가 2가지가 있는 것 같음.

- 문제 자체를 AI를 활용해서 해결하는 것. 예를 들어서 RAG시스템을 이용해서 사용자 질의에 대응하는 챗봇같은...
- 문제를 해결하기 위해서 필요한 시스템을 AI를 통해서 만드는 것. 정말 진화한 형태는 Vibe Coding이겠지만 아직은 AI Augumented, Human as the Code reviewer Coding에 가깝다고 생각함.(아직은 영향을 주는 Factor가 AI를 잘 활용하는 능력보다는, 개발력인 것 같음. 개발력이 뛰어날수록 AI를 활용하는 능력이 뛰어나다. 그러면 또 질문이 나와야하는게, AI 시대에 필요한 개발력이란 무엇인가??)

무튼 2가지 종류의 AI 활용 방식 각각 필요한 지식과 경험이 좀 다르다고 생각함.

- the former requires knowledge about things like, Agent system architecture, RAG, prompting,
- the latter requires knowledge about things like, good software architecture, code testing methods, 개발하는 프로덕트가 동작하는 환경에 대한 이해, 네트워크에 대한 이해 등등...

그랬을 때? 프로토타이핑은 2가지 영역을 다 체험해보기 좋은 프로젝트가 아닐까..좋은 것 같음. 다만 문제를 해결하는 과정에서 어떤 Pain Point가 있고 이거를 어떻게 잘 제어해낼지를 이전 프로토타이핑보다 더 개선하는 과정은 필요하지 않을까 싶음.
