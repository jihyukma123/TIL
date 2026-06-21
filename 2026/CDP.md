# CDP - Chrome DevTools Protocol

최근 Codex Changelog에 `Made Browser use up to 2x faster through CDP and DOM snapshot optimizations that reduce browser round trips.` 라는 내용이 있는데 CDP가 뭔지 몰라서 찾아봄.


## [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

> allows for tools to instrument, inspect, debug and profile Chromium, Chrome and other Blink-based browsers.

크로미움 엔진을 쓰는 브라우저에서 사용이 가능하다는 소리라고 한다.
-> “Chromium 제품이 아니더라도, Blink/Chromium 계열 런타임이고 CDP endpoint를 열 수 있으면 DevTools Protocol로 붙어서 디버깅할 수 있다.” 이렇다고....
(CDP endpoint를 연다는건 무슨 소리지..? -> Chrome등 브라우저를 `--remote-debugging-port=9222` 같은 옵션으로 실행하면 해당 port에 chrome이 디버깅용 서버를 하나 실행하는 것처럼 동작해서 localhost:9222로 제공되는 디버깅 api를 호출해서 정보를 받을 수 있다고 함.)

## How does this relate to Codex?

그래서 Codex에서 CDP가 어떻게 연결되는건데?

이걸 정확하게 파악하고 전파하는게 기술적인 이해를 높이는데 도움이 될 것 같다.

보다 넓게 보면, how can AI Agents interact with browsers?
-> AI Agent가 browser들에 접근해서 활용하는 case를 만들려면 무엇이 필요한지?

이런 문제를 활용해서 한 번 같이 전파하면 좋을 것 같은데 그치. 
-> 이거는 단순히 Codex만의 문제가 아니라, AI Agent들이 내 컴퓨터에서 업무 자동화 등 핵심적인 도구 중 하나인 브라우저를 사용하는 표준화된 방법이 될 가능성이 굉장히 높아 보인다.

Playwright MCP를 쓰는거 말고..

Playwright MCP를 붙여서 쓰는거랑 무슨 차이가 있는건지, 뭐가 더 높은 수준의 작업을 가능케 하는지도 알아보면 좋을 것 같고, 
+@로, 최근에 조던님이 알려주셨던 RTK 같은걸 CDP에도 적용해볼 수 있지 않을까 하는 생각이 드네. 많은 정보가 context로 주입될텐데 tool result를 분석해서 특정 정보는 필터링 하는식으로 context를 많이 save 할 수 있을 것 같음.

-> 더 나아가서는, Agent 들이 개발 프로세스에서 공통적으로 많이 호출하는 tool들을 분석하고 이 tool들의 정보를 효율적으로 필요한 것만 깎는 것을 통해서 context를 많이 save할 수 있지 않을까? 이것도 좀 파고들어볼 수 있는 주제일 것 같은데.

하반기 학습 주제 이런걸로 잡아볼까?
-> 개발하는 과정에서 Agent 들이 자주 호출하는 Tool들이 어떤 것들이 있는지 그런 tool들이 외부 의존성이 있을 때, 그 의존성들에서 일반적으로 제공되는 형태의 tool response에서 조금 더 효율화된 방법으로 response를 받아서 context를 잘 사용할 수 있을지? -> 이를 통해서 Token 효율화가 가능하지 않을지? 한 번 연구해보고 전파하는거지.

한 번 이 부분을 좀 꾸준히 파고 들어서 공부를 좀 해보자.
