# MCP에 대해서 알아보자.

앤트로픽에서 24.11.26에 발표 [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)

`a new standard for connecting AI assistants to the systems where data lives(data repositories, business tools, dev environments etc)`

목표: help frontier models produce better, more relevant responses

# [MCP 글](https://www.anthropic.com/news/model-context-protocol)에 대해서 더 자세하게 읽어보았음.. 이해가 잘 안돼서.

AI도구 -> chatGPT, Claude 같은 LLM기반 대화형 AI도구들.

AI도구는 한계가 존재함(학습된 데이터가 아닌 내용에 대한 정보를 제공하지 못함.)

학습된 데이터는 특정 시점의 snapshot이므로 특정 시점 이후의 데이터나, 특정 주체가 소유하고 있는 커스텀한 데이터에 대한 지식이 없음.

근데 많은 경우에 우리가 AI도구를 사용해서 풀고자 하는 문제는 이런 실시간성 데이터나, 우리가 가지고 있는 커스텀한 DB에 대한 정보가 필요하다.

이 관점에서 봤을 때 2가지 주체가 존재함. ChatGPT 같은 LLM기반 AI도구와, 데이터를 가지고 있는 system.

MCP는 이 서로 다른 시스템들을 연결하는 standard가 되는 방법을 제시하고자 함. `universal하고 open`한 방법을 제공해 LLM이 더 연관성있고 도움이 되는 답변을 제공할 수 있도록 하는 것이 목적이다.

기존에 이런게 없었나? 아니 있었지 근데 문제는, fragmented integration with a single protocol 형식이라는 점이었음.
-> 이 부분이 좀 이해가 안됨. fragmented integration의 예시에 대해서 찾아봤음. 예를 들면 날씨 정보와, 해당 유저의 스케줄을 알기 위해서 캘린더에 접근해야되는 경우를 생각해보자. 이 경우에 기존에는 날씨 API를 해당 API가 요구하는 방식으로 연동하고, 또 캘린더 정보도 필요한 방법으로 조회해오는 2가지 처리, 즉 필요한 data source가 요구하는 각각 integration방법대로 별도로 작업을 해서 처리했어야 함. -> 이거를 하나의 프로토콜로 맞춰서 동일한 방식으로 날씨 정보와 캘린더 정보를 가져올 수 있는 방법을 제공하고 싶다는 것.

---

그래서 개발자들이 이거 어떻게 쓰는데??

두 가지 중 하나임.

- expose data through MCP servers
- build AI Applications that connect to these servers(MCP Client)

오케이 그러면 내가 해야되는 일은, MCP 형식으로 데이터에 접근할 수 있는 서버를 만들거나, 아니면 MCP형식으로 데이터를 제공하는 서버와 MCP방식으로 연결가능한 client를 만들거나.

# MCP서버 하나 만들어보기

일단 MCP client들은 많으니까, MCP client에 붙여서 사용할 수 있는 MCP서버를 하나 만들어보자.

MCP서버를 만드는데 어떤 서버를 만들거냐면, cursor에 내가 원하는 code snippet을 만들어주는 mcp. 이를 위해서는 LLM에 내가 원하는 형식의 데이터 만들어달라고 요청해야하고, 이거를 받아서 로컬 cursor 디렉토리에 정해진 형식으로 저장해야 함.

만들어주는 걸 LLM이 하고, MCP를 통해서 외부 시스템과 연계한다는 것이 포인트.

연습용으로 한 번 만들어보고, 필요하면 더 추가해보자.

만드는 것의 과정은 약간 이런 느낌임.

딱 앉았어.

내가 이런 것들을 하고 싶은데 LLM + 외부 세계 데이터를 사용해야 할 것 같아. 이걸 어떻게 custom agent로 mcp 이용해서 만들까?

# 상황에 대한 인식?

왜 이런 아이디어를 떠올리게 되었는지 같은 부분에 대해서 다음과 같이 설명함.

AI가 난리임 -> model의 추론능력에 집중되어 있음. -> 근데 추론의 기반으로 전달해야하는 데이터에 모델이 접근하는데 한계가 있음.(진정한 연결된 시스템 만드는데 한계가 존재.)

MCP는 이 문제를 해결하고자 함.

AI시스템을 데이터 소스와 연결하는 universal, open standard를 제공하려고 함.(선점효과를 좀 노리는 느낌이 강한거같은데??)

기대효과: AI시스템이 필요한 데이터에 더 쉽고 안정적으로 접근할 수 있는 방법 제공

# Model Context Protocol

data source들과 AI기반 도구들 간 양방향 연결하기 위한 프로토콜

아키텍처는....

- MCP server를 통해서 데이터를 expose 하거나,
- build AI application(MCP Client) that connect to these servers
  https://www.youtube.com/watch?v=VKIl0TIDKQg
  서버를 통해서 데이터를 제공하거나, 아니면 MCP 기반 AI앱을 만들어서 서버와 연결하던가.

# 관련된 youtube(테디노트)

[테디노트의 mcp 관련 영상](https://www.youtube.com/watch?v=VKIl0TIDKQg)

MCP는 대규모 언어 모델이 외부 데이터와 시스템을 더 효과적으로 활용할 수 있도록 설계된 일종의 연결 프로토콜, 즉 표준 규약

Cursor AI가 MCP를 지원하는 것과 그와 동시에 MCP 인기 상승이 왜 연결되는지?

MCP -> Tool 역할을 해주는 것이 포인트
-> 기존에 존재하는 랭체인에 내장되어 있는 tool 이용해서 agent만들 수 있는데? 왜 이거 써야함?
-> 랭체인과 같은 개발도구에 종속적이지 않은 tool들이 외부에 공개되었는데도 관심을 받지 못했던 이유는, Tool이 있어도 연계된 LLM/ReAct프레임워크 구동할 수 있는 몸체가 없음.(손발만 있고 머리/몸이 없음..)
-> 근데 Cursor AI가 등장하면서 LLM+ReAct 역할을 수행해줌. `CursorAI + MCP`조합으로 코딩을 못하는 사람도 이를 활용해서 프로덕트 만드는게 가능해짐.

랭체인도 엄청나게 많은 tool들을 제공하지만, 이들은 랭체인 ecosystem 안에서만 사용할 수 있음.(랭체인 배워야지 tool가지고 agent만들어서 써먹을 수 있음.)

MCP -> 표준규약 만들고, client가 이 규약 맞춰서 프로그램 만들면 가져다가 쓸 수 있도록 tool을 제공하고자 함.
-> USB-C타입에 비유한다는게, client(노트북) 만들 때 C타입 포트 만들면 C-Type젠더 형식으로 만들어진 서비스 아무거나 가져다가 꽂아서 사용할 수 있다는 것.
-> 랭체인은 비유하자면 그냥 자기한테만 호환되는 포트로 도구들을 만들었던 것(랭체인 안쓰면 tool들을 가져다가 쓸 수가 없음. 랭체인 배워야지 도구+AI를 활용할 수 있다는 소리)

음 그러니까 C-Type같은 규격을 만들고, '야 니네가 규격대로 만들면 그 필요한 애들이 알아서 포트 만들어서 너네꺼 가져다가 쓸거야' 같은 느낌으로 일단 만들고, 따라해줘 하는거구만.. 좀 애매하긴 하네 근데 C-Type은 어떻게 어떤 의사결정 과정을 통해서 최종적으로 거의 모든 노트북/핸드폰에 탑재된거야 그것도 궁금하긴 하네(의사결정 프로세스가 어떻게 이루어지는지?)

오 이렇게 보니까 컨셉 자체는 진짜 좋았넹. 근데 사실상 내가 방금 생각했던대로 `이거대로 만들어줘` 부분이 안되면 사실상 의미가 없다는 큰 문제가 있었다. c타입 호환되는 키보드 마우스 이런거 만들어봤자 이걸 꽂아서 쓰는 노트북을 만드는 삼성 애플 같은 회사들이 포트 안달아주면 어차피 젠더를 또 구해야되는 사실상 쓸모없는 규격인 상태...

MCP가 작년 11월에 발표된 이후에 별로 반응이 없던게 이런 이유 때문이었음. 그러다가 CursorAI(세계적으로 많이 쓰이는 도구)가 이 C-Type같은 MCP를 채택해줬다..!!

일단 많은 사용자들이 사용하는 플랫폼(맥북)인 Cursor에서 Ctype(MCP)를 지원하기 시작한게 일단 가장 중요한 시발점이고, 이게 코드 작성 에디터인 Cursor에서 가능해졌다는게 또 의미가 있는 것.

그래서 뭐 제 2의 카카오톡 만들고싶다, 많은 사람들이 쓰는 서비스를 만들어보고 싶다 하는 사람들은 죄다 MCP기반 툴을 만드는데 혈안임.

Smithery -> tool marketplace 라고 보면 됨(npm 같은 mcp server registry).(스마트폰 초창기에 앱 잘 만들어서 커진 회사들마냥, 지금 빠르게 인기있는 tool을 만들어보려는 사람들이 많은 듯.)
-> 생태계 조성이 이미 시작되었음.(유저 유입이 지속적으로 되고 있다.)

그리고 지금은 MCP를 사용할 수 있는 방법(맥북)이 Cursor와 같은 에디터에 제한되어 있는데, 확장이 될 가능성이 높음.(다양한 애플리케이션에도 MCP를 꽂아서 사용이 가능하다 이게 무슨 소리지..?)

랭체인 -> 개발해놓은게 있는데, MCP를 또 따로 적극적으로 지원한다.(랭체인은 프레임워크이기 때문에 몸체를 제공하는 역할)

# 관련 유튜브(개발동생)

[영상](https://www.youtube.com/watch?v=zVSZ2gXvhVE)

기존 LLM -> 학습된 데이터 안에 있는 내용에 대해서만 답변 가능

- 최신 정보의 부재
- 내부 데이터(주체들마다 가지고 있는 custom data) 학습 불가

LLM이 Agent로의 변화를 시작하면서, 실시간으로 세상과 소통하는 것에 방점이 많이 맞춰짐

근데 LLM이 외부데이터/도구/서비스/API/DB 등을 호출하는 것에 문제점이 있었음.

기존에도 불가능한건 아니었다. 근데 표준 규격이 없어서 연동하고 싶은 것 마다 따로 개발을 해야되는 불편함이 존재.
-> MCP라는 표준화된 규격을 출시.
