// 5 Async + Await Error Handling Strategies 유튭 영상 코드 따라치면서 공부해보기.

async function getCheese(shouldError = false) {
  // after 1 second, return an array of cheese or Reject with an error
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        return reject("Cheese sucks");
      }
      resolve(["cheddar", "brie", "gouda"]);
    }, 1); // async 행동만 mock하고 빨리 실행되도록 1밀리초로 설정
  });
}

// 클라이언트 사이드에서 비동기 호출을 await 키워드로 기다려서 데이터를 받아서 처리하거나, 뭔가 잘못된 경우 그에 따라서 처리하는 케이스를 의미하는 함수
async function handler(request) {
  // get the async data
  const cheese = await getCheese();

  if ("error??") {
    return new Response(`Error from getCheese`, { status: 500 });
  }

  return new Response(data, { status: 200 });
}

// method1. .then().catch()
getCheese()
  .then((cheeses) => {
    console.log(cheeses);
  })
  .catch((err) => console.log(err));

// method2. try/catch
try {
  const cheese = await getCheese();
  console.log(cheese);
} catch (err) {
  console.log(err);
}

// method3. mix n match - .catch();
const myCheese = await getCheese().catch((err) => console.log(err));

// method4. bring it to a single level

async function asyncWrap(promise) {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (err) {
    return [undefined, err];
  }
}

const [cheeseData, cheeseError2] = await asyncWrap(getCheese());

// 그 다음에 처리된 데이터로 흐름 제어
if (cheeseError2) {
  console.log(cheeseError2);
  return new Response(`Error from getCheese`, { status: 500 });
}
// keep going

// one more

// allSettled를 활용하는 방법이다.
const results = await Promise.allSettled([getCheese(), getCheese(true)]);
// allSettled는 모든 프로미스가 성공하든 실패하든 상관없이 모든 프로미스가 처리될 때까지 기다린다.
// 그리고 각 프로미스에 대한 결과를 담은 객체를 반환한다.

// 이를 활용한 방법
// method4-1. non-async
// returns a value if resolved, or a reason if rejected
// value if good, reason if bad
function wrapIt(promise) {
  return Promise.allSettled([promise]).then(function ([{ value, reason }]) {
    return [value, reason];
  });
}

// actual usage
const [cheeseData2, cheeseError3] = await wrapIt(getCheese()); // [['cheddar', 'brie', 'gouda'], undefined]
const [cheeseData3, cheeseError4] = await wrapIt(getCheese(true)); // [undefined, 'Cheese sucks']

// wow!!! returns data and undefined

// some people prefer returning a "Result" type
function wrapItObject(promise) {
  return Promise.allSettled([promise]).then(function ([{ value, reason }]) {
    return { data: value, error: reason };
  });
}

// then get a result object
const result = await wrapItObject(getCheese());
if (result.error) {
  console.log(result.error);
  return new Response(`Error from getCheese`, { status: 500 });
}
console.log(result.data);
