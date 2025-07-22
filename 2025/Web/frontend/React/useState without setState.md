# useState를 setState없이 선언해서 사용하는 케이스.

회사에서 과제를 내고 받은 피드백 중 하나가, setState 함수를 쓰지 않으면 굳이 선언할 필요가 없다는 것.

```javascript
// 가장 기본적인 문법
const [state, setState] = useState(defaultValue);

// 만약에 setState를 사용하지 않는다면, 굳이 destructure 하지 않아도 됨
const [state] = useState(defaultValue);
```

오케이 여기까지는 이해했음.

# 근데 이렇게 사용할 이유나 상황이 있나?

내 생각은, 애초에 state를 사용하는 이유가 값이 변경되는 것을 react에서 캐치해서 필요한 업데이트 처리를 하기 위함인데, 굳이 state를 setState없이 선언해서 쓸만한 상황들이 있는지 궁금했음.

문득 근래에 react-query를 공부하면서 읽었던 tkdodo의 블로그 글들 중에서 이런 내용이 있지 않았나 하는 생각이 들어서 찾아보았다.

다음 글 [useState for one time initializations](https://tkdodo.eu/blog/use-state-for-one-time-initializations)에서 다음과 같이 설명함.

프로덕트 개발하다보면 보통 특정 리소스를 한 번만 초기화해서 앱의 lifecycle 동안 재사용하고 싶은 상황들이 생김

보통 이런 경우에 애초에 컴포넌트 밖에 모듈 최상위에서 인스턴스 생성 함수를 호출해서 변수에 할당하고 이 변수를 공유해서 사용하는 형식으로 처리한다. (이 변수에 값을 할당하는 함수는 해당 번들이 평가되는 시점에 딱 한 번만 실행되고, 이후에는 생성된 값이 재사용되는 것이 보장된다. `Truly Stable`한 상태임이 보장됨)

근데 앱 전체에서 하나의 리소스를 공유하는게 아니라, 컴포넌트가 mount 될 때마다 각 컴포넌트 인스턴스가 렌더링 라이프사이클 동안 각각 하나의 리소스를 만들어서 사용해야 된다면..? 그리고 컴포넌트가 리렌더링되더라도 해당 리소스 생성을 위한 함수는 재실행되지 않도록 막고 싶다면(여기서 내가 이해한 목표는, 특정 리소스 인스턴스 생성이 expensive한 computation이어서 한 번만 수행하고 재사용하고 싶은 것이라고 이해함) 어떻게 해야됨??

useMemo를 쓰는 경우들이 더러 있는데, React는 useMemo를 통해 memoize된 값을 'forget'하고 다음 렌더링 시 재계산 할 수도 있따고 한다. (ex. to free memory for offscreen components) + useMemo없이도 코드가 동작하도록 먼저 작성한 다음에, 퍼포먼스 최적화가 정말 필요하다고 판단될 때 그런 용도로만 useMemo를 사용하라고 공식문서에서 권장한다. (근데 그러면 궁금한게, 이런 경우가 애초에 그렇게 퍼포먼스 최적화가 필요한 상황이라서 기존에 매번 init 하는 구조에서 useMemo를 쓰는 형태로 변경한게 아닌가?? 그러면 근데 이런 퍼포먼스 최적화가 굳이 useState를 쓰지 않고 useMemo를 써야하는 상황이 언제 존재하는거야? useMemo를 사용하는 의도 자체가 어떻게 보면 tkdodo가 useState와 lazy init을 활용한 최적화를 통해 달성하고자 하는 목표와 이어지는 것 같은데....그러면 useMemo는 언제 써야하는가 라는 의문이 좀 드네.. )

무튼 그래서 이 사람이 달성하고 하는 목표(컴포넌트의 life cycle동안 리렌더링이 발생해도 절대 재계산이 발생하지 않도록 하고싶다.)를 처리하기 위해서 제안하는 방법이

`usState + lazy initializer` 조합이다.

이 방식을 사용하면 한 번만 초기화 되는 것이 `보장`되도록 코드 작성할 수 있음.

useRef도 동일하게 할 수 있지 않느냐..???

일단 lazy init이 없어서,

```javascript
if (!ref.current) init();
```

이런 식으로 별도로 코드를 더 verbose하게 써야하는데 그 이유를 모르겠다고 함.(이거에 대해서는 내 의견이 좀 다르긴한데..)

코드의 의도전달이 더 명확하게 대체적으로 잘 이해되는 방식은 결국 useRef쪽이 아닐까..?

**고정된 로직으로 update되는 state가 있다면 useReducer를 이용해서 더 깔끔하게 처리가 가능**

```javascript
// 대표적인 예시가 toggle
// toggling의 setState함수는 state => !state 로만 동작함.
```

**useState를 아무 값도 없이 초기화하면 typescript는 자동으로 지정된 값 or undefined로 typing 되어있다고 인식한다.**
