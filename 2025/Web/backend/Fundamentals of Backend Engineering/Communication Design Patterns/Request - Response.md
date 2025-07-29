# Request - Response

가장 유명한 디자인 패턴

## 어디서 사용되는지?

- Web, HTTP, DNS, SSH
- RPC(remote procedure call)
  - 원격 서버에서 특정 작업을 처리하는 것이라서 호출이 발생함
  - 이게 많이 사용되었던 이유는..?
- SQL and Database protocols
- APIs(REST/SOAP/GraphQL)

## Anatomy of Request/Response

요청의 구조는 전송 주체 뿐(클라이언트) 뿐만 아니라 서버에도 정의되어 있어야 함.

왜?

서로 약속된 방식으로 소통해야 하니까.

protocol과 message format이 약속되어 있음.

참고로 Request를 parsing해서 message를 추출하는 작업은 대부분 라이브러리들이 수행함. 그래서 직접하는 일은 없지만, 라이브러리들이 어떤 작업을 처리해주고 있는지는 이해하고 있어야 한다.

## Request가 전송되는 방식

통으로 전송되는게 아니라, `segment`라고 부르는 작은 조각들로 쪼개져서 `IP packet`이라고 부르는 데이터 패킷에 담겨서 네트워크 상으로 전송됨

# 추가

- 꼭 클라이언트-서버 아키텍처에 국한되는 디자인 패턴이 아니라는 점.(가장 흔하긴 하지만)
- 동기적/비동기적 방법으로 implement 할 수 있다.(동기적으로도 되는구나. 하긴 기다리면 동기지)
  - 기본적으로는 동기적으로 동작하지만 필요하면 비동기로 전환할 수 있다가 맞다고 함.
- 규모가 커지거나, 비동기성을 갖춘 마이크로서비스 환경에서는 `Pub/Sub`, `CQRS`, `Event Driven Architecture`와 혼용되는 경우가 많음.
- 오류와 상태를 명확하게 정의하는 것이 핵심
  - state 200,500 같은 상태 code는 웹에서만 유효한건가 아니면 Request-Response 패턴을 사용하는 아키텍처에서 유효한건가??
