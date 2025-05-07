# 의존성이 사용되는 멘탈 모델에 대한 이해

sqlalchemy db session을 만드는 factory함수를 사용해서 session을 만드는 get_db같은 이름을 가진 함수를 fastapi의 api함수에 전달해서 구현하는데, 그 구조가 이해가 안돼서 좀 찾아봄

# 의존성 주입이란

함수나 코드에서 필요한 외부 요소들을 함수가 직접 생성하는 대신 외부에서 주입(제공)받는 방식

진짜 간단하게 말하면, 코드 안에서 사용하는 특정 코드를 전달받아서 쓰는 것을 말함
(함수에 인자로 전달받는다던지 등등)

그 코드가 필요로 하는 코드를 dependency를 list해두고, 필요한 의존성을 채워주는 방법.

이게 진짜 간단한데 그냥 많이 복잡하게 느껴지게 이름이 무섭게 되어있네.

지금 쓰고 있는 fastapi앱을 기준으로 생각해보면, db연결을 하기 위해서는 session이 필요하다.

sqlalchemy db session을 만들 수 있는 Factory function이 구현되어 있다고 했을 때, 가장 간단하게 session을 path operation function 안에서 사용할 수 있는 방법은 함수 안에서 직접 factory함수를 호출해서 db session을 만들고 그걸 쓰는 것임.

```python
@api.get('/users/{user_id}')
def get_user_info(user_id):
    db = SessionLocal()  # 함수 내부에서 직접 데이터베이스 session 객체 생성
    return db.find_user(user_id)

```

만들어야 하는 api 함수가 몇 개 안되면 이렇게 해도 큰 문제 없을 것 같은데, 많아지면 매번 db = SessionLocal() 이라는 코드를 반복해서 작성하는게 귀찮기도 하고, 뭔가 수정해야되면 이걸 일일이 다 찾아서 수정해야겠지??

이런 문제를 해결할 수 있는게 의존성 주입임.

```python
def get_user_info(user_id, db):  # db를 외부에서 주입받음
    return db.find_user(user_id)
```

이렇게 하면 몇 가지 장점이 있다.

- 재사용성 개선

```python
# 의존성 함수 정의
def get_db():
    db = Database()
    try:
        yield db
    finally:
        db.close()

# 여러 라우트에서 재사용
@app.get("/users/{user_id}")
def read_user(user_id: int, db: Database = Depends(get_db)):
    return db.get_user(user_id)

@app.get("/items/{item_id}")
def read_item(item_id: int, db: Database = Depends(get_db)):
    return db.get_item(item_id)
```

- 테스트하기가 더 쉬워짐(DB대신 가짜 객체를 주입하는 형식으로 필요한 값을 바꿔가면서 테스트 가능)
  - 테스트하는 부분을 분리하기도 쉽다. 필요한 부분에만 mock data를 넣어서 테스트하는게 가능함.
- 코드 간 결합도 낮아짐

# FastAPI 에서 의존성 주입

FastAPI의 경우 `이건 외부 의존성이야`라고 명시하면, 나머지는 FastAPI가 처리해서 코드에 필요한 의존성을 주입해줌.

즉 내가 직접 매번 코드 작성하거나 할 필요 없이, 나한테 필요한건 이거야 라고 의존성을 명시해두면 된다.

그러면 함수가 호출되었을 때 FastAPI가 의존성을 주입해주기 위해서 필요한 작업을 알아서 처리하고 함수에 넘겨줌.

# 의존성 역전 원칙과의 연관성

SOLID의 DIP는 고수준 모듈(비즈니스 로직)이 저수준 모듈(구체적인 구현체)에 의존하지 않고, 추상화에 의존하도록 설계해서 시스템 결합도 낮추고 유연성을 높이는 것을 목적으로 함.

`get_user_service`라는 api가 호출되었을 때,

DB에 접근하기 위해서 `MySQLUserRepository`라는 구현체에 의존하는 구조를 생각해보자.

만약에 구현체를 교체하고 싶으면, `get_user_service`의 코드도 같이 수정해야 한다.

비즈니스 로직을 데이터를 가져오는 방식이 변경됨에 따라서 같이 바꿔줘야 하는 바람직하지 않은 상황이 발생하지?

그래서 이걸 방지하려고 `UserRepositoryInterface`라는 추상 인터페이스를 만든다. 그리고 이 `get_user_service`는 이 인터페이스에 의존하도록 만든 후에 `MySQLUserRepository`, `MongoDBUserRepository`같은 구현체는 인터페이스를 구현하면 비즈니스 로직 변경 없이 구현체를 갈아끼우는게 가능함.

말이 복잡한데, 그냥 추상화된 계층에 의존하도록 하고 직접 구현체에 의존하지 않는다는 것.

고수준 모듈이 더 변경될 가능성이 적은 것, 저수준 모듈이 더 변경될 가능성이 큼.

너무 `의존성 역전의 원칙`이라는 단어에 꽂히지 말고, 소프트웨어 설계에서 보다 큰 원칙을 생각해보면, 그리고 일반적으로 뭐가 더 나을지에 대해서 생각해보면,

`안정되어 있는 소프트웨어 아키텍처`라는 게 뭘까? 안정되어 있으려면? 생각해보면 대기도 안정되어 있으면 대류현상이 잘 발생하지 않는데 그러려면 차가운 공기가 아래쪽에 따뜻한 공기가 위쪽에 위치해야 한다.

이처럼 소프트웨어가 안정적이려면? 내 생각에는 만들어진 최초의 형태로 계속 유지되는게 가장 안정적인 방법이겠지? 하지만 소프트웨어는 사용되면서 조금씩 변경사항이 생기기 마련이다. 이 때, 새로운 변경사항들을 반영할 때 그 변경 사항이 전체 소프트웨어에 미치는 영향을 최소화하는게 최선이고 이를 위한 구조가 잘 잡혀있으면 `안정적인 소프트웨어 아키텍처`라고 할 수 있겠지??

그러기 위해서 지키면 좋은 원칙(?) 근데 원칙이라는게 지키면 좋은건가 지켜야만 하는건가... 무튼.

변하기 쉬운 개체에 고수준 모듈이 의존하면, 개체가 변할 때마다 고수준 모듈의 코드도 같이 수정해야함 이건 안정적이라고 보기 어렵지.

반대로 잘 변하지 않는 개체에 고수준 모듈이 의존하면, 변하기 쉬운 개체의 변화에 고수준 모듈이 일일이 대응해서 변경되지 않아도 되어서 안정적인 소프트웨어 아키텍처가 된다.

# 의존한다..?

의존한다는게 뭘 한다는걸까?

어떤 구조일 때 의존한다고 할까?

보통 의존한다라고 하면 `직접적으로 참조한다`라는 의미로 보면 되는 것 같음.

최근에 봤던 클린아키텍처 글 관점에서 보면, circle안쪽에 있는 모듈은 바깥쪽에 있는 모듈에 의존하면 안된다고 했음.(source code dependencies can only point inwards)

바깥쪽 친구들이 안쪽 친구 의존하는건 괜찮은데 역은 안됨.

즉, 다음 같은 짓 하지말라는거임

```javascript
function innerModule() {
  //...
  outerModule(); // 직접 바깥쪽 모듈을 참조하고 있음.
  // outerModule의 변경에 영향을 받는다.
}

function outerModule() {}

// Java 클래스도 마찬가지로 다른 클래스를 하나의 클래스에서 직접참조하고 있으면
// A는 B에 의존함.
class A {
    private B b
}

class B {}
```

**참고자료**

- [FastAPI에서의 의존성 주입: 유연하고 확장 가능한 서비스 구조 만들기](https://devocean.sk.com/blog/techBoardDetail.do?ID=167025&boardType=techBlog)

# (추가) FastAPI에서 Depends로 의존성을 처리하는 목적

코드를 보다보니 왜 그냥 그대로 함수 parameter로 넘겨도 되는 값을 왜 FastAPI에서 제공하는 Depends함수를 사용해서 넘기는지 궁금증이 생겼음.

그냥 그렇게 처리하면 나머지는 FastAPI가 처리해준다고 하고 넘어갔었는데 도대체 뭘 처리해준다는 것인지??

일단 공식 문서부터 다시 제대로 읽어보자.

`Depends`는 single parameter만 받는다. 보통 함수 같은 것들을 전달하며 전달한 함수는 내가 호출하는게 아니라, fastapi가 해당 router함수가 호출되는 시점에 같이 처리해준다.

FastAPI가 처리하는 작업은,

- 맞는 파라미터를 전달해서 dependency 호출(예시 코드에서는 common_parameters함수를 호출)
- 호출 결과 받아서
- 명시된 router함수 parameter에 할당.

```python
async def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

# /에 대한 요청이 오면 common_parameters 함수에 router함수에 전달된 parameter중 매칭되는 parameter가 있는지보고 매칭되는 parameter랑 같이 해서 해당 함수를 호출한다. 그리고 결과로 반환된 dict를 commons parameter에 할당
# 함수 안에서는 common_parameters 함수 호출이나 q,skip, limit parameter를 명시적으로 처리할 필요 없이 commons dict받아서 원하는 작업하면 됨.
@app.get("/")
def read_root(commons: Annotated[dict, Depends(common_parameters)]):
    return {"Hello": "World"}

```

share되는 코드를 한 번만 작성해서 여러 path operation들이 공유할 수 있게 해준다.

share되는 공통 파라미터 처리 로직인 common_parameters를 주입받아서 fastapi가 처리할 수 있도록 하는 구조.

이렇게 처리하는 것의 장점 중 하나는, 함수 parameter에 주입되는 값의 type이 보존되어서 auto complete등 처리가 가능하다는 점.

## 아니 그래서 그냥 함수에 parameter 수동으로 전달하는거랑 무슨 차이인데..?

만약에 매번 공통으로 받는 parameter가 있다고 했을 때, Depends가 없으면 어떻게 처리해야되지?

```python
@app.get("/items/")
def read_items(q: Optional[str] = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}
```

이런 식으로 매번 명시적으로 query parameter를 명시해서 받아서 사용해야 한다.

`parameter`를 재사용하는 구조가 가능해진다. 외부에서 주입받을 명시적 변수를 선언하는게 아니라, 주입받을 함수를 분리해서 해당 함수에서 필요한 값을 반환하는 의존성 주입 구조를 통해서

또한 db 세션 같은 객체를 주입하는 경우를 생각해보면, 또 하나의 장점은 close()등 중요한 필수 수행 로직이 반드시 실행되는 구조를 만들 수 있다는 점(실행의 일관성, 휴먼에러 방지, 재사용성 개선)

```python
def get_db():
    db: Session = SessionLocal()
    try:
        yield db  # 이 값을 endpoint 함수에 주입해줌
    finally:
        db.close()  # 응답 후 자동으로 호출됨!


@app.get("/items/")
def read_items(db: Session = Depends(get_db)):
    # 여기서 db 사용
    items = db.query(Item).all()
    return items
```

그렇구낭. 그냥 함수를 전달하는 것보다 어떤 값을 전달하는 느낌으로 주입할 수 있고, 그 parameter에 할당되는 값을 반환하는 함수를 통해서 parameter재사용이나, 로직 공통화 같은 작업을 수행할 수 있다.

그냥 함수나 값을 주입하면? 아래 작업을 못해. Depends를 쓰면 이게 가능함.

- parameter를 알아서 매칭시켜서 내 함수에 전달해줌(아니면 매번 줄줄이 써야할수도..?)
- 고정 로직 수행도 가능함(Dependencies with yield라고 해서 `To do this, use yield instead of return, and write the extra steps (code) after.` 라고 공식문서에도 언급되어 있다.)
