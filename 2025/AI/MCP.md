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

# 직접 해보기

토이프로젝트로 해보고 있는 agent-builder에 mcp 클라이언트로서의 역할을 부여하려면 뭐가 필요할까?

머릿속에 ???이 가득함ㅎ

mcp client로서 역할을 한다는게 무슨 뜻일까? (참고로 동일한 머신에서 돌아가는 mcp 서버가 아니라, 원격에 배포되어 있는 mcp 서버와 http 통신으로 데이터를 주고 받는 것을 목표로 함)

외부 mcp 서버에 데이터를 규격화된 방식으로 요청하고, 정해진 형식으로 전달된 데이터를 Parsing해서 LLM에 먹일 수 있는 구조가 필요하다는 것으로 이해함.

지식 Gap

- `규격화된 방식`이 뭐지?
- `정해진 형식`으로 전달된 데이터라고 할 때 `정해진 형식`이 뭐지? 어떤 구조의 데이터를 받는거지?
- 외부 mcp 서버를 어떻게 특정해서 요청을 보내지?

## MCP Client의 역할은?

`MCP Client`는 AI Agent가 외부 도구/서비스에 **표준화된 방식**으로 연결할 수 있게 해주는 중간자 역할 수행하는 것이 목적임.

## Fill the Gap

1. `규격화된 방식`이 뭐지?, `정해진 형식`이 뭐지?

MCP는 **JSON-RPC 2.0** 프로토콜을 기반으로 함.

```json
// 요청 형식
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "tool_name",
    "arguments": {"key": "value"}
  }
}

// 응답 형식
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{"type": "text", "text": "결과 데이터"}]
  }
}
```

2. 외부 MCP 서버를 어떻게 특정해서 요청을 보낼까?

Just like any other http requests

- 서버 URL을 지정하고,
- 인증하고,
- http 로 요청 전송..ㅎ

큰 차이가 없네 기존하고 그냥 요청을 정해진 형식으로 보내면 되는거같음.

**JSON-RPC 2.0** 프로토콜에 맞춰서 요청을 서버로 보내서 찌르면 Response가 오겠지?

일단 test run 이 가능한 형태로 만들어보자. (Agent 실행 흐름의 일부로 integrate하는건 다음에)

## Streamable HTTP

- ing...(다른 업무 진행으로 잠시 stop인데 집에서 이어서 진행할 예정)

# MCP 추가 설명

https://www.youtube.com/watch?v=RhTiAOGwbYE

MCP -> LLM이 써드파티 플랫폼과 연계할 수 있도록 설명을 제공하는 가이드라고 생각하면 됨.

MCP는 LLM에게 써드파티 플랫폼과 소통하기 위해서 필요한 `Context`를 제공한다.

how can agents discover and use mcps?

- mcp는 클라이언트 서버 아키텍처로 동작함
- Agent는 MCP클라이언트를 사용해서 서버와 소통

MCP서버는 tool외에 Resources와 Prompts 총 3가지 요소를 expose할 수 있음.

## resources

예를 들어, 환불이 가능한 항공권만 예약하고 싶은 유저가 있다고 생각해보자.

그러면 환불에 대한 규정을 LLM이 참고해서 mcp로 데이터를 땡겨와서 답변을 해야지 정확할 수 있음.

MCP에는 이런 데이터도 resources라는 key값을 가지는 형태로 제공할 수 있게 되어있다고 함.

MCP서버에는 tool 만 정의하는게 아니라, resources도 정의할 수 있다는 점!(말그대로 필요한 `context`를 제공하는 목적이니까.)

## prompts

미리 정해진 형태의 프롬프트를 보고, 어떤 도구를 호출해야될지 llm이 더 정확하게 파악할 수 있도록 컨텍스트를 제공하는 목적

사전에 정의된 프롬프트 템플릿 혹은 가이드라인이라고 볼 수 있음.

tools/resources를 어떻게 조합해서 작업을 처리할 수 있는지에 대한 사용 설명서 같은 역할이라고 함.(바로 이해는 잘 안되는데 조금 더 찾아봐야할듯?)

## 추가 설명을 보면...

MCP의 공식 python-sdk에 설명되어 있는 내용을 보면,

MCP server는..

- expose data through **Resources** (LLM의 컨텍스트로 데이터를 불러오기 위한 GET 엔드포인트처럼 생각하라고 함)
- provide functionality through **Tools** (코드를 실행하거나 기타 부가기능을 실행하기 위한 POST 엔드포인트처럼 생각하라고 함)
- Define interaction patterns through **Prompts** (LLM 상호작용을 위한 재사용 가능한 Template)

# MCP 공식문서 기반 아키텍처 분석

Example쪽을 보면서 Data Layer/Protocol Layer 구조에 대해 이해해보기

## Data Layer

1. init(생명주기 관리)

MCP의 시작점.

capability negotiation handshake로 시작한다고 함.

client가 연결 시작의 주체임. `initialize` 요청을 서버로 보내서 연결 설정

```json
// initialize request to start the MCP client-server connection with capability negotiation handshake
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}

// 그에 대한 응답(서버의 핸드셰이크 응답이겠지?) 근데 핸드셰이크가 TCP였나 거기서 말하는 3-way handshake에서 말고도 일반적으로 사용되는 표현이었나??
// ㅇㅇ 맞음 `두 시스템이 통신하기 전에 서로의 상태를 확인하고 동의하는 과정`
// 어떤 프로토콜이든 연결 전 상호 확인 과정이 있으면 이를 Handshake라고 부를 수 있다고 함.
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {}
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}
```

과정에서 주고받는 데이터는 각각 이런 목적을 가지고 사용됨

- protocolVersion -> 각자 사용하고 있는 프로토콜 버전이 호환되는지 확인
- capabilities -> 서버/클라이언트가 각각 지원하는 기능을 알려주는거임(primitives를 포함해서). 이 과정을 통해서 지원되지 않는 작업을 처리하지 않는 효율적인 소통이 가능케 함.
- clientInfo/serverInfo -> 디버깅 및 호환성에 사용되는 식별 및 버전정보 상호 제공

클라이언트 capability

- elicitation -> 이를 명시하면 클라이언트가 서버의 사용자 상호작용 요청을 처리할 수 있음을 의미함(elicitation/create 메서드 호출을 처리할 수 있다는 의미)
  - 서버로부터 요청을 받았을 때 이걸 처리할 수 있다는거겠찌?(요청은 서버의 응답으로 돌아오나..?)

서버 capability

- "tools": {"listChanged": true} -> tools 지원 + 도구 목록 변경 시 알림 보냄
- "resources": {} -> resources 지원(resources/list 메서드랑, resources/read 메서드 지원한다는 소리임)

이렇게 클라이언트와 서버가 한 번씩 capability나 메타정보를 성공적으로 교환하면 마지막으로 클라이언트가 서버에 연결이 잘 설정되었다는 알림을 전송함

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

실제로 AI 앱 내에서는, 초기화 과정에서 MCP 클라이언트 매니저가 연결을 설정하고 서버별로 제공되는 capability를 추후 사용할 수 있게 저장한다고 함.

앱은 그러면 이 정보를 활용해서 어떤 서버가 어떤 기능을 제공하는지 파악해서 필요한 작업을 처리할 수 있는거지(클라이언트는 연결된 서버가 제공하는 능력을 저장, 앱은 이 저장된 정보를 토대로 어떤 작업을 어떤 서버를 활용해서 처리할지 결정)

---

2. Tool Discovery(Primitives)

1번을 통해서 연결이 설정됨

클라이언트는 연결된 서버가 제공하는 도구 목록을 `tools/list` request로 받아올 수 있음. -> 이 요청은 무조건 해야됨. 그래야지 클라이언트가 서버가 제공하는 도구 목록을 파악할 수 있음.

```json
// tool list request
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

// tool list response
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "calculator_arithmetic",
        "title": "Calculator",
        "description": "Perform mathematical calculations including basic arithmetic, trigonometric functions, and algebraic operations",
        "inputSchema": {
          "type": "object",
          "properties": {
            "expression": {
              "type": "string",
              "description": "Mathematical expression to evaluate (e.g., '2 + 3 * 4', 'sin(30)', 'sqrt(16)')"
            }
          },
          "required": ["expression"]
        }
      },
      {
        "name": "weather_current",
        "title": "Weather Information",
        "description": "Get current weather information for any location worldwide",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, address, or coordinates (latitude,longitude)"
            },
            "units": {
              "type": "string",
              "enum": ["metric", "imperial", "kelvin"],
              "description": "Temperature units to use in response",
              "default": "metric"
            }
          },
          "required": ["location"]
        }
      }
    ]
  }
}
```

Request자체는 심플함. Response를 이해해보자.

제공되는 도구별로 메타데이터 제공해주는 `tools` 배열이 있음. 개별 tool 객체별로 핵심적인 값들은.

- name: 서버 Namespace 내에서 해당 도구를 유일하게 식별할 수 있는 이름. 변수처럼 이름을 잘 짓는게 중요함.
- title: 사람에게 표시하기 위한 이름. 클라이언트는 이를 사용자게에 표시함(코드 상에서의 의미보다 사용자가 인지할 수 있는 이름이어야겠지?)
- description: 도구가 수행하는 작업과 언제 써야되는지에 대한 설명(`detailed description`)
- inputSchema: 도구 함수가 기대하는 parameter에 대한 정보(parameter 별 타입/required or optional 여부)

AI앱은 연결된 모든 MCP서버로부터 이 tools/list 요청으로 받은 도구 목록을 가지고 하나의 통일된 tool registry로 묶어서 LLM이 접근가능하게 제공함.(컨텍스트에 매번 tool_list같은 느낌의 데이터를 던지는 구조가 되는건가??) LLM은 이를 통해서 어떤 action이 가능한지 파악하고 대화 중 필요하다고 판단하는 tool call을 처리함.
(순간 들었던 생각이, LLM이 어떻게 함수를 '호출'하지? 인데 아마 이런 방식일듯? LLM이 반환하는 형태를 고정시키는거지. 예를 들어서 LLM Response 가 {call_tool:, tool_name} 이런 형식으로 반환되고 반환값을 체크해서 if(call_tool) {get_named_tool_from_registry_and_call_tool()} 같은 형식으로 실행되지 않을까....LLM은 사용자 질의와 제공되는 도구 목록을 입력 받아서 '도구를 호출해야된다는 의도'를 출력하는거지)

---

3. Tool Execution(Primitives)

unified_tool_registry에 존재하는 도구들을 호출하면 어떤 일이 발생함?

클라이언트는 `tool/call` 메서드를 써서 호출함

일단 사용 가능한 도구와 도구별 메타데이터를 파악한 후에는 필요한 인자를 전달해서 호출하면 됨.

```json
// tool/call request
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco",
      "units": "imperial"
    }
  }
}

// tool/call response
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy with light winds from the west at 8 mph. Humidity: 65%"
      }
    ]
  }
}
```

`tool/call` 요청 json은 반드시 다음 구조를 가져야 함.

- name: 처음에 `tool/list` 요청을 통해서 가지고 있는 이름하고 반드시 일치해야함 그래야지 서버가 찾아서 호출하지
- arguments: `tool/list`를 통해서 도구별로 파악한 inputSchema에 해당되는 입력값 목록임
- JSON-RPC 구조: 유니크한 id값을 부여해서 request-response 끼리 묶을 수 있도록 해야함.

Response에 대한 이해

response는 다양한 데이터를 주고받을 수 있도록 유연성을 고려해서 설계되었다고 함.

1. `content` 배열: 객체 배열임. 각 요소별로 여러 타입의 데이터를 담아서 반환 가능(텍스트, 이미지, 리소스 등등)
2. `type`: 각 컨텐츠 객체별 타입 MCP가 여러 지원하는 여러 타입들이 있음.
3. `Structured Output`: 앱이 LLM에 컨텍스트로 전달할 수 있는 정보를 제공하는 것이 목적임 그에 맞는 구조를 가지고 있음.

---

4. Real-time updates(Notifications)

MCP는 서버가 클라이언트에게 정보 변화에 대해 알릴 수 있도록 하는 메커니즘을 탑재하고 있음(클라이언트 요청 없이도 서버가 띵동가능함)

서버의 상태가 클라이언트가 인지하고 있는 상태와 최대한 sync되어있도록 하는 것이 목적임.

가장 핵심적인 알림 기능인 tool list change 알림에 대해서 알아보자.

```json
// request
// 이거는 서버가 클라이언트한테 보내는 요청임
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

변화가 있을 때 서버가 `선제적으로`, `지가 먼저 나서서` 연결되어 있는 클라이언트들한테 알려줄 수 있는게 포인트임.

몇 가지 중요한 포인트는,

- response가 필요없음(그냥 알려주는게 목적이라 stateless한 형태여도 되기 때문에 Id 값이 없다)
- capability based: 처음에 연결 설정할 때, listChanged: true 로 설정한 서버들만 알림이 전송됨(처음에 서버가 전송하는 값으로, 전송 시 '나는 도구 목록 변경 시 알림을 줄 수 있엉'이라는 소리임)
- event driven: 이게 왜 이벤트 드리븐이라고 하는지는 잘 모르겠음.

그러면 이 알림을 받은 클라이언트는 어떻게 반응할까??

다시 tools/list 알림을 보내는게 일반적이겠찌??

```json
{
  "jsonrpc": "2.0",
  "id": 4, // 얘는 서버의 알림과 다르게 응답을 기대하는 요청이니까 Id값을 부여해서 stateful한 요청으로 처리함
  "method": "tools/list"
}
```

이 알림 메커니즘을 통해서 클라이언트는 서버의 내부 상황을 모르고 있어도 필요한 싱크를 맞출 수 있는 효율적인 구조가 됨(보통 서버가 변경의 주체니까)

AI앱에서는 알림을 받으면 바로 요청을 보내서 unified_tool_registry를 업데이트함. (SSOT겠지 아마?)

이후 대화에서는 바로 이 SSOT를 참조하니까 업데이트된 도구를 가져다가 사용할 수 있겠지.

# Understanding MCP Servers

Apps in ChatGPT들은 다 MCP 서버니까 이걸 이해하고 가야함.

ChatGPT가 클라이언트이고 내가 그 안에서 호출할 수 있는 도구를 전달하려고 MCP 서버를 구현해야됨.

MCP servers are programs that expose specific capabilities to AI applications through standardized protocol interfaces.

세 가지 핵심요소를 활용해서 기능을 제공

- Tools
- Resources
  - 제어주체가 Application 이라는데...흠...이 부분이 좀 이해가 잘 안되네
- Prompts
  - pre-built 템플릿임. LLM에 특정 tool/resource를 활용해서 작업을 처리하라는 지시를 내리도록 하는..
  - 제어주체가 user로 되어있는데, 아마 유저가 이 프로그램 어떻게 쓰지 하고 프롬프트 몇 개 넣어볼 수 있게 제공하거나 하는 목적이려나..? Sample Question 같은 느낌?

## Tool 사용 시나리오

도구의 경우 실행 전에 사용자의 동의를 받아서 help users maintain control over actions taken by a model

```json
// Tool 정의
{
  "name": "searchFlights",
  "description": "Search for available flights",
  "inputSchema": {
    "type": "object",
    "properties": {
      "origin": { "type": "string", "description": "Departure city" },
      "destination": { "type": "string", "description": "Arrival city" },
      "date": {
        "type": "string",
        "format": "date",
        "description": "Travel date"
      }
    },
    "required": ["origin", "destination", "date"]
  }
}

// 호출할 때는 정의대로 호출하면 됨
searchFlights(origin: "NYC", destination: "Barcelona", date: "2024-06-15")

```

MCP는 도구 호출 시나리오 안에서 필요에 따라 사람이 개입할 수 있도록 신경썼음.

앱들은 아래와 같은 메커니즘을 도입해서 user의 control 정도를 높여줄 수 있음.

- 사용가능한 tool 목록을 유저에게 UI로 표시(최초에 tools/list 를 통해서 받아온 목록의 정보를 토대로 표시하는걸로 이해함)해서 유저들이 특정 interaction 할 때 해당 tool이 사용가능할지에 대해서 결정할 수 있게 함
- 개별 tool 실행 전에 동의 여부 묻기
- 특정 작업 시 사전에 권한 허용 확인
- 모든 도구 실행 및 출력 결과 내역을 보여주는 활동 로그

핵심은, LLM이 자율적으로 도구의 호출을 판단해서 처리하지만, 사용자가 언제든지 얼마든지 필요에 따라서 도구 호출 프로세스를 제어할 수 있다는 점(or so it was meant)

## Resource 사용 시나리오

AI 앱이 가져다가 LLM 모델에 컨텍스트로 제공할 수 있는 정보를 제공하고자 하는 목적.

모든 리소스는 유니크한 URI를 가져야함.

그리고 MIME type을 명시해서 잘 처리될 수 있도록 해야함.

Resource는 기본적으로 LLM한테 목록이 제공되는게 아님. 사용자가 필요한 경우에 명시적으로 Resource를 요청해서, LLM에 질의할 때 전달하는 메커니즘을 만들던가 해서 어쨌든 사용자/시스템에 의해서 fetch되어서 LLM에 주입되는 형식(LLM이 먼저 리소스 목록 보고 이 리소스 나 필요할거같은데 하는 구조가 아니라는 뜻)

## Prompt 사용 시나리오

재사용 가능한 템플릿을 제공함.

MCP 서버 제작자가

- 변수를 삽입해서 완성해서 사용할 수 있는 프롬프트 제공
- MCP 서버를 잘 사용할 수 있는 예시를 제공
  할 수 있음.

어떻게 사용자에게 프롬프트를 보여줄 수 있는가?(일반적인 사용성)

- `/`를 입력해서 사용 가능한 프롬프트 보기
- UI 버튼

# 관련 지식

## MIME..?

MIME Type이 뭔지 몰랐는데 알아보려고 함 리소스에서 개념이 등장해서

MIME Type은 인터넷을 통해 전송되는 리소스(파일, 문서)의 형식과성격을 식별하기 위해 사용되는 표준화된 문자열.

미디어타입 혹은 콘텐츠 타입이라고 불리며 원래는 이메일 첨부파일 처리를 위해서 고안된 표준에서 유래함.
(MIME = Multipurpose Internet Main Extensions)

타입/서브타입의 두 부분으로 구성

구조 예시

- `text/html`: Text카테고리에 속하는 HTML문서(웹페이지)
- `image/png`: Image카테고리에 속하는 PNG형식의 이미지 파일
- `application/json`: Application 카테고리에 속하는 JSON 형식의 데이터
- `video/mp4`: Video 카테고리에 속하는 MP4 형식의 비디오 파일

역할은? 데이터를 받는 클라이언트(주로 웹 브라우저)에게 해당 리소스를 어떻게 처리해야되는지 알려주는 것임.

데이터를 전송할 때, '지금 전달하는 데이터(body)는 이런 형식으로 구성되어 있으니 이 형식에 맞춰서 해석하고 처리해~~' 하고 알려주는 것.

# MCP 서버 만들어서 간단하게 호출해보기.

MCP 서버 python-sdk 문서 그대로 따라해서 만들고,

로컬에서 ngrok을 이용해서 임시로 배포함.

그리고 curl을 활용해서 호출하려고 했는데, 2가지 문제가 있었음.

- 배포된 주소의 /mcp 경로로 호출해야되는걸 몰랐음..ㅎ -> 근데 이거 어디에 나와있지?? python-sdk 공식 문서에 Mounting to an Existing ASGI server 부분을 보니까 Streamable HTTP 형식으로 실행 시 `/mcp` 로 실행된다고 함. (SSE 방식은 `/sse`로 됨) 클라이언트 만드는 부분에도 그렇게 작성되어 있네 보니까. (localhost:8000/mcp)

그래서 일단 경로는 잡아서 tools/list 요청을 전송해봤는데 이번에는 **session-id가 없는 요청이라는 응답이 반환됨**. 읭?! 처음에는 무슨 소리인지 이해를 잘 못했는데 생각해보니 어제 공식 문서 읽었던 내용 그대로였음.

처음에 client와 서버가 연결 시, client가 바로 서버한테 요청을 보내는게 아니라 먼저 initialize를 통해서 서버와 handshake 과정을 통해 먼저 연결을 수립하는 과정이 필요함. 근데 curl로 바로 도구목록을 호출하려고 해서 아직 클라이언트에 대해서 서버가 인지하지 못한 상태였던게 문제였음.

mcp 라이브러리 사용해서 ClientSession 만들어서 서버로 요청을 해보니 잘 동작함

오호 이런저런 추상화를 해주는 게 진짜 편하다는걸 체감함.

curl로 알아서 하려고 함 -> 삽질함.
python-sdk를 사용함 -> handshake할 필요없고, 서버에서 별도로 output을 형식을 json-rpc에 맞출필요 없이 @mcp.tool decorator 써서 함수 선언하면 되고 등등...mcp 규격에 맞게 해주는 로직들이 추상화되어있음.

무튼 이렇게 해서 연결하는데 성공했음..후후
