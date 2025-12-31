# Mastering Mutations in React Query

useMutation hook에 대해서 공부한 후 이에 대한 TkDodo의 글을 추가로 읽어보았음.

## Mutation이란?

mutation을 `functions with side effect`라고 함.

`useMutation`함수는 그래서 server 쪽에서 뭔가 사이드 이펙트를 일으키는 동작을 처리하는 도구.

## useQuery와의 차이

> useQuery is declarative, useMutation is imperative

각 함수가 추상화하고 있는 로직을 생각해보면 당연한 듯.

`useQuery` - 데이터를 불러오고, 데이터가 backend 데이터와 `in sync` 상태를 유지하도록 관리하는 로직이 추상화되어 있음. '나는 너가 화면에 진입했을 때 상태를 불러와서 관리하면 좋겠어! 어떻게는 나는 모르겠는데 내가 원하는건 몇분동안 fresh한걸로 간주하고 이후로는 stale 한걸로 간주하고 머시기머시기 등등...' 이런 느낌으로 react query 라이브러리에 관리형태를 명시하면 나머지는 알아서 하는 형태

`useMutation` - 데이터를 변경하는 로직이라서 '너가 알잘딱깔센해줘' 가 되기가 어려움. imperative하게 어느 시점에 어떤 데이터를 업데이트칠지를 개발자가 명시할 수 밖에 없다.

## Mutation 결과를 query에 반영하는 방법 2가지

**Invalidation**

이론상으로 화면을 최신 상태로 렌더링하기 위한 가장 간단한 방법이다.

내가 명시적으로 어떤 server 데이터를 업데이트한 시점은 Query되어서 저장되어 있는 cache가 더이상 유효하지 않아서 교체가 필요한 가장 정확한 시점이라고도 볼 수 있음.

**직접 업데이트**

queryClient 객체의 `setQueryData` 함수를 활용해서 직접 특정 query의 cache를 업데이트하는 것도 가능함.

어떤 시나리오에서 적절할까? 예를 들어서, Mutation의 결과로 백엔드에서 변경된 데이터를 반환하는 경우 굳이 다시 또 불러올 필요가 없겠지? 이런 경우에 onSuccess callback에서 setQueryData 함수를 호출해서 값을 수동 업데이트 치는 것이 가능하다.(이 처리는 동시에 필요한 컴포넌트를 리렌더링 함)

## Optimistic Updates

mutation 요청이 잘 처리될것이라는 가정 하에, user가 굳이 backend에 보낸 요청에 대한 응답을 기다려서 그 결과를 UI에 반영받을 필요가 있을까?

그냥 유저에게 바로 처리된 결과에 대한 UI를 보여주고(fake the success of a mutation even before it is sent to the server)

읭 아예 요청을 보내기도 전에 faking을 하는거구나. 생각해보니 그렇긴 하네. 어차피 fake할거면 가능한 가장 빠른 시점에 페이크 치는게 원하는 결과(improved UX)를 최대치로 이끌어낼 수 있을 것 같음.

성공하면? -> 기존 cache invalidate 해서 mutation반영된 데이터 저장하면 됨
실패하면? -> mutation이전 값 기준으로 UI rollback

## 몇 가지 꿀팁들

**awaited Promises**

mutation callback들(onSuccess, onError)에서 반환된 Promise는 await 된다.

중요한 부분은 return 해야된다는 점. return을 해야지 await되고 아니면 실행만 하고 완료되는 것을 기다리지 않는다.

직접 테스트해봤음.

```javascript
const mutation = useMutation({
  mutationFn: updateWeather,
  onSuccess: async (data, variables) => {
    console.log("mutation success");

    // Promise를 return하지 않으면 mutation함수가 기다리지 않고 바로 종료된다.
    new Promise((res) =>
      setTimeout(() => {
        console.log("-------Promise!!-------");
        res("resolved");
      }, 5000)
    );

    // return된 Promise는 await 된다. 언제까지? mutation의 상태가 끝날때까지.
    // mutation 이후에 어떤 로직이 완성될때까지 mutation state를 활용해서 로직을 구현할 수 있음.
    return new Promise((res) =>
      setTimeout(() => {
        console.log("-------resolved Promise!!-------");
        res("resolved");
      }, 3000)
    );
  },
});
```

onSuccess와 같은 callback함수에서 Promise를 return하면, useMutation함수가 반환하는 객체의 값 중 하나인 `status` 값이 해당 Promise가 완료될 때까지 `success`가 아니라 `pending`을 반환한다. 그리고 Promise가 완성되면 `success`로 값이 변경됨.

이를 활용해서 mutation 로직에 이어서 진행되는 로직 flow를 개발자가 control 할 수 있을 것 같음.

**Mutate or MutateAsync**

useMutation 이 반환하는 2가지 종류의 함수 mutate와 mutateAsync의 차이

mutate는 반환값이 없는 반면 mutateAsync는 mutation결과값을 담은 Promise를 반환한다.
-> mutation의 결과값이라고 하는 것은, 서버에서 mutation요청에 대해서 응답으로 전송한 값을 말한다.(client에서 전송한 값이 아닐 수 있음)

TkDodo는 거의 대부분의 경우에 mutate 함수를 쓰면 충분하고, 여러 mutation을 동시에 요청하고 모두 끝나길 기다려서 어떤 처리를 해야된다던지 하는 특정한 상황들에만 mutateAsync를 쓰는 것을 추천함

**Some callbacks might not fire**

특정 mutation의 useMutation 훅에 정의된 callback들이 항상 useMutation의 mutate함수에 등록된 callback보다 먼저 실행됨

그리고 mutate에 등록된 콜백함수는 컴포넌트가 mutation이 처리되기 전에 unmount되면 아예 실행되지 않을 수도 있음.

TkDodo는 이런 점을 고려해서 seperate concerns하기를 추천한다.

- 꼭 수행되어야 하는 로직 관련 작업 같은 것들(query invalidation)은 useMutation에 전달한 콜백함수에서 실행
- UI 관련된 작업을 mutate에 전달된 callback에서 처리(의도적으로 컴포넌트가 언마운트되면 실행되지 않음)

만약에 개발자가 useMutation 훅을 활용해서 custom hook을 만드는 경우 특히 유용하다.

query에 관련된 로직 부분을 커스텀 훅 안으로 숨겨버릴 수 있고, custom hook을 실제로 사용하는 곳에서 UI 관련된 로직을 처리하는 형태로 분리가 가능함.

여러 컴포넌트에서 동일하게 적용되어야 하는 로직을 추상화하는 계층과, 각 컴포넌트별로 별도로 처리해야되는 로직을 처리할 수 있는 함수를 둘 다 제공하는구나... 이 친구들 진짜 대단하다 근데 잘만들었어

읽어볼수록 감탄이 나오네
