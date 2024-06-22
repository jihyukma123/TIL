function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(20);
    }, 3000);
  });
}

// returns a promise to resolve with value 20 after 2 seconds

async function getPromiseResult() {
  console.log("getPromiseResult start");
  const result = await resolveAfter2Seconds();

  console.log("getPromiseResult result", result);

  // should not the return be held??
  return result;
}

function outerFunctionCallingAsyncFunction() {
  getPromiseResult();
  console.log("after result");

  // console.log("result in outerfunction"/);
}

async function foo() {
  const result1 = await new Promise((resolve) =>
    setTimeout(() => resolve("1"))
  );
  const result2 = await new Promise((resolve) =>
    setTimeout(() => resolve("2"))
  );

  console.log(result1, result2);
}

async function checkAwaitOperand() {
  const value = "value";
  // resolveAfter2Seconds함수가 반환하는 Promise에 대해서 await
  const awaitedPromiseResult = await resolveAfter2Seconds();

  // 원시값인 1에 대해서 await
  const awaitedPrimitiveResult = await (5 * 6);

  // 변수에 대해서 await
  const awaitedVariable = await value;

  console.log(awaitedPromiseResult, awaitedPrimitiveResult, awaitedVariable);
}

// checkAwaitOperand(); // 20, 1

// await연산자의 피연산자인 Promise가 reject되면 await 표현식이 위치한 함수가 error의 stack trace에 포함된다.
// 오 그런지 보자.
// Error:
// at checkAwaitError 라고 함수명이 기록되는군!
async function checkAwaitError() {
  try {
    await Promise.reject(new Error("error"));
  } catch (e) {
    console.log(e);
  }
}

// checkAwaitError();

async function getSomething() {
  const result = await resolveAfter2Seconds();
  console.log("this is not executed");
  return result;
}

const someOuterFunction = () => {
  const result = getSomething();
  console.log("result");
  console.log(result);
  result.then((value) => console.log(value));
  console.log("after getSomething");
};

someOuterFunction();
