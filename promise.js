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
  console.log(r);
});

// 로직 흐름을 이해해보자.

// Promise안에 전달되는 함수는 executor라고 한다고 한다.

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

pr3.then((r) => {
  console.log(r);
});
