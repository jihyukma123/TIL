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
