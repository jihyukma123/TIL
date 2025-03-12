# react query의 창시자 Tanner Linsley의 conference talk를 들어보자.

global state

- convenient
- avoid prop drilling
- shared communication
- accessed, not copied

-> in the end, helps us do more with less code

근데, 요즘 앱들은 죄다 서버에서 데이터를 불러와서 클라이언트에서 데이터를 사용해서 렌더링되잖아.

서버 상태는 여기저기서 쓰이는 경우가 많고 하기 때문에 개발자들은 자연스럽게 서버 상태를 클라이언트 상태와 함께 global state로 저장하게 되었음(client state를 관리하던 방식대로 server에서 불러온 값도 관리하게 되는 형태였던 거지)

그래서 이렇게 쓰다보니 redux같은 global state manager에게 async state 관련된 복잡한 lifecycle(fetching, updating)을 관리하는 책임도 같이 부여하게 되었음.(거기에 데이터가 있으니까 당연한거 아닐까?)

이러다보니 같이 저장되어 있는 상태이기 때문에 async data와 client state간 차이를 인지하지 못하게 되었음.(근데 이 둘은 너무나도 다른 성격의 데이터)

- 어디에 데이터가 근본적으로 저장되는지
  - async data는 client 밖에, client state는 client안에 저장되어 있는 상태임
- speed of access
  - 일반적으로 client state는 바로 접근이 가능한 반면 async data는 외부 시스템의 상태, 네트워크 상태 등 다양한 변수의 영향을 받아서 바로 접근이 될거라는 보장이 없음
- how they are accessed
  - client state는 따로 네트워크 통신이 필요없이 메모리에서 값을 가져오는 형식으로 동작하지만, async data는 네트워크 통신이나 기타 통신의 방법을 통해서 데이터를 가져와야만 함
- who can make changes
  - client state는 일반적으로 사용자가 변경을 유발하는 반면에, async data는 해당 데이터에 접근이 가능한 주체들이 모두 변경을 유발할 수 있음.

**Client State**

- non-persistent
- synchronous
- client-owned
- reliably up-to-date

**Server State**

- remotely persisted
  - location of source of truth is outside of the client's control
- asynchrous
  - have to be accessed with async API
- shared ownership
  - can be manipulated by the server or any other client having access to the server
- potentially out-of-date

---

Server State의 특성들 때문에 자연스럽게 따라오는 문제점들이 존재함

- caching 관련 이슈들
- 중복 요청 처리
- 백그라운드 업데이트
- 시간이 초과된 요청 처리
- 데이터 업데이트
- 페이지네이션

등등..
