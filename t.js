// 비동기적으로 resolve되는 promise를 반환하는 함수
function returnPromise() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res("mock api call result");
    }, 2000);
  });
}

async function tryCatchAsyncFunc() {
  try {
    const result = await returnPromise();

    console.log("tryCatchAsyncFunc안에서 처리된 결과");
    console.log(result);
    console.log("");
  } catch (error) {
    console.log(error);
  }
}

function SomeComponentMock() {
  // 컴포넌트라고 치자..
  // 컴포넌트 안에서 try catch문으로 비동기 호출을 처리하는 함수를 호출하는 상황임

  const callResult = tryCatchAsyncFunc();
  console.log("동기적으로 함수 실행한 경우");
  console.log(callResult);
}

async function SomeComponentMock2() {
  const callResult = await tryCatchAsyncFunc();

  console.log("async await로 실행 함수를 감싼 경우");
  console.log(callResult);
  console.log("");
}

SomeComponentMock();
SomeComponentMock2();
