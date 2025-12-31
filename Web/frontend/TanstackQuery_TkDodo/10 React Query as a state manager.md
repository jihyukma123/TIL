# 10 - React Query as a state manager

> React Query is an async state manager.

비동기 상태 관리 도구라고 명시적으로 언급하고 있음.

data fetching 라이브러리가 아니라고 언급하는데, 사람들이 많이 착각하는 부분이라고 함.
이게 조금 헷갈렸는데, `axios`, `fetch` 같은 도구들이 data fetching 도구이고 React Query를 쓰더라도 여전히 이런 도구를 써서 서버 데이터를 불러와야함. 아하 그런 뜻이구나.

`axios`를 쓰건 뭘쓰건, `useQuery`에 전달한 `queryFn`이 불러온 데이터를 관리하는게 주 목적.

모든 종류의 async state를 관리할 수 있다.

React Query를 사용하면 동일한 queryKey를 가지는 async state를 global하게 가져다 사용할 수 있음.

이걸 정말 제대로 사용하려면 useQuery를 한 번 더 custom hook으로 추상화하면, 동일한 fetching 로직을 작성할 필요가 없이 동일한 데이터만 계속 가져다 사용할 수 있음.

wrapping을 한 번만 간단하게 해서 원하는 custom hook으로 queryKey도 신경쓸 필요 없이 사용할 수 있다는 점이 참 매력적인듯?

궁금한 점이 기타 functionality들을 추가해서 하나의 custom hook으로 같이 묶을 수가 있나??
-> 가능하다. custom hook이 반환하는 객체에 useQuery가 반환하는 객체값들에 추가로 내가 원하는 값들을 처리해서 반환하면 됨
-> 하지만 그 값들이 실제로 복잡도를 낮추는지? 꼭 global하게 사용되어야 하는 값들인지 잘 생각해보고 써야한다.

## React Query는 backend data와 frontend에서 가지고 있는 snapshot을 synchronize하는 방법을 제공.

- data is not 'owned' by frontend.

## React Query이전에 주로 쓰였던 방법들

두 가지 방법이 주로 사용됨

**fetch once, distribute globally, rarely update**

데이터를 application 시작할 때 같은 특정 시점에 불러와서, redux같은 global state manager에 저장하고, update는 뭐 유저가 브라우저 새로고침 하든가... 모르겠고 알아서 같은 느낌으로 처리

**fetch on every mount, keep it local**

데이터가 필요한 컴포넌트에서 컴포넌트가 mount될 때마다 데이터를 불러와서 useState로 관리하는 형태. (useEffect안에서 fetch 후 useState에 저장)

---

두 방법 모두 server state를 불러와서 저장해서 적절히 사용하는 과정에서 발생하는 문제들의 일부만 해결한다.

첫 번째 방법의 경우 데이터를 자주 업데이트하기가 까다롭다.(data can get outdated.). 반면에 두 번째 방법의 경우 data를 과도하게 자주 불러오는 경우가 발생할 수 있음.

## Stale While Revalidate

기본 컨셉은, data가 stale한 데이터여도 no data보다는 ux측면에서 낫다는 관점에서 stale-while-revalidate 전략을 차용해서 로직을 구현함

## Smart Refetches

데이터를 caching하는 것 자체는 어렵지 않음(정말 단순히 표현하면 그냥 in memory에 저장하는 거니까)

근데 caching된 데이터가 backend 데이터와 일치하는지 확인하고, 필요하면 업데이트 하는 시점을 잡는 것은 참 어려운 일이고 사실 이게 해결해야되는 문제점임.

어떻게 적절한 시점을 선택해서 다음 2가지 사항들을 충족시킬 것인가?

- 데이터를 최신 상태로 유지하기 위해서 너무 자주 재요청해서 불필요한 리소스 낭비가 발생하지 않으면서도
- 데이터가 적절하게 업데이트 되어서 사용자 경험을 해치지 않는 최신 DB/backend상태를 보여줄 것인지?

React Query는 이에 대해서 몇 가지의 포인트 지점을 잡아서 refetch를 수행함.

- `refetchOnMount`
  - useQuery를 호출하는 컴포넌트가 mount될 때마다 revalidate
- `refetchOnWindowFocus`
  - browser tab을 focus 할 때마다 refetch가 발생함.
- `refetchOnReconnect`
  - network 연결이 소실되었다가 다시 복구된 경우

그리고 개발자가 임의로 필요하다고 판단되는 포인트를 잡아서 invalidateQueries 함수를 활용해서 업데이트 처리
