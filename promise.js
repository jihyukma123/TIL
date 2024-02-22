const resolve = () => {
  setTimeout(() => {
    return "promise resolve value";
  }, 1000);
};
const reject = () => {};

const pr = new Promise(resolve, reject);

// 위 형태에서 resolve된 값을 console에 찍으려면 어떻게 해야될까?

// 이렇게는 안되네..어떻게 해야될까?
pr.then((r) => console.log(r)).catch((err) => console.log(err));

// then 메서드는 successCallback 과 failureCallback을 받도록 되어 있다.
const onPrSuccess = (result) => {
  console.log(result);
};

const onPrFailure = (err) => {
  console.log(err);
};

// 이렇게 해도 아무것도 콘솔에 찍히지 않는다.
pr.then(onPrSuccess, onPrFailure);

// 애초에 Promise 객체를 생성하는 로직이 잘못되었을수도?

// 맞다, Promise는 function을 받도록 되어있다.

const pr2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve("promise result"), 1000);
});

// 성공!!
pr2.then((r) => {
  // console.log(r);
});

// 로직 흐름을 이해해보자.

// Promise안에 전달되는 함수는 executor라고 한다고 한다.

// when new Promise is created, the executor runs automatically.
// resolve reject are callbacks provided by JavaScript itself.
// 우리가 작성하는 코드는 executer 함수 내의 로직이다.
// 원하는 결과가 resolve함수에 전달된 값으로 잘 처리되었을 때
// 잘 안되면 reject(error) error는 에러객체
// executor는 promise의 state property를 pending 에서 처리결과에 따라 fulfilled or rejected상태로 변경한다.
// promise property state, initially has the value pending, is changed to "fulfilled" when resolve is called or to "rejected" when reject is called
// promise property result, initially undefined, changes to value when resolve(value) is called or to error when reject(error) is called

// 참고로 property state 와 result 는 internal 이다. 즉 이름으로 바로 접근할 수 없다. 지정된 메서드를 토대로 값에 접근해야 함

// a promise that is either fulfilled or rejected is called "settled"

// executor함수가 실행되면 오직 하나의 결과나 에러만 반환되는 것이 컨셉이다.
// 그렇기 때문에 resolve, reject함수는 각각 하나의 인자만 받을 것을 기대하고, 나머지 인자들은 무시된다.

function executor(resolve, reject) {
  setTimeout(() => {
    resolve(
      "executor takes resolve and reject callbacks and on success returns the value by passing it to the resolve callback"
    );
  }, 1000);
}

// pr2 는 resolve 에 1초 뒤에
const pr3 = new Promise(executor);

// pr3.then((r) => {
//   console.log(r);
// });

// Cosumers: then catch

// 프로미스 객체는 executor(실제 결과를 도출하는 함수)와 결과를 받아서 사용하는 함수를 연결하는 역할을 한다.
// 결과를 받아서 사용하는 함수는 then 와 catch 메서드를 통해서 결과에 subscribe할 수 있다.

// 가장 중요한 메서드는 뭐니뭐니해도 then 이다.

// then 에 전달되는 첫 번째 인자는 promise가 resolve되었을 때 실행될 함수이다.
// then 에 전달되는 두 번째 인자는 promise가 reject되었을 때 실행될 함수이다.
// then에서 promise resolve에 대해서만 구독하고 싶으면 함수를 하나만 전달하면 된다.

// pr3.then(
//   function (result) {
//     // handle promise success here
//     console.log(result);
//   },
//   function (error) {
//     // when the promise is rejected, this second function is called
//     console.log(error);
//   }
// );

// ----- catch -----
// catch는 에러만 다루고자 할 때 사용할 수 있는 메서드.
// then 함수에 첫 번째 인자에 null을 전달하고, 두 번째 인자에 함수를 전달해서 에러를 handling하는것과 같은 기능을 한다.
// 그냥 더 명확하게 error를 catch한다는 점을 드러내기 위해서 추가된듯?

//----- finally -----

// try...catch...finally 가 있듯이 promiseObject.then().catch().finally() 가 존재한다.
// finally는 try catch가 있으면 무조건, 무조건 실행되는 조건이었는데 이 친구는 어떨까?
// finally(f)는 사실상 then(f, f)와 promise가 settle되면(resolve 건 reject건) f가 항상 실행된다는 점에서 동일하다.
// finally에 반영된 컨셉은, 이전의 실행이 완료된 이후에 어떤 cleanup/finalizing 로직을 실행할 수 있는 handler를 제공하는 것이다.
// ex) 로딩 상태 종료, 더이상 필요없는 연결 종료 등등

// finally는 인자를 받지 않는다. promise가 resolve되건 reject되건 관계없이 finally는 그런거 모르고 관심도 없어!
// 그냥 일반적인 마무리 작업을 수행할 뿐이야 .

// 그리고 finally는 promise객체가 settle된 결과를 (res or rej) 그대로 통과시켜서 다음 메서드에 넘겨준다.
// 그래서 finally 에 then 이나 catch 를 체이닝해서 해당 결과를 구독하는 함수를 등록해서 작업을 이어나가는 것도 가능하다.

// pr3
//   .finally(() => {
//     console.log("마무리!");
//     // 눈에 보이지는 않지만 다음 then으로 resolve결과를 '통과'시켜줌
//   })
//   .then((r) => {
//     console.log(r);
//   });

// finally는 아무것도 return하지 않아야 한다. return 문으로 명시적으로 값을 return해도 implicit하게 ignore 됨

// 유일한 예외는 finally handler에서 에러를 throw하는 경우이다.
// 이 경우 promise의 rej가 아니라 해당 에러가 다음 handler로 전달된다.

// pr3
//   .finally(() => {
//     throw new Error("EROROROROROORORORO!!!!!!!");
//   })
//   .then((r) => {
//     console.log(r); // resolve된 결과가 들어오지 않고
//   })
//   .catch((err) => {
//     console.log(err); // catch 메서드의 에러 구독 함수가 실행된다.
//   });

// ------ practical example ------

// re-resolve a promise?

// 어떻게 이미 resolve 된 promise를 다시 resolve하는 경우 어떻게 되는가?

let testPr = new Promise(function (res, rej) {
  res(1);

  setTimeout(() => {
    res(2);
  }, 1000);
});

testPr
  .then((r) => console.log(r))
  .finally(() => {
    console.log("finall");
  });

// 일단 생각을 해보자.

// res(1)은 바로 실행될 것이다.
// res(2)는 실행이 되어도, 구독하고 있는 함수가 없기 때문에 그냥 아무일도 안 일어나지 않을까?

// 다만 setTimeout이 걸려있긴 하므로 실행자체는 된다 res(2) but has no subscribers

// -> 결과:  얼추 맞았다.
// 1만 찍힌다 왜냐하면 resolve에 대한 추가 호출은 무시된다. 오직 resolve, reject에 대한 첫 번째 호출만 처리되기 때문이다.
// 추가적인 res, rej 함수 호출은 무시된다.

// 문제2: ms 뒤에 resolve되는 promise를 return 하는 함수를 만들어라.
// resolve가 ms뒤에 실행되도록 하면 된다ㅓ.

function delay(ms) {
  // promise에는 res, rej를 인자로 가지는 콜백함수 전달
  // return new Promise((res, rej) => {
  //   setTimeout(() => {
  //     res(`resolved after ${ms}ms`);
  //   }, ms);
  // });
  // 위가 내 답, 아래가 문서 답..
  // 내가 놓친 부분이 또 있고만.
  // 어차피 res는 그냥 필요없고, 실행만 되면 되니까 굳이 함수를 한 단계 더 wrapping할 필요가 없었다.
  // 그리고 rej도 안쓰니까 굳이 필요없고.
  // 근데 return setTimeout 이랑 그냥 setTimeout을 실행하는거랑 무슨 차이지
  return new Promise((res) => setTimeout(res, ms));
}

delay(3000).then((res) => console.log(res));
