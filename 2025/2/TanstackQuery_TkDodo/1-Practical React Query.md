# Practical React Query

## Client State vs. Server State

2018년에 GraphQL 데이터를 관리하는 Apollo Client가 유명해졌을 때 이 기술이 과연 그 유명한 `Redux`를 대체할 것인가에 대한 논의가 많았다고 함.

근데 저자는 '아니 근데 Apollo Client는 axios 같은 data fetching library인데 왜 redux같은 global state manager를 대체할 것이라고 하는걸까?' 라는 의문을 품었다고 함.

하지만 잘못생각했다고...

Apollo Client는 server에서 data를 가져오는 것 뿐만 아니라, 해당 server 데이터에 대한 cache랑 같이 가져온다고 한다.

이는 동일한 hook을 여러 컴포넌트에 걸쳐서 사용해도 데이터 fetching은 한 번만 발생하고 이후에는 cache에서 데이터를 가져다 쓰는 형태인데, 사실상 기존에 redux로 하던 일이랑 크게 다르지 않음.(server에서 가져온 값을 여러 컴포넌트에서 사용하기 위해서는, 1. fetch value from server, 2. make it globally available using redux)

Redux등 상태 관리 도구를 활용해서 서버에서 가져온 데이터를 client state처럼 처리하고 있었다는 의미....(엄연히 다른 성격의 데이터인데 동일한 방식으로 관리하고 있었구나)

클라이언트 상태 - owner가 클라이언트임. 즉 클라이언트가 상태의 탄생부터 변화, 종료까지 온전히 컨트롤 하는 주체

서버 상태 - owner가 서버임. 클라이언트가 소유하고 있지 않은 상태라는 점이 매우 중요한 부분이다. 클라이언트는 말그대로 서버에게 데이터를 `요청`해서 데이터의 특정 시점의 상태를 빌려온 개념이 되는 것.

Using client-side caching mechanisms to temporarily store and display data that originates from external services or APIs that your application interfaces with but doesn't control.

통상적으로 많은 앱들이 서버에서 값을 가져와서 클라이언트를 구성하고 요청을 처리하는 경우가 많음. -> 즉 cache를 활용하는 방식으로 클라이언트 상태/서버 상태를 분리해서 사고하기 시작하면서 클라이언트에서 정말 글로벌하게 공유해서 관리되어야할 상태가 생각보다 별로 없다. -> redux같은 도구로 관리할 상태가 많이 줄어든다 -> 즉 data fetching + caching 도구들이 client global state manager를 대체한다.

## React Query

React Query는 Apollo Client의 장점을 REST에 적용한다.

- works with any function that returns a promise
  - promise를 반환하는 함수라면 뭐든지 caching해서 결과값을 재사용할 수 있다는 의미로 이해됨
- stale-while-revalidate caching 전략을 사용(stale-while-revalidate 관련조사 글 있음.)
  - HTTP의 스펙 중 하나인 stale-while-revalidate에 사용되는 철학을 가져와서 적용했다는 의미

`tries to keep your data as fresh as possible while at the same time showing data to the user as early as possible`

## 이후의 내용은 React Query를 좀 써보고 나서 다시 돌아오자.

사용할 때 참고할만한 팁이라고 함.
