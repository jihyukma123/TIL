# HTTP Caching에 대해서 알아보자.

이번 달(2025년 2월)에 HTTP의 기본적인 내용에 대해서 공부하면서 HTTP에서 컨트롤 가능한 요소들에 caching, authentication, proxy, session 등이 있다는 걸 배웠었음.

그리고 멘토링 관련해서 React Query의 기본적인 부분들에 대해서 공부하는데 React Query가 `stale-while-revalidate`이라는 철학을 기반으로 만들어진 라이브러리라는 것을 알게 되었고, `stale-while-revalidate`이 뭔지 궁금해서 찾아봤다.

그랬더니? HTTP 스펙에 명시되어 있는 `Cache-Control` header의 `stale-while-revalidate`라는 directive를 통해서 서버가 캐싱 layer(CDN, browser, proxy 등)에 특정 정보를 특정 캐싱 메커니즘으로 처리하도록 할 수 있다는 점을 배웠음. (싱기방기히히)

그래서 이참에 HTTP가 제공하는 caching관련 기능들이 뭔지 한 번 공부해보기로 함.

[MDN HTTP caching 문서](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) + [HTTP Caching 스펙 문서](https://httpwg.org/specs/rfc9111.html) 를 보면서 공부해보았음.

## Cache의 장점이 무엇인가?

왜 쓰는걸까?

요즘은 부쩍 뭔가 왜 이런 짓을 하게 되었을까 하는 생각이 드는데, caching에 대해서도 그런 부분이 궁금해졌음.

history를 찾게 된다고 해야되나....

HTTP Caching 문서에는 caching이 improve performance 때문에 사용된다고 명시하고 있음.

그리고 이는 어떤 메커니즘일까? 기반이 되는 아이디어 자체는 `재사용`이다.

> The goal of HTTP caching is significantly improving performance by reusing a prior response message to satisfy a current request.(HTTP Caching 스펙 문서)

`Reusability`가 가지는 이점들 - 다시 origin server로 요청을 보낼 필요가 없고, cache가 origin server보다 물리적으로 가까운 위치에 저장되어 있을수록 더 빠른 response를 제공할 수 있음.
(browser가 cache를 가지고 request에 대한 응답을 제공하는 경우가 하나의 예시), 그리고 origin server가 request를 처리할 필요가 없으므로 load를 줄여준다. (parse and route the request, restore session based on the cookie, query DB, render template engine 등 여러 작업이 수행되지 않아도 됨)

결국 server system의 health, 그리고 그와 연관된 사용자 경험에 굉장히 critical 한 역할을 한다.

## Cache의 종류

`private cache`와 `browser cache`가 존재한다.

**private cache**

특정 클라이언트와 1대1로 매칭되어 있는 캐시로, 일반적으로 브라우저 캐시를 의미.

private cache를 적용하기 위해서는 `private` directive를 추가해야 한다.(Cookie가 private한 데이터를 저장하기 위해 자주 사용되기는 하지만, Cookie에 담겨있는 데이터라고 해서 꼭 private한 데이터라는 것이 보장되지는 않는다는 점 유의)

**Shared Cache**

shared cache는 클라이언트와 서버 사이에 위치하면서 사용자들이 공유할 수 있는 데이터 저장.

proxy cache 와 managed cache로 분류할 수 있음.

proxy cache

# 번외 - HTTP 문서에서 사용된 HTTP 정의

`The Hypertext Transfer Protocol (HTTP) is a stateless application-level protocol for distributed, collaborative, hypertext information systems.`

- stateless
- application-level protocol
