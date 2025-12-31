# [JavaScript Execution Model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

## The engine and the host

JavaScript 실행을 위해서는 엔진과 host 환경 2가지 소프트웨어가 필요함.

엔진 - JavaScript 코드를 파싱하고 실행하는 역할

호스트 환경 - JavaScript 코드 실행 결과를 세상에 보여주기 위해서 필요한 기능을 제공하는 주체. 예를 들어서 웹브라우저 환경에서 JavaScript 실행 결과를 표시하는데 필요한 호스트 환경은 HTML DOM. 서버에서 JavaScript 실행 결과를 활용할 수 있게 해주는 환경이 Node.js. 예를 들어서 웹브라우저는 웹페이지를 제어하기 위한 수단을 제공하고, Node.js는 서버 사이드 기능을 제공함 정도로 이해할 수 있음.

호스트 -> JavaScript가 돌아가는 플랫폼(브라우저일수도 있고, 웹서버일수도 있고, 심지어 커피 머신일수도 있다고 함ㅋㅋ) 플랫폼은 각각 특정한 기능들을 제공하는데 이를 JavaScript 명세에서는 host environment 라고 칭함.

## Agent execution model

독립적인 JS 실행 주체를 `agent`라고 부르는구나 처음 알았네.

agent는 각각 코드 실행을 위해 필요한 고유한 환경과 자원을 가지고 있다고 함.

- Heap(of objects): 사전에 정해진 패턴으로 사용되지 않는 메모리를 의미함. 프로그램 실행 중에 생성된 객체들로 채워짐. 참고로 `SharedArrayBuffer`라는 메모리 공유 메커니즘이 존재한다고 함.
- Queue(of jobs): 싱글스레드임에도 비동기 처리가 가능하게 해주는 event loop을 말하는거임. 일반적으로 FIFO방식으로 동작하기 때문에 큐라고 부르는 것.
- Stack(of execution contexts): `call stack`이라고 함 보통. 함수와 같은 실행 컨텍스트에 진입하고 나오는 방식으로 제어흐름을 관리.

다른 종류의 데이터를 다루기 위한 서로 다른 `자료구조`라고 함.(참고로 자료구조 힙이랑, 메모리 힙은 다른 개념임. 메모리 힙은 동적 메모리 할당 영역을 의미함.)

agent는 스레드 같은거라고 생각하면 됨(물론 실제로 os 스레드를 사용할지는 실제 구현에 달려있음)

## Realms

하나의 Agent는 다수의 realm을 가질 수 있음.

JavaScript 코드 조각은 load되는 시점의 realm과 연결되어 있고, 이는 다른 realm에서 호출해도 바뀌지 않음.
(load된다는게 어떤 의미인지 이해가 되지 않아서 gemini에게 물어봤음. 내가 이해한 load는 실행될 수 있도록 메모리에 적재하는걸 의미하나 라고 이해했는데, 단순히 파일을 메모리에 올리는것을 넘어서 JavaScript 엔진이 코드를 실행할 수 있도록 준비하는 일련의 과정을 의미한다고 함. 소스코드를 읽어와서 AST라고 하는 추상 구문 트리로 변환하는 parsing단계와, 코드가 실행될 환경인 Realm Record와 연결하는 단계로 구성. Realm Record에는 해당 코드에서 사용할 모든 전역 객체 및 내장 객체와 고유한 인스턴스 정보가 포함되어 있다고 함.)

코드가 load될 때 Realm과 연결된다는 것은 코드가 실행 가능한 형태로 메모리에 준비되는 순간 어떤 환경(Realm)의 자원을 사용할지가 binding된다는 의미임.

함수(실행 컨텍스트)가 생성될 때 자신을 둘러싼 Realm을 내부 슬롯 `[[Realm]]`에 저장함.([ECMAScript 명세..](https://tc39.es/ecma262/#sec-ordinaryfunctioncreate))

생성된 시점의 환경이 불변하도록 구현된 이유는

- 코드의 무결성 및 예측 가능성 유지: 예를 들어, 어떤 웹페이지 내의 iframe에서 기존 웹페이지 함수 f를 호출하면, f 내에서 new Array() 호출 시 사용되는 Array 생성자는 iframe의 생성자가 아니라 웹페이지 환경의 생성자임. 실행되는 환경에 따라 달라지는게 아니기 때문에 일관된 동작을 가져갈 것이라고 기대할 수 있음.

iframe이나 Web Worker와 같은 다중 Realm 환경에서 코드의 안정적인 실행을 보장하기 위한 메커니즘임.

아하 그래서 Realm이 다음 요소들로 구성되어있다고 설명하는구나

- 내장 객체 목록
- 전역에 선언된 변수, 전역 객체
- tagged template literal 관련해서 무슨 캐시라고 하는데 이해 잘 못했음..ㅠ

Array.isArray() 와 같은 메서드가 Realm 개념때문에 필요한거임.

특정 데이터가 베열인지 구분하기 위해서 `instanceof Array`를 사용하면, 해당 데이터가 연결되어 있는 Realm이 Array의 Realm과 일치하지 않으면 코드에서 원했던 의도(Realm 상관없이 배열여부 파악)과 다르게 false를 반환할 수 있음.

## Stack and execution contexts

동기적인 코드 실행에 대해서 생각해보면,

하나의 작업이 처리되기 위해서는 해당 작업을 처리하는 함수가 실행되어야 함.

각 함수는 자신의 변수 같은 데이터와, 어디로 처리된 결과를 반환해야하는지 알고 있어야 하는데, 이 함수들의 실행 순서와 가지고 있는 데이터를 관리하기 위해서 Agent는 작업과 해당 작업에 연관된 정보를 가지고 있는 execution context 목록을 관리하기 위한 방법이 필요함 -> Stack에 저장한다.

execution context는 가장 작은 실행 단위이며 다음 정보를 tracking하는데 사용됨

- 코드 평가 상황
- 이 코드를 가지고 있는 상위 그 무언가(모듈이건 스크립트건 함수건 등등)
- 현재 realm
- Binding 정보(선언된 변수나 this 참조 등)

## Generators and reentry

stack frame(실행 컨텍스트)가 return되어서 pop되면 무조건 끝난걸까?

아니다. 왜냐하면 다시 돌아가서 해당 로직을 처리해야될 수 있거든.

Generator가 대표적인 예시임.

실행 흐름을 다른 context에 양보한 후에 필요할 때 해당 실행 컨텍스트 정보를 가지고 있다가 다시 Stack에 밀어넣고, 또 pop되고 하면서 동일한 실행 컨텍스트가 계속 업데이트 되면서 재사용되는 것도 가능함.

## Tail Calls

다른 함수를 호출하는 함수(caller)가 호출한 함수값을 바로 반환하는 것을 tail call이라고 함.

```javascript
function f() {
  return g();
}
```

g의 호출자인 f가 g()의 호출결과를 바로 반환하고 있으므로 g에 대한 호출이 tail call임.

이런 경우에 엔진은 현재 실행 컨텍스트를 버리고 tail call에 대한 컨텍스트로 대체하도록 되어있다고 함.

그래서 tail recursion이 stack 사이즈 초과 에러를 발생시키지 않음.

다시 호출될 때마다 stack에 쌓이는게 아니라 frame을 replace하니까 하나로 유지되는거지.

문제는 이렇게 하면 디버깅 문제가 생김(g()호출이 에러 발생 시 이미 f()는 g()의 실행컨텍스트로 대체되어버려서 stack trace에 보이지 않기 때문에 어디서 g()를 호출해서 어디서 문제가 생긴건지 추적이 어렵게 만든다.)

지금 기준 문서에서는 Safari(JavaScriptCore)만 PTC를 적용했다고 함.

## Closures

함수가 생성될 때, 현재 실행되고 있는 실행 컨텍스트의 variable binding을 저장함.

그러면 이 변수에 대한 참조는 실행 컨텍스트를 outlive 할 수 있음.

outlive 한다는게 무슨 의미일까?

함수가 콜스택에서 pop된 이후에도, 해당 변수값이 메모리에 저장되어서 유지된다는 것.

```javascript
let f;

// {} block으로 실행 컨텍스트 생성
{
  let x = 10;
  f = () => x; // 함수 생성 시점에 {} 블록 컨텍스트의 변수 binding에 대한 데이터를 저장함(x = 10)
}
// block scope execution context가 종료되었음에도 함수실행 시 해당 변수값에 접근이 가능함.
// x는 일반적으로는 지역변수니까 블록 pop된 이후에 메모리에서 해제되어야 함
// 하지만, 클로저를 통해서 x를 참조하는 함수 f가 존재하기 때문에 JavaScript 엔진의 가비지 컬렉터는 이 값을 메모리에서 해제하지 않고 유지함.
// f입장에서는 외부 렉시컬 환경의 변수 바인딩(x)를 기억하고 있기 대문에 해당 값에 접근해서 변환하는게 가능함.
console.log(f()); // logs 10
```

## Job queue and event loop

he nature of JavaScript as a web scripting language requires it to be never blocking.

이 부분에서 이해가 안되는 내용 2가지에 대해서 찾아봤음.

- 스크립팅 언어라는게 뭘까? -> 독자적인 프로그램을 작성하기 위한 언어라기 보다는 호스트 환경(웹브라우저) 내에서 동작하며 그 환경의 기능을 활용하고 제어하는 역할을 수행하기 위한 언어. JavaScript는 웹브라우저라는 호스트 환경 내에서 HTML요소를 조작하고 사용자 이벤트를 처리하는 스크립트 역할 수행. Python은 운영체제에서 반복 작업을 자동화하는 데 스크립트로 사용
- 웹 스크립팅 언어 이해했어 오케이. 별도로 프로그램을 만들고자 하는 언어라기보다는 웹환경에서 환경에서 요구되는 작업을 처리하기 위한 언어다 이거잖아. '근데 웹 스크립팅 언어이다. 그러므로 블로킹이 되지 않는게 필요했다' 이 논리가 이해가 안됨 -> JavaScript가 웹 스크립팅 언어라는건, 웹에서 HTML(UI)를 조작하고 사용자 interaction을 처리하는 부분을 담당함. 블로킹이 발생하면 UI가 unresponsive할텐데, 이러면 바로 사용자 입력에 반응이 안됨. -> UX에 직접적인 악영향이 발생함. 그래서 긴 작업이 있어서 UI조작이 멈추지 않는 논블로킹 방식이 필수적이다.

근데 왜 JavaScript는 싱글스레드임? 왜 그렇게 설계했을까 궁금해서 좀 찾아봤는데 이거다 하는 정답은 없는 것 같음.

근데 웹 페이지 상호작용을 위해서 설계되었는데, SSOT인 DOM을 여러 스레드에서 동시에 변경하면 동기화/race condition같은 병렬처리 관련 문제가 발생할 수 있어서 단일 스레드 모델이 안정적으로 관리하기 좋았다는 말이 신빙성이 있어보임.(복잡한 멀티스레드 동기화를 피하기 위해서.)

microtask가 task보다 더 빠르게 처리된다고 함(아마 이것도 비동기랑 관련이 있었던 것 같은데 이 부분은 나중에 다시..)

무튼 job queue에 있는 작업들이 순서대로 stack이 비었을대마다 가져와져서 실행됨

## Run-to-completion

한 번 시작된 job은 완전히 끝날 때까지 실행됨(다른 작업에 의해서 멈추거나 선점되지 않음)

이러한 실행 방식의 단점은 너무 오래걸리는 작업이 걸리면 브라우저가 멈춘 것처럼 보임(멈춤)

Good practice is to make job processing short, and if long job exists cut it down into several jobs.

## Never blocking

event loop은 JavaScript 실행이 절대 blocking하지 않는다는 보장됨.

JavaScript의 장점

레거시 기능들에는 블로킹으로 동작하는 코드(alert, 동기적 XHR등)가 있으므로 잘 알고 쓰는게 필요하다.

## Agent clusters and memory sharing

메모리를 공유하며 소통하는 여러 Agent들의 모음을 `agent cluster`라고 함.

메모리를 공유해야지만 동일한 클러스터 안에 있는 에이전트인 것.

두 에이전트 클러스터들끼리는 정보를 교환할 메커니즘이 없기 때문에 아예 독립적인 실행 모델이라고 생각하면 됨.

## Cross-agent communication and memory model

`postMessage()` 메서드를 통해서 메모리 공유가 가능하다고 함

`SharedArrayBuffer` 같은 개념들을 차후에 공부할 필요가 있을 듯.

## Concurrency and ensuring forward progress

여러 Agent를 사용해서 로직을 구현하면 never-blocking이 보장되지 않을 수 있음.

그렇기때문에 blocking될 수 있는 상황에 대해서 제약이 있어야 함.
