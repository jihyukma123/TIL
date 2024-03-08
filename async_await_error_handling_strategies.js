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

//----------------- 회사에서 내가 작성한 코드의 형태 -----------------

// 특정 컴포넌트를 렌더링 할 때, 해당 컴포넌트에 콜백함수를 전달해서 그 컴포넌트가 수행하는 외부 특정 처리가 완료된 이후에 해당 콜백함수가 실행되는 구조에서,
// 콜백함수에서 처리된 값을 받아서,
// 그 값을 검증하기 위해서 필요한 일련의 프로세스를 구현하는 것이 목적

// 1. 처리된 값이 유효한 값이 검증하기 위한 데이터를 얻기 위한 api를 호출하기 위해서 액세스 토큰 발급
// 2. 액세스 토큰 값으로 api를 호출해서 처리된 값을 검증하기 위한 데이터를 얻기
// 3. 데이터 교차 검증
// 4. 여기까지 일련의 과정을 처리하는 함수 `complete()`로 로직을 묶고, 처리된 값을 반환
// 5. 반환된 값이 필요한 컴포넌트에서 `complete()` 함수를 호출해서 값을 받고, 해당 값이 유효한 값인 경우 처리될 로직을 담은 handler함수 호출
// 6. handler함수는 db에 값 저장하는 함수 호출하고, db저장이 성공 시 특정 화면으로 navigate하는 함수 호출

// ---- someDataAPI.js 모듈 ----
// 이 라이브러리를 통해서 일련의 처리를 할 때 공통으로 사용될 것이라고 생각되는 함수들을 모듈로 빼서 구현
const tokenAPI = async () => {};
const dataAPI = async (data_id, accessToken) => {};

const getAccessToken = async () => {
  try {
    const result = await tokenAPI();
    // 액세스 토큰 발급 api 호출

    return result;
  } catch (error) {
    throw new Error("getAccessToken error", error);
  }
};

const getData = async (data_id, accessToken) => {
  try {
    const result = await dataAPI(data_id, accessToken);
    // 액세스 토큰 값으로 api를 호출해서 처리된 값을 검증하기 위한 데이터를 얻기

    return result;
  } catch (error) {
    throw new Error("getData error", error);
  }
};

const isDataValid = (fetchedData, validData) => {
  // 데이터 교차 검증
  return fetchedData === validData;
};

// 각 함수를 묶어서 실행하는 complete함수, 외부로 export해서 사용되는 형태
// 잘 처리되면 데이터를, 처리되지 않으면 null을 반환
export const complete = async (data_id, validData) => {
  try {
    // 데이터 조회, 각 단계에서 문제가 발생하는 경우 error throw 하도록 구현된 상태
    const accessToken = await getAccessToken();
    const fetchedData = await getData(data_id, accessToken);

    // 유효한 데이터인 경우 반환,
    if (isDataValid(fetchedData, validData)) {
      return fetchedData;
    }

    // 유효한 데이터 아닌 경우 에러 throw해서 catch block으로 이동
    throw new Error("invalid data");
  } catch (error) {
    throw new Error("complete error", error);
    return null;
  }
};

// ---- someDataAPI.js ----

// ---- SomeComponent.js ----

// someDataAPI의 complete함수를 호출해서 처리된 값을 받아서, 그 값이 유효한 값인 경우 처리될 로직을 담은 handler함수 호출하는 로직이 구현된 컴포넌트
// 처리하는 handler함수의 로직이 경우별로 다를 수 있다고 판단해서 successHandler는 모듈의 complete함수를 호출하는 컴포넌트 안에서 선언해서 사용하는 형태로 구현하였음.
const SomeComponent = () => {
  const validData = "valideDataValue";

  const saveData = async (data) => {
    // db에 값 저장하는 로직
  };

  const successHandler = async (data) => {
    // db에 값 저장하는 함수 호출
    // db저장이 성공 시 특정 화면으로 navigate하는 함수 호출
    try {
      const savedData = await saveData(data);

      if (savedData) {
        // 성공에 따라 필요한 처리,
        // 여기까지 성공하면 다 잘 처리되었음.
      } else {
        throw new Error("saveData failed");
      }
    } catch (error) {
      console.log("successHandler error", error);
      // 필요한 처리
    }
  };
  // 라이브러리 모듈에 전달하는 함수
  const callback = async (response) => {
    try {
      if (response.success === true) {
        const result = await complete(response.data_id, validData);

        if (result) {
          successHandler(result);
        } else {
          throw new Error("complete failed");
        }
      }
    } catch (error) {
      console.log("callback error", error);
      // 오류에 따른 처리
    }
  };

  return <SomeModule callback={callback} />;
};

// ---- SomeComponent.js ----
