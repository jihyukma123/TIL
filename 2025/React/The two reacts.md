# [The Two Reacts](https://overreacted.io/the-two-reacts/)

React -> component 조합해서 UI를 만드는 패러다임이라고도 볼 수 있음.

Component -> 결국 코드임. 그리고 코드는 어디선가 실행이 되어야지 UI를 보여줄 수 있는데, 그러면 이 코드가 어떤 컴퓨터에서 실행되는걸까?

사용자의 컴퓨터일까 아니면 다른 컴퓨터일까.

Case1. 사용자의 컴퓨터에서 실행되는 경우

컴포넌트에 해당되는 JS코드가 컴퓨터에 로딩되어 있다면, 코드의 실행은 즉각적이다. 딜레이가 없음 왜? 추가적인 데이터를 받기 위해서 서버 응답을 기다리지 않아도 되니까.

이게 가능한 이유는 컴포넌트 코드가 사용자의 컴퓨터에서 실행되기 때문에. 필요한 코드만 받은 이후에 `실행`은 사용자의 컴퓨터에서 이루어진다.

Case2. 서버에서 실행되는 경우

이 경우에는 약간의 딜레이가 `expected` 되는 UI에서 잘 동작한다.(기술적으로 잘 동작한다는게 아니라, 유저들이 이를 적절한 response로 인식한다는 것.)

단적으로 다른 곳으로 이동하는 링크를 누르는 경우에 유저들은 기다리지만, this is not the case for UI like pressing a button, clicking a switch button etc.

유저들이 즉각적인 반응을 기대하는 UI의 경우 최소한의 어떤 피드백을 주지 않으면 뭔가 동작이 좀 이상하다고 유저가 바로 인식함.

# 이는 기술적인 문제가 아니다.

기술적인 문제라기 보다는 그냥 자연스럽고 당연한 것.

문 손잡이를 돌릴 때, 바로 돌아가지 않으면 뭔가 이상한 것처럼 버튼을 눌렀을 때 최소한의 반응이 없으면 이상하게 느껴짐.

# 특정 UI에서는 사용자의 interaction에 대해서 어떤 반응을 보이긴 해야함.

그리고 이 반응은 must be guaranteed with low latency and with zero network roundtrips

# UI = f(state)

선언적 프로그래밍이라는 것을 나타내는 함수.

state가 변수고, UI를 결정짓는 요소

근데 위에서 말했던걸 생각해보면 2가지 상황이 존재한다.

- `UI = f(client state)`
- `UI = f(server data)`

근데 사실 실제 앱들을 생각해보면 거의 `UI = f(data, state)` 같은 느낌이다.

근데 그러면 여기서 우리가 해결해야되는 문제는 뭘까? React로 이 문제를 잘 해결하는 방법이 뭐지??

문제 - f에 해당하는 컴포넌트를 어떻게 서로 완전히 다른 환경(client, server)에 나눠서 렌더링을 처리할지?

어떻게 나눠야 react가 가지는 장점을 유지할지?? (어떤 컴포넌트는 사용자 컴터에서 실행하고, 어떤 컴포넌트는 서버 컴터에서 실행하는게 되는가?)

서로 다른 환경의 컴포넌트들을 조합/중첩하는게 가능한가?

어떻게 할 수 있을까?

OR more importantly,

How SHOULD it that work???

여기까지가 Dan의 게시물

# 내 생각을 한 번 써볼까.

일단 서버에서 렌더링되어야 하는 컴포넌트가 있고,

클라이언트에서 렌더링 되어야 하는 컴포넌트가 있음

이 과정을 어떻게 처리할까나...

흠....흠...

Dan이 언급한게, server데이터를 보여주는 컴포넌트들의 경우, server에 data가 있잖아. 그러면 Server computer에서 f(data)를 처리하면 data를 local에서 읽어서 처리가 가능함.

Server 컴퓨터에서 UI를 만들면 client에 도착했을 때는 그냥 html임. client는 그냥 보여줘야하는 UI만 받아서 보여주면 된다.

Server data는 server에 저장되어 있음 -> data가 저장되어 있는 곳에서 컴포넌트 코드가 실행되는게 맞다...

근데 이러면 어쨌든 같은 컴포넌트 안에서 server상태로 렌더링 되는 부분과, client 상태를 기준으로 렌더링 되는 부분을 별도로 처리할 수 있어야한다는 것 아닌가? (server부분은 server에서 만들어서 html가져오고, client는 코드 실행하고..)

이게 돼??

# RSC?

이거 결국 RSC 이야기인듯?

[reddit post](https://www.reddit.com/r/reactjs/comments/18yqalb/the_two_reacts/)에서 dan이 직접 언급한 내용들을 보면 RSC를 언급하고 있고, RSC가 사람들이 SSR이라고 많이 알고 있는데 아니라고 함.(흔한 오해인데 들을때마다 짜증난다고..ㅋㅋㅋ)

React관점에서 SSR이란 일반적으로 `HTML 생성`을 의미한다. JS가 loading되는 동안 initial state를 담은 HTML을 유저에게 보여주는 것.(SEO에 좋다 그래서..)

RSC는 component computation을 두 부분으로 분리하고자 하는 패러다임

- ahead of time 처리가 필요한 케이스(build 시 or server)
- client 컴퓨터에서 실행되는 부분

`RSC is a way to compose data requirements and computation ahead of time — not emit HTML (which is what SSR is).`

솔직히 무슨 소리인지 잘 이해는 안된다.ㅠ

RSC를 조금 더 탐구해보면서 관련 글들을 같이 읽어봐야할 듯.

- https://tech.kakaopay.com/post/react-server-components/
- https://www.youtube.com/watch?v=TQQPAU21ZUw
- https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md
- https://www.youtube.com/watch?v=ozI4V_29fj4
- https://github.com/reactwg/server-components/discussions/4
