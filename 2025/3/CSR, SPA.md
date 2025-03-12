# React를 공부하면서...

회사에서 React 강의를 들으면서 아는 내용도 있지만, 이미 아는 내용이라고 건너뛰기 보다는 더 깊게 이해하는 시간으로 생각하고 공부해보는게 좋겠다는 생각이 들었다. 기본기...기본기..!! 으악..

이거 테마 좋은데..? Palenight Theme 인데 마음에 든다. ㅎㅎ 근데 Mardown은 색깔이 마음에 드는데 코드는 영 별로라 바로 변경..ㅠ

CSR, SPA와 관련된 부분들을 공부해보고자 한다. 그게 뭔지, 어떤 문제가 있는지 등등..

# [Rendering on the Web](https://web.dev/articles/rendering-on-the-web)의 CSR부분 읽어보기

흥미로운 것은 이 글은 일반적으로 SSR/Static rendering을 full rehydration approach(CSR같은 방법을 말하는 듯)에 비해서 추천한다는 점. (React에 비해서 Next.js를 추천한다 같은 느낌인 것 같음 도구로 따지면.)

그래도 나는 일단 React 공부를 해야되니까 CSR부분을 공부하겠다. 후후

CSR이란? -> 브라우저에서 바로 JS를 이용해서 페이지들을 렌더링 하는 것.

data fetching, logic, templating(templating?), routing 등이 다 server가 아니라 client 즉 브라우저에서 처리됨.

-> 이렇게 하면 어떻게 되는거임? in the simplest form, more data is passed to the client from the server.

이 부분을 읽고 이런 생각이 들었다. `렌더링`이라는 100짜리 작업이 있다고 쳤을 때, 100짜리 작업을 웹사이트를 사용자에게 보여주기 위해서 함께 동작하는 시스템 구성요소들이 각각 얼마나 나눠서 작업을 처리하느냐의 차이에서 모든게 시작하는게 아닌가? 물론 세부적으로 들어가면 여러 가지 차이점들이 존재하지만, 근본적인 목적인 `사용자에게 데이터를 보여주기 위해서 브라우저 화면을 렌더링한다` 라는 작업을 처리하는 측면에서는 누가 더 일하고 덜 일하고의 차이인 듯.

어차피 100이라는 일을 해야되니까, 서버에서 일을 좀 덜하면 클라이언트가 그만큼 일을 더 해야지. 해야될 일 자체가 줄어드는게 아니라는 점. 리소스를 어디서 많이 사용하는가.

왜 클라이언트로 많이 넘어왔지? CSR이 비용 측면에서 SSR보다 낮을 가능성이 있을까?(server에서 렌더링을 처리하는 비용 vs 더 많은 네트워크 통신이 유발되면서 발생하는 비용 이런 것도 궁금하긴 하네)

무튼 중요한 부분은 더 많은 데이터가 리소스 요청 시점에 클라이언트로 전송되어야 한다는 점.

근데 놀랍게도 JS리소스 관리를 타이트하게 하고, 서버-클라이언트 왔다갔다 하는 횟수를 최소화하면 CSR을 거의 SSR급 성능을 내도록 할 수 있다고 되어있네.
이를 도와주는 여러 잡기술들이 존재하는 것 같음.(`<link rel=preload>`를 써서 parser가 더 빠르게 중요한 스크립트를 실행하도록 하는 방법, PRPL같은 패턴을 쓰는 방법 등을 적용)

CSR의 단점으로는 앱이 성장하면서 요구되는 JS의 양도 같이 늘어난다는 것.(INP에 영향을 주게 되겠지?)

규모가 큰 JS번들이 요구되는 앱들은 code-splitting을 공격적으로 도입하고 lazy-loading같은 기술을 활용하는 것이 추천됨.

SPA를 만드는 경우, 많은 페이지들이 공유하는 user interface를 application shell caching 전략을 활용해서 개선할 수 있다고 함. (이 부분은 차후에 따로 공부가 필요한 주제)

글 결말에도 대부분의 경우에 static rendering이나, server-side rendering(이 대표하는, HTML + 최소한의 JS 조합)이 get the job done이라고 언급하고 있음.

이렇게는 생각 안해봤는데, 앞으로는 꼭 내가 제공하고자 하는 사용자 경험(풀어야 하는 문제)를 기준으로 그걸 가장 잘 achieve할 수 있는 기술을 판단하고 적용할 줄 아는 사람이 되어야 겠다고 생각함.(case by case라는 점도 같이 고려해서 동적이지만 근거있는 결정을 할 수 있어야 하고 그러려면 폭 넓은 지식과 경험이 필요함)

# SPA와 CSR의 관계?

SPA가 렌더링 모델로 CSR을 채택하는 구조임.

SPA 자체는, route 간 이동해도 full-page reload가 발생하지 않는다는 것. (SPA vs MPA는 페이지를 하나로 두느냐, 여러 개로 두느냐의 차이이고, CSR vs SSR은 렌더링 작업이 클라이언트에서 발생하는가 서버에서 발생하는가. 이론적으로는 SPA도 렌더링을 서버에서 할 수도 있지 않을까? 네트워크에서 부분 렌더링 해서 받으면 되는거지.)

SPA는 기본적으로 사용자 interaction과 그로 인한 UI 업데이트가 많이 발생하는 경우에 좋다. (real time feedback이 필요한 경우, server 왔다갔다 필요없이 바로 JS실행해서 피드백 제공 가능.) 예를 들어 dashboard나 SNS같은 경우,

# (기타) Soft Navigation vs Hard Navigation

web.dev 문서를 통해서 MPA에 사용되는 browser built-in navigation 방식이 `hard navigation` 방식이라는 것을 알게 되었는데, 개념을 처음 들어봐서 알아봤음.

**hard navigation**

전통적인 페이지 간 이동 방식으로

- 브라우저가 완전히 페이지 reload
- DOM 전체적으로 rebuild
- browser window가 새로고침 되는게 보임
- resource가 다시 다운로드 됨

대부분의 경우에 브라우저가 완전히 새로운 HTTP 요청을 서버로 보내고, 서버가 반환한 새로운 HTML문서를 받아서 다시 parse -> render 하는 방식으로 수행된다.
(server request를 보내지 않고 hard navigation이 발생하는 경우도 존재하긴 함)

이렇게 `hard navigation`이 발생하게 되면 다음과 같은 일이 발생함.

- in-memory에 존재하는 모든 JS 변수와 상태가 날라감
- DOM 상태 날라감
- Event Listener 다 날라감(DOM이 파괴되니까)
- setTimeout/setInterval과 같은 타이머 취소
- 열려있는 WebSocket 닫음
- 실행 중인 Web Worker 종료

**soft navigation**

현대적인 이동 방식으로

- 페이지의 일부만 변경
- 페이지 전체가 reload되지 않음.
- DOM이 부분적으로 업데이트
- 리소스가 동적으로 로딩딤
- 브라우저 히스토리가 코드적으로 관리됨

SPA에서 보통 채택하는 방식.

사용성이 더 스무스하고 앱 같은 느낌을 준다.

장점

- 퍼포먼스: 네트워크 사용이 더 적고, 사용자가 인식하기에 로딩이 더 빠르다고 인식함
- 컨텐츠가 업데이트 될 때 화면이 깜박이거나 로딩이 적기 때문에 스무스한 UX 제공
- 앱 상태가 유지됨
- 서버 부하 감소
- Better mobile ux, feels more like a native app

단점

- SEO: 내용을 보려면 JS가 실행되어야 함.
- 애널리틱스: hard navigation에서 동작하는 방식의 page view tracking이 안됨. 커스텀 해결책이 필요함
- 오랫동안 사용되는 SPA의 경우 신경쓰지 않으면 메모리 누수가 발생할 수 있음.
- 초기 로딩이 오래걸릴 수 있음.

# hydration?

Rendering on the Web 아티클에서 용어 통일을 위해서 `Rehydration`을 정의한 부분이 이해되지 않는다. 무슨 소리지 hydration 이 뭐임
