# Pydantic

Pydantic is the most widely used data validation library for Python.

"Py"와 "pedantic"의 합성어이다. "Py"는 이 라이브러리가 Python과 관련이 있음을 나타내고, "pedantic"(지나치게 규칙을 찾는)은 데이터 검증과 타입 강제에 있어 철저한 접근 방식을 의미한다.

## data validation

외부에서 들어온 데이터가 `내가 원하는 형태`인지 확인하고 정리하는 작업.

근데 재밌는건 공식 문서에 `validation`이라는 단어의 의미에 대한 내용이 있다는 점.

예를 들어서,

```json
// React frontend에서 데이터를 아래처럼 보낸 경우
{
  "username": "neopenni",
  "age": "30" // ❗string으로 들어옴
}
```

파이썬 백엔드에서 근데 아래처럼 정의되었다면.

```python
class User(BaseModel):
    username: str
    age: int   # ❗ 숫자(int)여야 함!
```

이때 Pydantic이 이걸 받아서: "30" → 30 으로 변환해주고, "neopenni"는 잘 받았는지 확인하고, 누락된 필드나 잘못된 타입이면 자동으로 에러를 던져줌.

여기서 내가 궁금한게, 에러를 던져준다고 했는데 왜 타입변환이 되는건지??
-> [공식 문서 이 부분](https://docs.pydantic.dev/latest/why/#strict-lax)을 읽어보면, pydantic은 default로는 `tolerant to common incorrect types`라고 함. int 타입 값에 전달된 numeric string은 int로 parsing 되어서 처리되는 방식.

# Why use pydantic?

## Type hints를 사용함

tyep hint가 뭐임?

```python
# 이런 형식으로 변수 뒤에 :type 혹은 함수 반환값 등을 사전에 정의하는 방법
name: str = "펴니"
age: int = 30
is_dev: bool = True

# 함수
def greet(name: str, age: int) -> str:
    return f"안녕 {name}, 너는 {age}살이구나!"
```

pydantic은 type hint를 적용하면 알아서 validation을 맞춰서 해준다고 함.

```python
# 별도 typing 없이 type hint를 제공하면
# 검증, JSON <-> Python 객체 변환, Swagger 문서 생성 등 작업 처리함
class User(BaseModel):
    name: str
    age: int
```

## JSON 스키마

pydantic 모델은 JSON 형식의 스키마 생성이 가능 -> 다른 도구와 통합이 용이함.

```python

from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int

print(User.model_json_schema())

# 아래와 같은 JSON 형식으로 변환
{
  "title": "User",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" }
  },
  "required": ["name", "age"]
}
```

# 기초적인 사용법 - Model

Pydantic을 통해서 스키마를 정의하는 가장 기본적인 방법은 `Model`.

`BaseModel`을 상속하는 클래스로, annotation이 달린 속성으로 필드 정의

`BaseModel`에 정의된 여러 메서드를 가져다가 사용할 수 있음.

예를 들어. `model_dump()` 메서드는 모델 인스턴스를 dict 형태로 변환한다. (Serialization이라고 이걸 칭하네. 직렬화, 반대로 역직렬화는 Deserialization JSON이나 dict같은 데이터를 파이썬 객체로 바꾸는 과정.)

기타 등등 메서드들이 존재함.

- `model_validate()`: 주어진 객체를 정의되어 있는 pydantic model과 비교해서 검증함.
- `model_validate_json()`: 주어진 JSON 데이터를 pydantic model과 비교해서 검증함.
- `model_json_schema()`: model의 JSON 스키마를 나타내는 json으로 직렬화 가능한 dict를 반환함.

## Data Conversion

가능하면 정의된 모델을 맞출 수 있도록 입력된 값을 묵시적으로 변환함.

int로 정의된 값이 float 3.00 처럼 들어오면, 3으로 변환되어서 데이터의 손실이 발생할 가능성이 있음.(다분히 의도된 것으로, 대부분의 경우에 더 유용한 접근 방법이라는 관점 기반으로 구현되어 있음)

이런 묵시적 타입변환을 원하지 않는 경우에는 strict mode를 명시적으로 설정해야함.

collection타입 데이터에도 이 strict mode의 규칙이 적용된다.(선언되어 있는 타입과 동일한 값만 validation 통과함)

추가로, collection의 경우 추상 컨테이너 타입 웬만하면 쓰지 말라고 함. (validation 퍼포먼스가 잘 안나올 수 있다고 함.) 불필요한 타입 체킹 피하려면 list 와 같은 concrete type을 사용하라고 함(concrete type은 abstract type의 반대 개념, 실제 인스턴스화 가능하고 직접 사용할 수 있는 구현되어 있는 타입)

- concrete type: `list`, `dict`, `set`
- abstract type: `Sequence`, `Mapping`, `Collection` -> 직접 인스턴스화 할 수 없고 인터페이스로만 존재.

웬만하면 concrete type의 collection을 쓰자!

## Extra Data

By default, Pydantic Models won't error when you provide extra data.(추가 데이터는 무시됨)

```python
from pydantic import BaseModel

class Model(BaseModel):
    x: int

m = Model(x=1, y='a')
assert m.model_dump() == {'x': 1}
```

extra data 관련 model config를 통해서 ignore, forbit, allow 등 처리 방식을 설정가능함.

# Model - Field(whelk source에서 사용)

# validation in pydantic context

Pydantic에서 사용하는 `validation`은 사전적인 의미(유효성, 정확성을 검사하는 것)와 완전히 일치하지는 않는다고 함.

Pydantic의 `validation`은 명세된 타입과 제약사항을 따르는 Model을 instantiate하는 과정을 의미힌다.

이런 의미에서 다르다고 하는거구나.

보통 `input` 데이터에 대한 검증에 많이 집중하는데, Pydantic은 본인들이 output 데이터가 제대로 출력되는 것을 보장한다는 점을 강조하고 싶은 듯?

Input데이터가 명세된 타입이나 제약사항에 맞지 않더라도, 가능하다면 출력되는 결과물은 Input데이터를 적절하게 변환해서 명세된 타입과 제약사항에 무조건 맞도록 처리한다.

`ValidationError`는 입력된 데이터가 특정 type이 아닐 때 발생하는 것이 아니라, 명세된 type으로 parsing이 될 수 없을 때 발생함.

문서에서는 `parsing`이라는 표현은 JSON parsing의 맥락에서만 사용할 예정.(validation -> input값을 명세된 output으로 생성 가능한지 여부 확인, parsing - json 처리)

# Field

Field클래스가 제공하는 기능들.

- defaults="" 을 통해서 기본값 줄 수 있음
- default_factory를 통해서 기본값 생성을 함수 실행으로 처리할 수 있음.
  - default_factory=lambda: someFunc() 이런 식으로 람다함수 형식으로도 선언 가능함.
- alias를 줘서 해당 클래스 생성 시 alias로 데이터 전달할 수 있도록 할 수 있음.
- 여러가지 제약사항을 부여할 수 있음.

# BaseSettings

`BaseSettings`라는 클래스 상속하는 클래스 만들어서 전체 설정같은 코드 사전에 추가할 수 있음.
