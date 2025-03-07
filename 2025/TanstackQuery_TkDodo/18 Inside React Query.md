# 18 - Inside React Query

https://tkdodo.eu/blog/inside-react-query

what happens if you call useQuery???

## 시작점이 어디인지부터 보자.

이 문서를 보기 전에, React Query의 useQuery라이브러리 코드를 좀 보려고 까보다가 길을 잃었음.

그리고 나서 이 문서를 읽는데, 이 사람은 시작점을 `QueryClient`로 잡은걸 보고 내가 코드를 까보는 방식이 잘못 되었다는 생각을 했음..진입점부터 봐야하는데 무턱대고 중간을 보려고 하니 이해가 안되는 부분도 당연히 있었을 것 같다.

React Query를 사용하기 위해서는 `QueryClient` Class의 인스턴스를 생성하고 `QueryClientProvider`를 활용해서 전역에서 사용가능하도록 함.

`QueryClientProvider`는 React Context를 활용해서 전역에 공급됨

생성된 queryClient에 접근하기 위해서는 2가지 방법이 있는데, 이 중에서 `useQueryClient()` 훅을 추천한다. (최상위 컴포넌트에서 생성한 queryClient인스턴스를 export해서 사용하는것보다 DI와 관련해서 decoupling된 방법을 제공한다고 함. 내가 이해하기로는 특정한 queryClient에 연결되기 보다는 component tree어딘가에 위치한 queryClient를 쓰는 것이기 때문이라고 이해함. export한걸 가져다쓰면 딱 그 구체적인 변수에 바인딩된 값인 반면, useQueryClient를 사용하면 특정 값에 강하게 결합되는게 아니라 컴포넌트 tree에 존재하는 값을 사용하는 것만 정해져있음.)

## QueryClient의 역할

`QueryCache`와 `MutationCache`의 컨테이너 역할을 하며, 이 2가지는 queryClient가 생성될 때 같이 생성됨.

## `QueryCache`는 어떻게 구현되어 있는지?

in-memory 객체로,
key - 개발자가 설정한 queryKey를 직렬화한 hash값
value - `Query` 클래스 인스턴스

이런 구조라면, QueryCache객체에 저장되어있는 query들이 어떤 역할을 하는지 무엇인지 이어서 볼 필요가 있다.

## Query는 어떤 데이터일까?

대부분의 핵심 로직을 수행하는 컴포넌트라고 한다.

query에 대한 정보 - 데이터, 상태, 언제 마지막 fetch가 처리되었는지 등 메타정보 - 를 가지고 있으며,
query 함수를 실행하며 재시도, 취소, 중복제어 등 로직을 담고 있음.

또한 내부적으로 state machine을 가지고 있어, query가 불가능한 상태에 빠지는 것을 방지함. (fetch가 진행 중일 때 쿼리함수가 실행되면 deduplicate시킨다던지, query가 취소되면 이전의 상태로 복귀한다던지)

그리고 무엇보다 중요한 것 -> 특정 query를 구독하는 요소들을 기억해서 모든 변화에 대해서 해당되는 `Observer`에게 알린다.
-> useQuery를 통해서 해당 queryKey의 데이터를 사용하는 컴포넌트들에 변화를 알린다는 것으로 이해됨.

## QueryObserver

QueryCache에 저장된 Query와 해당 query를 사용하고자 하는 컴포넌트를 연결시켜주는게 `Observer`

useQuery를 호출하면 생성되며, 언제나 하나의 query에 연결되어 있다.(하나의 queryKey에 해당되는 데이터를 구독하고 있는 상태라고 보면 됨)

추가로, 최적화가 여기서 많이 구현되어 있음.

- 컴포넌트가 사용하는 query값들을 알고 있어서 관계없는 변경사항에 대해서는 알리지 않음.
- `select`옵션을 통해서 전체 data 중에서 관심있는 데이터만 선택해서 구독이 가능함.
- 대부분의 타이머 로직도 여기서 처리된다.
