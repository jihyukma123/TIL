간단한 프로젝트 만들어서 Tanstack Query를 좀 써보고 TkDodo의 글들을 이어서 읽어보고자 한다.

# 가장 기본 기능 3가지

Tanstack Query의 기본 문서를 보면 다음 3가지가 React Query의 핵심 기능이라고 소개된다.

- Queries
- Mutations
- Query Invalidation

하나하나 문서도 읽어보고 직접 써보면서 체험해보고자 한다.

## Queries

> a declarative dependency on an asynchronous source of data that is tied to a unique key.

서버에서 데이터를 불러오는 모든 Promise기반 메서드에 대해서 사용이 가능하다고 한다.(POST, GET 과 같은)

(메서드가 서버 데이터를 변경하는 경우 `Mutations`를 쓰라고 권장되어 있음)

`useQuery` 훅을 사용하면 서버로 부터 불러온 데이터에 구독할 수 있다.

`useQuery` 훅이 반환하는 `result` 객체는 frontend에서 데이터를 다루기 위해서 필요한 다양한 값들을 제공함.

- isPending
- isError
- isSuccess

문서에서는 대부분의 경우에 `isPending`, `isError` 그리고 데이터가 호출 중이거나, 에러가 발생한 경우가 아니라면 데이터가 available한 상태라고 가정하고 결과를 렌더링 해도 된다고 언급하고 있음.

**FetchStatus**

The status gives information about the data: Do we have any or not?
The fetchStatus gives information about the queryFn: Is it running or not?

fetchStatus - queryFn이 현재 어떤 상태인지(실행 여부, 네트워크 연결이 잘 되어 있는지 아닌지 여부 등등)
status - query를 통해서 얻고자 하는 데이터의 상태. client에서 데이터 잘 받았는지 못 받았는지?

## Mutation

데이터를 가져와서 클라이언트에서 활용하는데 필요한 functionality를 제공하는 Query와 다르게, mutation은 데이터를 `create/update/delete`하거나, server side-effect를 실행하기 위해서 사용됨.

이를 위해서 `useMutation` 훅을 사용한다. (useQuery로 다 처리하지 않고 useMutation이라는 훅으로 별도의 추상화를 해서 구분짓는 이유가 있으려나?)

이유에 대해서 혼자서 생각을 해보자.

설명만 들어봐서는 구분되는 부분이 기능적인 부분이다.

- useQuery: server state를 불러와서 client에서 사용하기 위해서 사용하는 hook
- useMutation: server state를 업데이트 하는 로직을 처리하기 위한 hook

useQuery를 사용해서 serverState를 업데이트 하려면 근데 사실 방법이 없네. 뭔가 declarative하게 사용할 방법이 떠오르지 않기는 하네.

오히려 update하는 경우에는 useQuery hook을 사용하지 않고 명시적으로 각 함수를 호출해서 로직을 작성하게 될 것 같음.
생각해볼법한 케이스는 근데 이런 것 같음.

단순히 server에 저장된 데이터를 업데이트만 하면 상관이 없는데, 그 업데이트된 값이 client에도 반영이 되어야 한다면?
해당 값은 아마 useQuery로 관리되고 있을텐데, 이러면 해당 데이터에 대한 cache값을 같이 업데이트 하는 처리가 필요하다. (그리고 해당 query를 구독하는 컴포넌트들에서 해당 데이터를 가지고 렌더링 되는 ui 도 같이 업데이트 되어야 한다)
이런 처리는 그러면 어떻게 할 수 있을까? 같은 생각으로 이어지는데, 아마 useMutation을 활용하면 이런 문제들을 graceful하게 해결할 수 있지 않을까 하는 추측..

`useMutation` hook을 사용해서 mutationFn값이 값을 처리하는 로직을 호출하는 함수를 넣어주면 된다.

사용하면 이런 장점이 있다고 한다.

- error/loading state 제공
- 제공되는 onSuccess/onError 등 callback 함수들을 사용해서 업데이트한 상태의 query를 invalidate해서 UI에 반영
- mutation이 끝나기 전에 먼저 기존 데이터에 업데이트 된 데이터를 반영해서 UI를 빠르게 업데이트 하는 optimistic update를 쉽게 적용할 수 있음.

실제로 더 써보면서 느껴보자.

써보니까 확실히 편하긴 진짜 편하다.

내가 느끼는 장점은 일단

- data 처리함수를 간략하게 작성할 수 있음. mutateFn으로 넘기기만 하면 되어서 axios 호출 함수를 반환하기만 하면 된다.
- crud를 mutation.mutate(data) 와 같이 일관된 인터페이스로 실행할 수 있음(장점만 있나 싶긴하지만 일단 장점이라고 생각되는 부분은 개발자의 cognitive load가 줄어든다는 점)
- 전체적으로 직접 작성할 코드가 줄어들고, onSuccess같은 도구를 활용해서 커스텀 로직을 작성하는게 굉장히 용이하게 느껴짐.

```javascript
// 함수를 되게 간단하게 작성할 수 있다.
function updateData(data) {
  return axios.post("url", data);
}
```

그리고 또 느낀 점은, 라이브러리가 전체적으로 되게 생각을 많이 하고 만들어진 라이브러리라는 느낌?

onSuccess callback에서 mutateFn에 parameter로 전달된 객체를 참조할 수 있는지 궁금했는데, onSuccess함수의 두번째 parameter로 전달된다고 한다. 개발자가 필요한 다양한 상황들에 대해서 고려해서 만들어진 라이브러리라는 느낌을 받았음.

## Query Invalidation

`invalidateQueries` 함수가 제공됨

이 함수에 queryKey를 명시해서 특정 query를 invalidate하면 2가지 작업이 수행된다.

1. stale 상태로 전환되며 overrides any staleTime being applied
2. query 가 useQuery관련 hook으로 렌더링에 사용되고 있다면 background에서 refetch됨

실제로 query가 화면에 렌더링 되어 있는 상태에서, 해당 query를 invalidate시키니까 state가 바로 업데이트 되었다.
그리고 바로 queryFn 이 실행되어서 query에 저장되어있는 cache값이 업데이트 되었음. 그리고 이 값 변화가 UI에도 반영이 되었다.

오호..
