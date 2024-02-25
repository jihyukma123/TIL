// // async function 에 대해 공부
// // async 함수는 항상 promise를 반환, 명시적으로 promise가 아닌 경우 암묵적으로 promise로 감싸진다.

// async function foo() {
//   return 1;
// }

// // 위 함수는 아래 함수와 동일하다.
// function foo1() {
//   return Promise.resolve(1);
// }

// console.log(foo()); // Promise { 1 }
// // return 값이 Promise로 감싸짐.

// console.log(foo1().then((r) => console.log(r))); // 1
// // Promise에 대해서 구독하는 함수를 then을 통해서 처리

// async function a() {
//   await 1;
// }

// function b() {
//   return Promise.resolve(1).then(() => undefined);
// }

// console.log(a());
// console.log(b());

// 예시를 통해 더 공부를 해보자.

function resolveAfter2Seconds() {
  console.log("starting slow promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(20);
      console.log("slow promise is done");
    }, 3000);
  });
}

function resolveAfter1Second() {
  console.log("starting fast promise");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
      console.log("fast promise is done");
    }, 1000);
  });
}

async function sequentialStart() {
  console.log("--순차적인 함수 실행--");

  // if the value of the expression follwing the await operator is not a Promise, it's converted to a resolve Promise;
  const slow = await resolveAfter2Seconds();

  const fast = await resolveAfter1Second();
  console.log(fast);
  console.log(slow);
}

async function concurrenStart() {
  console.log("--동시 함수 실행--");
  const slow = resolveAfter2Seconds();
  const fast = resolveAfter1Second();

  console.log(await slow);
  console.log(fast);
  console.log(await fast); // waits for the slow to finish, even though fast is alread done(resolve settled)
}

async function promiseAllConcurrent() {
  console.log("--Promise.all을 통한 동시 함수 실행--");
  Promise.all([resolveAfter2Seconds(), resolveAfter1Second()]).then(
    (messages) => {
      console.log(messages[0]);
      console.log(messages[1]);
    }
  );
}

async function parallelExecution() {
  resolveAfter2Seconds().then(async (r) => {
    const rr = await resolveAfter2Seconds();
    console.log(rr);
    console.log(r);
  });
  resolveAfter1Second().then((r) => console.log(r));
}
// sequentialStart(); // 2초 뒤에 slow가 완료되고 난 이후에 fast가 시작되어서 1초 뒤에 settle된다.

// concurrenStart();
// 실행 순서
// start slow
// start fase
// fast done
// slow done
// 20 //
// 10

// promiseAllConcurrent();
// concurrentStart()와 같은 결과.
// 두 promise 반환 함수가 같이 실행되고, fast가 더 빨리 마무리되지만 값 자체는 호출된 순서로 반환된다.

// parallelExecution();
// 병렬적으로 처리된다. 독립적으로 처리되는 느낌.
// 이게 왜 근데 이렇게 될까?
// then이면 기다려서 처리한 다음에 가야되는거 아니야?
// 아니지, then 1과 then 2는 다른 함수이고 다른 execution임.
// handler가 밖에 있는 것이 아니라 안에 있으니까.

// 아래 형식은 gemini가 병렬적으로 처리될 것이라고 했는데, 실제로 실행하니 순차적으로 실행됨. 당연하지 await로 각 for loop 실행 시 promise의 settle을 기다리도록 짜여있으니까.
async function a() {
  const promises = [resolveAfter2Seconds(), resolveAfter1Second()];

  for (const p of promises) {
    const result = await p;
    console.log("result!", result);
  }

  return 1;
}

console.log(a());
