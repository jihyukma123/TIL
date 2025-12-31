# undefined와 null

## undefined

undefined -> JavaScript 엔진이 자동으로 부여하는 케이스들이 존재함.

언제? 사용자가 어떤 값을 지정할 것이라고 예상되는 상황에 그렇지 않은 경우 undefined를 반환함.

- 값을 할당하지 않은 변수에 접근할 때(코어 자바스크립트 책에서 정의한 '변수 영역'은 잡혀있는데, 변수 영역에 저장할 '데이터 영역'이 잡히지 않아서 주소값이 없을 때. 식별자에 연결된 메모리 공간은 잡혀있는데 해당 메모리 공간에 저장할 값의 메모리 공간이 아직 없는 상태)
- 객체 내부의 없는 프로퍼티에 접근하려고 할 때
- return 문이 없거나 호출되지 않는 함수의 실행 결과(return이 호출될 수 없는 함수겠군)

배열은 좀 특이한 점이 있는데, 아래 코드를 보자

```javascript
const arr = [];

arr.length = 3;

console.log(arr); // [ <3 empty items> ]

const arr2 = new Array(3);

console.log(arr2); // [ <3 empty items> ]
```

undefined도 아니고 empty라고 뜨네?? 이건 처음 알았넹 ㅋㅋㅋ

`비어있는 요소`는 undefined하고 다름.

비어 있는 요소는 순회의 대상도 되지 않는다.

```javascript
const arr = [];

arr.length = 3;

console.log(arr); // [ <3 empty items> ]
arr[2] = 1;

arr.forEach((el) => {
  console.log(el);
}); // 1만 순회됨
```

신기하네!!

이런 경우도 있다 정도 알고 가면 될 것 같음.(배열을 초기화하면 바로 undefined가 각 인덱스 자리에 할당되지 않음)

근데 내 기억이 맞으면 JavaScript 배열도 객체인데(인덱스를 key로 가지는 객체인데 그냥 배열처럼 쓰는거라고 알고 있음. 다만 전통적 의미의 배열의 기능을 할 수 있는 메서드들이 존재함)

```javascript
// 배열은 인덱스값을 key로 가지는 객체다!

// 타입이 객체로 나옴!
console.log(typeof []); // object

// key를 순회하면 인덱스가 문자열로 나옴!
console.log(Object.keys([1, 2, 3])); // [ '0', '1', '2' ]

// 객체마냥 프로퍼티를 정의하는것도 가능함!
arr.customProperty = "custom";
console.log(arr.customProperty);
```

저자는 이런 현상이 특별하지 않고, 객체임을 감안하면 자연스럽다고 함. 아직 정의되지 않은 프로퍼티에 접근하려고 하는거랑 똑같은 개념이라고...

근데 궁금한 점이 생김.

empty items라고 나오는데, 인덱스로 접근하면 undefined로 나오잖아.

```javascript
const arr2 = new Array(3);

console.log(arr2); // [ <3 empty items> ]
console.log(arr2[0]); // undefined
```

이상하네 접근하려고 했을 때 undefined 라고 나오면 변수 선언만 하고 할당하지 않은 것처럼 메모리 공간 자체는 확보되어 있는데 undefined만 할당되어 있는거 아님??이라는 생각이 들었음.

근데 `값을 할당하지 않은 변수`에 접근할 때랑, `객체의 없는 프로퍼티`에 접근할 때 반환되는 값 자체는 undefined로 동일하지만, 처리되는 과정은 다름

값을 할당하지 않은 변수 -> let a; 라는 변수 선언문을 만나면 엔진이 식별자를 연결할 변수 공간을 확보함. 그리고 undefined로 명시적으로 초기화 함. a는 실제로 존재하는 값이며, 명시적으로 undefined라는 값을 들고 있음.

객체의 없는 프로퍼티 -> key값 자체가 존재하지 않는 값임. 존재하지 않는 프로퍼티에 접근하면 JavaScript 내부 동작 규칙([[Get]] 명세)에 따라 `찾는 값이 없음`의 의미로 undefined를 반환함. 즉 찾으려는 값이 없음임.

값을 찾았는데 undefined인거랑, 애초에 찾으려는 값이 없는 상태인거랑 차이가 있음. 오케이 이해했음.

계속 보자.

그래서 저자가 말하는건, undefined는 엔진이 부득이하게 할당하는 경우이고 우리 통제 밖에 있음.

반면에 null은 같은 의미이지만 명시적으로 값이 비어있음을 나타내고자 만든 데이터 타입임.

그래서 규칙을 사람이 코드를 짤 때 아직 값이 없다는 의미를 주고 싶다면 무조건 Null을 할당하게 하면, undefined는 JavaScript 엔진이 예상치 못하게 없는 값에 접근할 때 반환하는 값으로서의 의미만 가질 수 있다.

null을 쓰고 undefined는 내비두자.!

(참고로 동등 연산자는 null과 undefined 동일한걸로 취급하니까 비교하고 싶으면 일치 연산자 쓰자.)
