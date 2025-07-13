# Async에 대해서 이해된 점..

뭔가 지금까지 async를 공부하면서 헷갈리는 점이 항상 있었는데 오늘 좀 아하 모먼트를 경험했음.

지금까지 왜 이걸 모르고 좀 헷갈려했나 싶긴 하지만...

무튼 배워나가는거지.

# 의문의 시작

파이썬 non blocking io라는 개념이 이해가 안돼서 생각을 해보다가, 내가 이해하고 있다고 생각하는 JavaScript에서의 비동기 처리와 비교해서 생각하게 되었음.

근데 JavaScript에서도 async-await 같은 문법으로 비동기적으로 처리되는 코드를 동기적으로 기다려서 실행했던 경우가 많았던거같은데, 그러면 왜 비동기라고 하지..? 라는 의문이 문득 들었는데 바로 해답이 떠오르지 않았음..

비동기처리라는 개념이, 오래걸릴 수 있는 작업 때문에 다른 작업이 막히지 않도록 한다는건데 애초에 await로 강제로 기다리게 하는게 뭐지..

# main thread를 막지 않는다는 것은..

그러다가 깨달은게, loading 애니메이션 같은게 어떻게 동작하는가에 대한 생각이었다.

어떤 비동기 요청 로직을 담고 있는 함수가 실행되었을 때, 많이 사용되는 UI가 loading spinner를 보여주는 건데, 만약에 await로 인해서 전체 로직이 다 막히면 loading spinner도 안돌아야하는데 잘 돌잖아??

여기서 생각이 이어져서 아 뭔가 요청이 전송되고 난 이후에도 loading이나, 다른 버튼을 누르는 등 해당 웹페이지에서 JavaScript코드의 동작을 요하는 interaction이 동작하는구나! 하는 생각이 들었음.

그러면서 비동기가 이해가 됐음..

특정 단위의 로직(함수인건가..?)를 잠시 다른 곳에 저장해두고, main thread는 계속 다음에 입력되는 로직들을 실행할 수 있도록 비워두는거구만!

하나의 함수 단위에서 보면 실행이 잠시 중지되는 것처럼 보이지만, 사실상 main thread에서 이 함수의 실행이 잠시 다른 곳으로 이동하는거고 그 사이에 전체 웹페이지 관점에서 보면 다양한 로직들이 실행될 수 있는 상태(main thread가 점유되어 있지 않으니까.)

# 그러면 함수 단위로 아 그 뭐지ㅏ 이름이 뭐였더라...

아맞다 이벤트 큐하고 콜스택 그런 친구들이 있었지.

# 또 좀 공부를 해보고 싶어서(for the last time please!!)

[Jake Archibald: 루프 속 - JSConf.Asia](https://www.youtube.com/watch?v=cCOL7MC4Pl0)
[어쨌든 이벤트 루프는 무엇입니까? | Philip Roberts | JSConf EU](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

영상 하나 봄 ㅎㅎ (하나 더 봄)

## Main Thread

웹 상에서 대부분의 일들이 Main Thread라는 구조 안에서 발생한다.

이 말인즉슨, 웹 상에서 일어나는 많은 일들이 deterministic order로 발생한다는 것이고, 동시에 여러 코드 부분들이 동일한 DOM 요소를 업데이트 한다던지 하는 일이 없다는 뜻이다.(race condition 문제를 걱정하지 않아도 된다는 것.)

하지만 반대로 메인 스레드에서 뭔가 오래걸리는 작업이 실행되면(이 사람이 말하는 Long time은 200ms라고 한다..!!! user interaction 측면에서는 이것도 긴 시간이라고...)

그러면 rendering/interaction과 같이 티나는 부분들의 실행이 막혀서 문제가 되지..

이런 코드를 작성하면 안되겠지??

## setTimeout..?

어떻게 동작하는가..?

일단 뭘 하는 함수인지?

setTimeout(callback, ms) method, when invoked, must run the following steps:

- wait ms milliseconds
- invoke callback

근데 이 specification은 지금 상태로는 전달된 ms만큼 main thread를 막는 형식이다.

그래서 어떤 조건이 추가되어야 하냐면..

1. Run the following steps `in parallel`:

- wait ms milliseconds
- invoke callback

여기서 `in parallel`이 의미하는 바는,

- `get off the main thread and run this stuff along with some other stuff` 같은 소리임.

근데 이 구조에서는 다른 성격의 문제가 발생한다.

병렬적으로 callback을 실행하면 동시에 여러 코드가 동일한 DOM을 업데이트 하는 것 같은 문제가 발생함.

그래서 또 한 가지 무언가가 추가되어야 함.

1. Run the following steps `in parallel`:

- wait ms milliseconds
- Queue a task to run the following steps:
  - Invoke callbacks

"queue a task"는 어떤 작업을 Task Queue에 넣어서, 나중에 Event Loop가 call stack이 비었을 때 실행되도록 예약하는 것을 의미.

이렇게 하면 이제 callback 자체는 JavaScript가 실행되는 메인 스레드에서 실행되도록 할 수 있음.

- 마우스 event가 어떻게 OS에서 JavaScript 코드 실행 영역으로 전달되는지? by queuing a task.
- fetch한 정보를 어떻게 JavaScript 코드 실행 영역에서 받아? by queuing a task.

Task를 큐잉해서 처리한다는게 핵심적인 아이디어네

그러면 이 핵심부터 봐야겠지.

## Task Queues

일단 event loop는 계속 돌아가고 있는 하나의 시스템이라고 볼 수 있음.

setTimeout -> 1000ms로 걸면,

브라우저가 event loop한테 1초 뒤에 야 이거 좀 실행해줘 하면 event loop가 오키 나 될 때 실행할게 해서 실행하는 느낌.

근데 이런 Task Queue에 있는 작업만 event loop가 처리하는게 아니라, 브라우저가 웹페이지를 렌더링하는 과정에서 수행되는 일련의 작업들 (style/layout 계산 및 pixel painting)도 수행해야됨. 그래서 두 개의 수행 작업이 있는거임.

돌아가는 원 왼쪽에는 Task Queue에 있는 작업을 필요에 따라 실행하는 축이 있고, 반대로 돌아가는 이벤트루프 우측에는 필요에 따라 render steps를 실행하도록 하는 구조가 있는 형태.

그래서 뭔가 잘못돼서 Task에서 JavaScript 코드 실행하느라 Event loop가 occupied되어잇으면(애니메이션을 상상해보면 무한히 돌아가는 원자가 어딘가에 붙잡혀있으면) 다음 사이클에 실행예정이었던 렌더링 쪽 작업들이 수행되지 않아서 렌더링도 막히고 다 막히는 것처럼 보임.

지금 보면 좌우측에 각각 Task/Render Steps가 존재하는 구조임.

## rAF

`requestAnimationFrame` 함수에 전달된 콜백은 render steps에서 실행되도록 처리된다.

이게 왜 중요해??

예를 들어서 박스를 우측으로 이동시키는 animation을 만든다고 생각해보자.

동일한 `moveBoxOnePixelToTheRight` 함수를 `rAF`를 통해서 실행하는 것과 `setTimeout(callback, 0)`으로 해서 실행하는 것이 로직상으로는 동일한 처리 방식일 것으로 보이지만, 실상은 후자가 박스가 훨씬 더 빠르게 이동한다.

이는 곧 setTimeout에 전달된 callback이 rAF보다 훨씬 더 자주 실행되고 있다는 뜻이고, this is not good.

rAF에 전달된 callback은 render steps와 함께 실행되는데, 이 때 이벤트 루프에서 실행동그라미가 render steps 쪽으로 넘어가도록 하는 주기가 setTimeout이 실행되는 주기에 비해서 느리다는 건데, 이 이유는 브라우저가 불필요한 렌더링을 할 필요가 없도록 최적화해서 실행하기 때문(최대한 효율적으로 이 작업을 실행하도록 되어있고, 뭔가 실제로 정말 업데이트를 할 필요성이 있는 경우에만 render steps 가 실행되도록 되어있음.) 예를 들어서, 탭이 백그라운드에 있는 경우 render steps를 실행하지 않는다 왜? 보이지 않는데 업데이트 해서 뭐함.

setTimeout이 rAF보다 4배 빠르게 움직인다고 하면, render steps(where rAF is executed)1회에 setTimeout이 4번 수행된다는 것이고, 이는 곧 setTimeout 4번 중 3번은 불필요한 실행이라는 뜻이다.(wasted..!)

그리고 가장 흔한 디스플레이 주사율은 60헤르츠이고, 보통 브라우저는 이 주사율에 맞춰서 화면을 업데이트 하려고 함. (60헤르츠인데 1초에 1000번 업데이트 하면 뭐하나 표시되는건 60번 뿐인데)

그 이상 렌더링 하는건 어차피 사용자가 보지 못하는 작업을 처리하는거임.

setTimeout으로 코드를 처리하면 그 낭비가 발생하는 것. 유저가 인지할 수 있는것보다 더 많은 프레임을 렌더링하고 있어서 리소스 낭비라고 볼 수 있고, this is why tasks are not a good place to execute DOM updating code

참고로 setTimeout(callback, 0)으로 호출해도 실제로는 완전히 0은 아니라고 함(그렇겠지? 이 시점에 이 사람이 테스트했을 때는 4.7ms정도였다고 함)

그리고 setTimeout을 사용하면 실행 순서 보장이 안됨.

사용자에게 유효하게 표시되는 업데이트가 1frame에 갑자기 2개가 발생할 수도 있고, 한 번도 발생하지 않을 수도 있고, rendersteps 이전/이후에 발생할 수 있고 그때그때 달라짐.

반대로 rAF는 rAF - style - layout 이런 식으로 실행순서가 보장되기 때문에 더 일관되게 동작한다.

(leads to good user experience)

## rAF를 포함한 Render Steps에 대한 이해가 필요한 경우

물론 요즘은 이런 코드 잘 안쓰긴 하지만, 그래도 기저에 있는 이정도 동작은 알고 있는게 중요하지 않나 싶다.

(알아야 하나..?ㅎㅎ.. 몰라 일단 나는 재밌어)

```javascript
// 아래 코드의 의도는, 시작점으로부터 x축 양의 방향으로 1000px위치로 이동했다가 500px위치로 돌아가는 animation
button.addEventListener("click", () => {
  box.style.transform = "translateX(1000px)";
  box.style.transition = "transform 1s ease-in-out";
  box.style.transform = "translateX(500px)";
});

// 근데 실행하면 바로 0 -> 500px로 실행됨 왜??
// 실행 순서에 대한 이해가 여기서 필요함.
// 이 코드는 Task로 처리됨.(click 이벤트 처리.) 근데 task에 전달된 callback의 실행이 끝마친 뒤에야 render steps 쪽으로 실행 흐름이 넘어가서 실행된다.
// 즉 render steps가 실행되는 시점, (style-layout..)에는 이미 transformX 값이 500px이고, 1000px에 대한 정보는 CSS 계산 시 알 길이 없음.

// 아하 그러면 rAF이용해서 실행 순서를 맞춰주면 되겠구나!

button.addEventListener("click", () => {
  box.style.transform = "translateX(1000px)";
  box.style.transition = "transform 1s ease-in-out";

  requestAnimationFrame(() => {
    box.style.transform = "translateX(500px)";
  });
});

// 근데 여전히 0 -> 500px로 동작한다 왜..?
// JavaScript 실행이 마친 시점에는 1000px로 값이 처리되었지만, 앞서 봤듯이 rAF는 css 계산 이전에 수행된다. 즉 css layout 처리되는 시점에는 이미 500px로 값이 처리되어서 계산되어서 실행됨. JS - rAF - style 계산 순으로 작업이 수행되기 때문에

// 그래서 제대로 처리하려면,

button.addEventListener("click", () => {
  box.style.transform = "translateX(1000px)";
  box.style.transition = "transform 1s ease-in-out";

  // rAF를 두 번 써야한다.
  // 그러면 최초에 한 번은 callback () => requestAnimationFrame이 실행되고 style이 계산되어서 1000px로 style 계산이 수행되었다가,
  // 다음 rAF에서 안쪽의 callback이 실행되어서 다시 500px로 저장된 상태에서 style 계산이 수행됨
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      box.style.transform = "translateX(500px)";
    });
  });
});
```

## MicroTasks

MicroTask는 Event Loop의 어느 시점에서 실행될까?

원이 돌고 있을 때, Task -> Render -> Task -> Render 뭐 이런 느낌으로 작업이 있으면 수행을 하잖아.

그러면 이 순서에 microtask는 어디에 들어가..?

정답은, 어디에서든지 발생할 수 있다임

왜? microtask queue에 존재하는 작업들은, 직전에 실행되었던 어떤 JS코드가 실행완료되면 바로 실행되도록 되어있음. 그리고 무조건 microtask queue가 빌 때까지 쌓여있는 작업부터 처리하도록 되어있음.(JS Stack이 비는 순간 바로 실행)

이 순서에 대해서는 조금 더 잘 이해할 필요가 있겠다.

Promise를 사용할 때, 실행 순서나 이런 것에 대해서 정확히 이해하는데 큰 도움이 되네.

이 부분은 좀 더 공부를 해야될 것 같음.

# 이게 뭐에 도움이 되는가??

Getting my code to run in the correct part of the event loop

중요하지 중요하지. 뭐가 좀 애매하다 안된다 싶을 때 일단 setTimeout으로 때려박으면 it kind of works but i am not sure 같은 상황을 피하는데 도움이 된다.

# heap/stack/event loop/callback queue/WebAPIs in V8

## the call stack

JS is a single threaded runtime

one thread === one call stack === one thing at a time

```javascript
function foo() {
  throw new Error("error");
}

function bar() {
  foo();
}

function baz() {
  bar();
}

baz();

// browser 상에서 foo - bar - baz로 이어지는 함수 목록을 보게 되는데 이게 바로 stack trace이고 여기서 말하는 stack 이란 call stack.
// 즉 call stack에 쌓여있는 함수를 역순으로 추적하면서 연관된 코드를 다 보여준다.
```

## 근데 진짜 하나만 할 수 있나 브라우저에서..?

web api에 있는 코드(예를 들어서 5초의 timeout이 할당된 setTimeoue의 callback 함수)는 timer가 완료되는 등 조건이 충족되면 바로 call stack에 주입되는게 아니라, task queue에 전달됨. 그리고 task queue에 있는 작업을 event loop가 stack/task queue를 확인해서 call stack이 비어있고 task queue에 작업이 있으면 그 작업을 처리함.

# JavaScript Visualized - Event Loop, Web APIs, (Micro)task Queue

[영상](https://www.youtube.com/watch?v=eiC58R16hb8)

Call Stack + Web APIs + Event Loop + Task Queue + Microtask Queue 조합을 통해서 비동기 작업을 non-blocking 방식으로 처리할 수 있음.

## long running tasks

실제 앱 개발 시 오래 걸리는 작업들을 처리하는 경우가 많음.

- network request
- anything based on user input
- timers

Call Stack에서 기다리는 처리를 하면 다른 작업이 막히겠지. 그래서 브라우저에서 Web APIs를 사용한다.

- fetch
- setTimeout
- localStorage
- indexedDB
- document
- 등등..

Web APIs는 브라우저가 제공하는 기능들을 사용할 수 있는 인터페이스임.

## Web APIs가 근데 왜 언급되는거임??

Some of the Web APIs allow us to offload the long running tasks to the browser

그리고 이런 비동기 처리를 제공하는 Web API들은 2가지 방식이 있음. Callback based/Promise Based

### Callback based

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => console.log(position),
  (error) => console.error(error)
);
```

만약에 이 코드로 인해서 browser가 유저에게 권한을 요청하는 프롬프트를 띄워도 브라우저의 실행이 막히지는 않음 왜? 이 작업은 call stack이 아니라 브라우저가 백그라운드에서 처리하는 작업이니까.

그리고 백그라운드에서 작업이 완료되면?? 바로 Call Stack으로 밀어넣지 않음 앞서 말했듯이 그렇게 처리하면 진행중인 Task에 예측이 어려운 문제를 발생시킬 수 있음.

그러면 어디로 작업을 보내서 어떻게 처리하는가?

여기서 바로 `Task Queue`랑 `Event Loop`이 등장한다.

`Task Queue`는 Web API 콜백함수와 이벤트 핸들러 함수들을 실행 가능한 시점에 실행되도록 담는 자료구조이고, `Event Loop`는 Call Stack이 비어있는지 보고 Task Queue에 있는 작업을 콜스택으로 전달해서 처리되도록 한다.

Callback 기반 Web APIs 인터페이스를 통해서 실행이 예정된 Callback 들은 비동기 작업이 완료되면 Task Queue에 전달되고, Event Loop에 의해서 Call Stack이 빈 시점에 Call Stack에 전달되어서 실행된다.

### Promise based

Promise기반 작업을 할 때는 항상 `Microtask Queue`를 가지고 작업하는 것임.

Microtask Queue는 다음 4가지 경우에만 사용됨

- then-catch-finally 에 전달되는 callback
- await 뒤에 이어지는 함수 실행
- queueMicrotask API 콜백
- new MutationObserver에 전달되는 callback

이 함수들만 마이크로태스크 큐에 전달됨

그리고 태스크큐에 있는 작업들과 마찬가지로 이벤트 루프가 보고 콜스택으로 전달되어서 처리된다고 한다.

근데 그러면, 태스크 큐에 잇는 작업이랑 마이크로태스크 큐에 있는 작업 중에서 뭐가 먼저 처리됨? 둘 다 작업이 존재한다고 쳤을 때?

마이크로태스크 큐에 있는 작업이다.

동작하는 방식이

- MiQ에 있는 작업을 다 먼저 처리함. 잇으면 일단 다 처리하고 그동안 다른 작업이 존재해도 상관없음.
- TQ에 있는 작업을 처리하다가도, 한 작업을 끝낸 다음에 MiQ에 들어온 작업들이 있으면 또 그거부터 들어와있는거 다 처리함.
- MiQ에 작업을 처리하는 속도만큼 계속 밀어넣으면? 계속 MiQ에 있는것만 처리함.

`fetch()` Web API를 예시로 보자.

fetch가 call stack에서 실행되면 이 코드 자체는 그냥 Web API를 통해서 promise object를 만드는 역할을 함

- PromiseState: pending, PromiseResult: undefined, PromiseFulfillReaction: 아직 없음
- 그리고 백그라운드 네트워크 요청을 initiate

```javascript
fetch() // 생성된 promise 객체: PromiseState: pending, PromiseResult: undefined, PromiseFulfillReaction: 아직 없음
  .then((res) => console.log(res)); // PromiseFulfillReaction: callback 함수인 res => console.log(res)
```

그리고 서버가 어떤 결과를 반환하면

- Promise 객체: PromiseState: fulfilled, PromiseResult: Response(서버가 반환한 결과)

그리고 then callback이니까 MiQ에 전달됨.

# test

```javascript
Promise.resolve().then(() => console.log(1));

setTimeout(() => console.log(2), 10);

queueMicrotask(() => {
  console.log(3);
  queueMicrotask(() => console.log(4));
});

console.log(5);
```

내 생각에는, 우선 전체 코드가 call stack에 순서대로 처리됨

1. Promise객체 생성 -> Web API에 등록, 바로 res 되니까 MiQ에 지금 log(1) 존재

2. setTimeout 실행 -> 10ms는 금방 끝나니까 거의 바로 bg에서 task queue에 log(2) 콜백 존재

3. 마이크로태스크 큐에 log 3등록하고, Log 4 등록

4. log 5 실행

그러면 microtask queue에 지금, 흠 근데 잘 모르겠다고 생각되는 부분이, promise resolve가 먼저야 아니면 queueMicrotask가 먼저야..?

일단 5로 시작해서 2로 끝나는건 알겠는데,

5 1 3 4 2

5 3 4 1 2 인지 모르겠네

5 4 3 4 2 임 왜냐하면, Promise.resolve()를 실행해서, then 함수가 실행되어서 함수가 등록되는 시점에 이미 resolve 된 상태.

그래서 바로 callback이 MiQ로 전달된다.
