// Promise.race의 활용

// Asynchronicity of Promise.race

// 항상 비동기적으로 동작한다는 점.

const resolvePromisesArray = [Promise.resolve(33), Promise.resolve(44)];

const p = Promise.race(resolvePromisesArray);

console.log(p); // pending Promise

// 최소 한 틱은 딜레이 된다.

setTimeout(() => {
  console.log("the stack is now empty");
  console.log(p); // fulfilled Promise with 33
});

// 빈 iterable이 전달되면 반환된 Promise는 영구적으로 pending상태
const foreverPendingPromise = Promise.race([]);
console.log(foreverPendingPromise);
setTimeout(() => {
  console.log("the stack is now empty");
  console.log(foreverPendingPromise);
});

// 배열에 non-promise나, 이미 settle된 promise가 존재하는 경우 그 중 첫 번째 값으로 처리된다.
const arr = [Promise.race([]), Promise.resolve(100), "i am not promise"];
const arr2 = ["i am not promise", Promise.race([]), Promise.resolve(100)];

const p1 = Promise.race(arr);
const p2 = Promise.race(arr2);

setTimeout(() => {
  console.log("stack is empty");
  // 인자로 전달된 각 배열의 첫 번째 non-promise value가 등장함.
  console.log(p1); // Promise { 100 }
  console.log(p2); // Promise { 'i am not promise' }
});

// Using Promise.race() to implement request timeout

// 오래걸릴 수 있는 요청을 처리하는 request에 대해서 time limit을 걸기 위해서 사용

const longLastingRequest = new Promise((res) => {
  setTimeout(() => {
    res("long lasting request resolved");
  }, 100000);
});
const requestTimeout = new Promise((rej) => {
  setTimeout(() => {
    rej("Request timed out");
  }, 3000);
});

const shortLastingRequest = new Promise((res) => {
  setTimeout(() => {
    res("short lasting request resolved");
  }, 2000);
});

const data = Promise.race([longLastingRequest, requestTimeout]);

data
  .then((res) => console.log(res))
  .catch((e) => console.log("data request rejected due to:", e)); // Request timed out

// timeout이 더 긴 경우를 보자
const data2 = Promise.race([shortLastingRequest, requestTimeout]);

data2.then((res) => console.log(res)).catch((e) => console.log(e)); // short lasting request resolved
