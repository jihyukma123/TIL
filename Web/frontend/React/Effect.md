# Effect에 대해서 생각해보기.

React 공식문서의 [lifecycle of reactive events](https://18.react.dev/learn/lifecycle-of-reactive-effects) 문서를 읽다가, 이런 문장을 읽었음.

`Then React will run the Effect that you’ve provided during this render.`

useEffect 훅은 컴포넌트 렌더링이 실행된 다음에 실행된다 정도로만 생각했는데, 왜 실행순서가 그렇게 되었을까에 대해서 생각해본적이 없었음.

useEffect? component가 mount된 다음에 실행되고, return된 함수는 component가 unmount된 이후에 실행된다. 이런 식으로 생각했는데, 이 문서에서는 그런 식으로 접근하면 effect를 다루는게 생각보다 금방 복잡해진다고, avoid 하라고 대놓고 말함...ㅋㅋㅋㅋ 음... 그러면 어떻게 접근하라는걸까.

JSX를 쓰는 것과 비슷하게 생각하라고...선언적으로 사용하라는 뜻인 것 같다. 절차적으로 사고하지말고...선언적으로...

내가 JSX를 쓸 때 컴포넌트 lifecycle을 고려했었나?? 아니었던 것 같다. 그냥 상태에 따라서 표시될 UI만 그리고 나머지는 React가 알아서 했지. 선언적으로 개발을 했다 확실하게(상태에 따라서 이걸 보여줘! 하고 나는 상태만 처리하면 나머지 렌더링은 react가 알아서 잘 처리함.)

이처럼 Effect에 대해서도, 이 effect는 component가 mount된 다음에 실행되어야 하고, component가 unmount되면 clear되어야 해. 이런 식으로 생각하지말라는 것 같음.

컨셉이 선언적인데 절차적으로 사고하면 복잡해졌을 때 꼬이나? 꼭 그런지는 모르겠는데 일단 문서가 그렇다고 하니까 문서에서 추천하는 방식으로 접근을 해보는것도 필요할 것 같음.

**gpt가 정리해준 내용**

❌ 이렇게 하지 말자

- useEffect(() => { doSomething() }, []) ← mount될 때만 실행
- return () => { cleanup() } ← unmount될 때만 실행

이렇게 **시점 중심(lifecycle-centric)**으로 생각하면,
복잡한 상태 변화, 조건부 렌더링, 리렌더링, 중첩 등에서 언제 effect가 재실행되는지 헷갈리게 돼.

✅ 이렇게 생각하자

- "이 effect는 어떤 조건(상태, props 등)이 되면 시작되어야 한다"
- "그 조건이 풀리면 정리(cleanup)되어야 한다"

즉, **상태를 기준으로 동기화(synchronization)**를 생각하라는 거야.

```javascript
// JSX에 대해서 사고하는 방식
{isOpen && <Modal />} // isOpen=true일 때 Modal을 보여줘.

// effect에 대해서도 비슷하게 사고하라는 것.
useEffect(() => {
  if (!isOpen) return;

  const id = setInterval(...);
  return () => clearInterval(id);
}, [isOpen]);
// -> isOpen이면 interval 시작하고, 아니면 정리해.

```

Effect를 한 번만 실행되게 하려면 어떡하지? 같은 고민들로부터 벗어나야함 그게 아니라, "상태에 따라서 적절히 effect가 start/stop 되도록 처리하자"라는 접근방식.

선언적으로 잘 만든 Effect는 깨지지 않고 React가 알아서 잘 관리할 수 있는 effect가 된다.

# 실행되는 시점이나 뭔가 서로 좀 연관이 있어보인다는 애매한 이유로 Effect 섞지마라..

특정한 시점에 같이 실행되어야 한다는 이유로 effect를 섞지말라고 함.

하나의 effect는 하나의 독립적인 sync 프로세스를 처리해야 함.

또한, 하나의 cohesive한 로직을 code를 더 "깔끔하게" 만든다는 이유로 분리하지말라고 함. 유지보수하기 힘들어진다고... 동일한 하나의 작업을 처리하는 로직은 하나의 effect안에서 처리하는게 맞다.

# 컴포넌트 안에 있는 value는 다 reactive하다.

# Avoid relying on objects and functions as dependencies.

렌더링 과정에서 생성한 함수나 객체를 effect에서 dependency로 읽으면 render함수 실행될 때마다 다른 값으로 인식됨.

# You might not need an effect
