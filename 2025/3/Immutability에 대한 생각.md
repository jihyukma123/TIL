# Primeagen의 영상을 보다가 하게 된 생각

there are tradeoffs for everything...

불변성이라는게 항상 좋은걸까? 항상 더 `좋은` 코드 작성법일까?

오늘 이전의 나에게 물었다면 그렇다고 답했을 것 같다.

이유가 뭘까? 사람들이 원본 데이터를 변경하는 것에 대해서 위험성이나, 예측 불가능성을 많이 이야기했던 것 같기 때문이라고 답할 것 같음...데이터를 의도치 않게 변경시키지 않고, 복사해서 사용해서 원본을 오염시키지 않는게 항상 좋다고 생각했고 코드 작성할 때 거의 항상 그렇게 했던 것 같다.

근데 immutability를 지킴으로 인해서 내가 잃는 것에 대해서는 생각해본적이 없었음.

immutability를 적용했을 때 잃는게 뭔지? -> Primeagen은 performance라고 함

semantic한 변수명을 지었을 때 얻는것과 잃는 것은 뭘까?

그리고 얻는게 잃는것보다 낫다고 판단은 어떻게 하는걸까?

궁금하네..?

# 불변성을 통해서 얻는 것과 잃는 것.(GPT가 알려줌)

**불변성이 주는 장점**

- 예측 가능성: 데이터가 변경되지 않으니까, 어디에서 값이 변하는지 추적할 필요가 없음.
- 안전성: 사이드 이펙트를 줄이고, 특히 다중 스레드 환경에서 경쟁 상태(race condition) 문제를 방지함.
  - Java가 여기에 해당되는데, Effective Java 라는 책에서는 "Classes should be immutable unless there's a very good reason to make them mutable....If a class cannot be made immutable, limit its mutability as much as possible." 라고 언급하고 있다고 함. Java는 스레드를 여러 개 실행시킬 수 있는데 불변 객체는 이런 스레드 간 간섭으로 인한 동기화 문제를 신경쓰지 않아도 된다고 함. 그리고 어떤 자료에서는 불변성을 지키기 위해서 드는 비용(객체를 새롭게 생성하는 것에 대한 비용)이 과대평가 되어 있으며, 불변 객체가 주는 이점이 훨씬 크다고 주장하기도 함.
- 디버깅 용이: 값이 변하지 않으니, 특정 시점에서의 상태를 확신할 수 있음.

**불변성이 유발하는 비용**

- 성능 문제: 매번 새로운 객체를 만들면 메모리 사용량이 증가하고, 가비지 컬렉션 부담이 커짐.
- 불필요한 복사: 대량의 데이터를 다룰 때, 변경이 적은데도 계속 복사하면 오버헤드가 생김.
- 코드 가독성: 일부 경우에는 deep copy나 spread를 남발하면서 코드가 더 지저분해질 수도 있음.

# MDN문서를 통해 추가로 알게된 불변성의 장점

[불변성에 대한 MDN 문서](https://developer.mozilla.org/ko/docs/Glossary/Immutable)에서는 불변 객체의 장점 중 하나로 `Lower developer mental burden (the object's state won't change and its behavior is always consistent)`라고 언급하고 있음.

불변 객체가 cognitive load를 낮춘다...
