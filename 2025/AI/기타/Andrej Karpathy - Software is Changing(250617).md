# Andrej Karpathy: Software Is Changing (Again)

[Andrej Karpathy: Software Is Changing (Again)](https://www.youtube.com/watch?v=LCEmiRjPEtQ)를 보고 정리해본 내용

# Software is Changing V1

Again 이전에 Software가 어떻게 변경되었는지, `Software 1.0` -> `Software 2.0`이 무엇이었는지?? (2017년에 카파시가 관련해서 글을 작성했다고 함)

Software 1.0 -> 사람이 작성하는 코드

Software 2.0 -> Neural Network, 결정적이 아니라 weight 기반으로 결과를 도출하는 식으로 동작하는 소프트웨어(fixed function neural net)

# Software is Changing V2

Software 2.0 -> Software 3.0

Software 3.0 -> `programmable neural net`

- `prompts -> LLM` 프롬프트가 LLM을 프로그래밍 하는 코드라고 볼 수 있음.

대부분 영어로 프로그래밍 된, 자연어로 프로그래밍 가능한 소프트웨어가 등장했다고 볼 수 있음.

# 테슬라에서 경험한 전환의 예시

테슬라에서 자율주행 개발할 때, 처음에는 대부분 C++로 개발된 Software 1.0 기반으로 이미지 데이터를 처리하는 Software 2.0이 약간 결합되어 있는 구조였다고 함.

근데 성능을 개선하는 과정에서 점점 Sotware 2.0이 Software 1.0을 대체했다고 함. C++로 작성되었던 기능들이 점차 neural network 기반으로 동작하도록 대체되었고, C++코드(Software 1.0)로 작성된 부분은 점점 줄어들었다고 함.

그리고 지금 Software 3.0으로 넘어오면서 또 비슷한 일이 발생하고 있다고 함.

그래서 이 사람이 생각하는 것은, 많은 소프트웨어가 기존 1.0/2.0으로 처리하던 부분을 3.0으로 대체하는 작업이 이루어지지 않을까.

# 지금 이 산업군에 진입하는 사람들은 뭘 해야되느냐..?

`It is a very good idea to be fluent in all of them`...

1.0, 2.0, 3.0 각각 장단점이 명확하기 때문에 장단점을 인지하고 어떤 문제를 어떤 방식으로 풀어낼지 판단하는게 중요하다는 것으로 이해함

개인적으로는..

나는 가지고 있는 경험은 1.0 위주임. 그리고 지금 하는 일은 3.0을 1.0과 결합하는 형태로 작업을 많이 수행하고 있는데, 2.0에 대한 직접적인 경험을 쌓기는 어려울 수 있어도 관련해서 공부는 해야될 것 같다.

결국 이 전체적인 구조 속에서 각각 어떤 영역들이 존재하고, 어떤 문제들을 어떤 기술로 풀어내는게 적절한지 내재화해서 적재적소에 기술을 활용할 수 있어야 함.

# How to think about LLMs

`AI is the new electricity. - Andrew Ng`

근데 카파시가 강조하는 부분은, LLM과 운영체제의 유사성임

구조로 보면 dominant한 closed 소프트웨어가 몇 가지 존재하는 와중에(Windows, macOS와 같은 GPT, Gemini, Claude) 몇 가지 오픈소스 모델들이 공존하는 구조(Llama가 마치 linux와 같은 포지션으로 나아갈 가능성이 있다고 함.)

근데 기존 기술들과 좀 다른 점은,

예를 들어서 인터넷은 초기에 군사적인 용도로 개발되었고, 나중에 일반 대중들이 많이 사용하는 기술로 상용화되었음.

즉 Government -> Corporation -> Consumer 순서로 기술이 확산되었는데,

LLM은 Consumer -> Corporation -> Government 순서로 확산되는 기존과 다른 순서의 확산을 보여주는 기술임.

일반 유저들의 General한 요청을 더 많이 처리하고 있음.(저녁으로 뭐먹을까 같은...)

결국 이야기하고자 하는 점은, 아직은 일반적이고 General한 문제를 처리하고 있지만, 이걸 어떻게 Programming해서 우리가 원하는 더 복잡하고 전문적인 문제들을 풀어낼 것인지?? 이게 당면한 과제임.

# LLM Psychology

이게 뭔지? LLM이란 무엇인가??

어떤 특성들이 있는지??

- 엄청난 양의 기억용량을 가지고 있음. 학습된 내용을 다 기억한다.
- 하지만 인지오류도 존재함
  - 할루시네이션
  - 모르는건 처리 못함
  - 이상하게 못푸는 문제들이 존재.
- 인간은 학습을 하고 수면을 통해서 기억을 강화하고 정리하는 등 변화하지만, LLM은 아직 그 영역에는 도달하지 못했음.
- 잘 속음. 아직 prompt injection과 같은 이슈에서 자유롭지 못하다. (gullible) security issue들이 존재함.

그러면 결국 어떻게 결함을 극복해서 제공하는 장점을 잘 누릴 것인가? how do we program them???

# Partially Autonomous Apps

`Cursor`같은 도구를 코딩을 위해서 사용함

- 전통적인 UI와,
- LLM integration 이 존재.
- autonomy slider를 통해서 사용자가 자율성 레벨을 조ㅓ절

이렇게 부분적으로 자율적인 앱들을 사용하는 ux는 보통,

- LLM이 코드를 작성하고,
- 사용자가 코드를 검토하는 방식

이 루프 구조에서 뭐가 중요할까? 작업을 잘 처리하기 위해서 뭘 신경써야 할까?

1. Verification(by human)의 경우, 쉽고 빠르게 하는 것이 중요함. 이게 winning point
2. Generation(by LLM)의 경우, Successful한 verification의 가능성을 높이기 위해서 잘 통제된 범위 내에서 생성하도록 하는게 중요함

이 generation-verification루프를 빠르고 확실하게 돌리는 것이 승부처.

# 그래서 지금의 Autonomous Software개발은..?

What it is not

- AGI
- Jarvis
- flashy, fully autonomous agents

WHat it is, or what we should be expecting and be aiming for

- 아이언맨 슈트의 Augumentation적인 측면, 즉 강화하는 역할
- 부분적으로 autonomous한 프로덕트
- Custom GUI와 UIUX(커서에서 GUI를 통해서 코드 diff를 보고, tab/cmd+enter를 통해서 Accept하거나 Reject하거나 하는 등..)
- Fast Generation and Verification Loop
- Autonomy Slider를 통해서 사용자가 자율성 레벨을 조절할 수 있는 UX

# Vibe Coding에 대해서...

이건 엄청난 변화

한 번도 인간의 역사에서 오로지 자연어로 프로그램을 만드는게 가능했던 적이 없었음.

지금은 누구나 자연어로 Super Customized된 소프트웨어를 만드는 것이 가능해진 시대.

내가 이 부분에 대해서 생각을 좀 안해봤었는데, 이게 좀 대단한 부분인 것 같음.

초개인화된 앱을 만들기 좋은 세상이 되었다는 것.

근데 이 관점에서 생각해보면 pwa같은 기술이 되게 promising한 측면이 있네.

원래는 앱을 쓰려면?? 물론 demo앱을 싸서 설치하는 것도 가능하지만, 가장 간단하게 accessible 한 방법은 webpage를 배포해서 접속하는 것 같음(ios, android에서 강제하는 정책을 많이 우회할 수 있음.) 근데 이거를 웹처럼 배포하면서도 동시에 앱처럼 사용할 수 있다..? 그러면 진짜 초개인화된 소프트웨어를 다 만들어서 그냥 본인 필요에 따라서 사용하면 되겠네.

흠흠

무튼 카파시가 근데 실제로 바이브코딩으로 menugen이라는 간단한 앱을 만들어봤는데, 이 과정에서 느낀 점은 코딩이 가장 쉬운 부분이었다는 것.

오히려 DevOps적인 작업이 더 귀찮고 번거로웠다고 함.

구글 로그인 붙이고 싶었는데 LLM에 물어봐서 시키는걸 따라했다고...

# 그래서 마지막 부분은.... `Build for Agents`

최근에 정보체계에서 완전히 새로운 유형의 정보 consumer/manipulator가 등장했는데 그것이 바로 `Agent`.

Agent는 컴퓨터이지만 사람처럼 동작한다는 새로운 특성을 가짐

내 생각이 이 주제를 통해서 전달하고자 싶은 부분은, 우리가 어떤 프로덕트를 만들 때 이제는 Agent라는 새로운 정보 주체를 같이 고려해서 만들자는 것.

예를 들어서, `robots.txt` 파일을 작성하면 웹크롤러가 이 파일을 통해서 어떻게 크롤링을 해야되는지 알게 된다고 한다.

이것처럼 `llms.txt` 파일을 만들어서 Agent에게 어떤 식으로 이 페이지를 이해하고 처리하면 되는지에 대한 가이드를 제공한다면..?

LLM이 HTML을 직접 읽고 파싱해서 페이지에 대해서 이해하는 것보다, txt파일 같은 텍스트를 처리하는게 훨씬 더 이해도 잘하고 정확하게 처리될 가능성이 높음

지금 존재하는 많은 문서들을 보면 LLM이 이해하기 쉽게 작성된 것이 아니라, 사람이 이해하기 쉽게 작성된 것들이 많음.(실제로도 소비자들은 오직 사람이었으니까)

그래서 요즘 많은 서비스들이 문서를 LLM이 이해하기 쉽게 변환하는 것을 많이 보고 있음.

(llms.txt 같은 파일을 올리는 등 최대한 plain text로 구성된 형식의 txt나. markdown 문서를 같이 제공함)

또한 요즘 많은 서비스들이 기존 정보들 중에서 LLM이 쉽게 이해하지 못하는 정보를 LLM에 쉽게 먹일 수 있는 정보로 변환하는 처리를 하기도 함.
