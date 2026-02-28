# What is SSO

사용자가 하나의 ID를 사용해서 여러 앱에 로그인해서 사용할 수 있게 해줌

## Federated Identity

이 개념을 활용해서 identity를 공유할 수 있음 여러 앱들이

## 2종류의 프로콜로 인증 가능

- SAML(Security Assertion Markup Language)
  - XML based open standard for exchanging identity information between services
- OpenID Connect
  - Google ID를 써서 YouTube에 로그인하거나 할 때 사용됨. JWT를 사용해서 인증 정보를 공유하는 형태

## 일반적인 로그인 flow(SAML 기준)

사용자가 아이디를 활용해서 GMAIL에 로그인하는 상황을 생각해보자.

지메일 -> 여기서 SP(Service Provider)

지메일이 제공한 로그인 화면에 사용자가 회사 이메일을 입력하면, 

지메일 서버가 회사 계정인걸 알고, 

브라우저에게 SAML 인증 요청 (SAR, SAML Authentication Request)를 브라우저에게 전송함.

브라우저는 이걸 받아서 사용자를 IdP로 리다이렉트 시킴. (SAR에 명시된 IdP로 보내는거임. ex. Okta, Auth0)

IdP -> 사용자에게 로그인 화면을 표시함. 사용자는 그러면 이 IdP로그인 화면에 인증정보(ID, PW)를 입력함

IdP는 사용자 정보가 맞는지 확인해서 맞다면, returns a signed SAML assertion to the browser
- SAML Assertion 이란, XML 문서
  - 사용자 정보와, 사용자가 접근할 수 있는 정보에 대한 info를 담고 있음.
- '이 사용자가 인증되었다'라는 증명서 역할을 한다.
- XML을 중간에 조작하면 안되겠지? 이걸 토대로 SP가 이 사람을 로그인시켜줄테니까?
- 그래서 IdP가 개인키로(Private key) XML에 서명을 한다고 함

브라우저는 이 서명된 SAML assertion 을 SP에 다시 전달(포워딩 함)

그러면 SP는 사용자가 보내준 정보를 그대로 믿고 바로 로그인시켜주면 될까? 안되지.
SP는 정보를 받아서, 받은 assertion이 내가 SAR을 보낸 그 IdP에서 제대로 인증처리된건지 validation을 함.
- this validation is usually done with public key cryptography

validation이 안전하게 처리되면, SP는 사용자에게 protected resource에 대한 정보를 반환함(SAML assertion에 작성된 유저 접근 권한을 토대로)

---여기까지가 가장 기본적인 형태의 SSO 로그인 흐름이었음.

자 이제 유저가 다른 서비스(슬랙)에 또 로그인하려고 한다고 생각해보자.

앞서 지메일 로그인과 동일한 흐름으로 진행되지만, 

이미 앞서 사용자가 IdP에 이미 로그인을 했기 때문에, IdP에 로그인하는 과정 없이 바로 

사용자에게 Slack을 위한 SAML assertion을 만들어서 반환하고, 브라우저를 통해서 Slack으로 전달됨

Slack은 마찬가지로 다시 SAML Assertion을 검증해서 validate되면 사용자에게 SAML Assertion에 적힌 접근 권한을 토대로 정보를 제공함.

## SAML은 그러면 그냥 방식인건가?

Open Standard or Protocol?

개방형 표준이 맞음.

'어떻게 인증 정보를 교환할 것인가?'를 정의

정확히 말하면 SAML에 포함되는 것은..

- Assertions(무엇을): XML로 정의된 인증 정보를
- Protocols(어떤 메세지를): Requeste/Response 메세지 형식
- Bindings(어떻게 전송): HTTP Redirect, POST, 등
- Profiles: 위의 것들을 조합한 실제 사용법.


# 여러 SP에 동일한 브라우저로 동일한 회사 계정(===동일한 IdP로) 접속 시 브라우저에 쿠키 등 세션 관리할 수 있음.

처음에 한 번 이름/패스워드 입력했고, 그 정보에 대한 쿠키가 아직 유효하다면 인증정보 입력하지 않아도 인증이 가능함.

IdP가 cookie를 써서 바로 인증을 처리시켜줌.

---

## 사용자 브라우저를 중개자로 사용하는 이유가 뭐지? SP -> IdP로 바로 가지 않고?

SP(지메일) -> IdP(Okta)가 서로 정보를 주고받으면서 사용자를 인증시키면?

- SP가 사용자의 credential을 받을 수 밖에 없는 구조가 됨. -> 당연히 보안 이슈
- SP가 IdP에게 인증요청을 보내면, IdP는 받은 요청에 대한 응답을 누구한테 보내야 하는지(어떤 브라우저로 다시 인증 결과를 보내줘야 하는지 알 수가 없고, 알기 위해서는 별도로 메커니즘을 구축해야함 -> 복잡도 up)
- Zero-Trust 원칙: SP와 IdP는 서로 신뢰하지 않음.
(IdP는 SP한테 인증 정보를 직접 받거나 보내지 않고, SP는 IdP가 보내온 Assertion을 그대로 믿지 않고 반드시 검증함)

브라우저는 여기서 단순히 redirect를 시켜주는 스위치 같은 역할만 수행하는게 아니라, 

- 사용자 Agent-> SP 로그인 요청
- SP가 사용자에게 response 반환(SAR, SAML Authentication Request)
- 사용자 Agent -> IdP로 redirect시키면서 받은 SAR을 forwarding
- IdP는 인증 후 SAML Assertion을 사용자에게 다시 반환
- 사용자Agent는 받은 SAML Assertion을 다시 IdP에게 전달.

중개자 역할 뿐만 아니라, 이 연결 구조에 대한 상태 관리(인증 중이고, 보내고 받고 보내고 받고 보내고 받고 처리), 보안 정보 관리 주체 간 영역 분리를 처리하는 핵심 메커니즘임.

- 연결의 매개체
- 보안 정보 관리 주체 간 영역 분리(SP는 소비자, IdP는 인증 정보 보관, Agent는 사용자 대신 보안 정보 전달 및 입력의 interface 제공)

## Zero Trust

아무도 믿지 않는다는 철학임.

> Don't trust, always verify

핵심 원칙 3가지

- always verify
- least priviledge(최소 권한만)
- assume breach(이미 침투당했다고 가정.)

쉽게 비유하면

전통 보안: 회사 건물 출입증 있으면 → 건물 안 어디든 자유롭게 이동 가능

Zero Trust: 각 방마다 카드키 필요. 회의실, 서버실, 자료실 전부 따로 인증

결국 경계 기반 보안(방화벽 중심)은 한계가 왔고, "사용자 + 기기 + 상황"을 모두 평가하는 보안 모델로 진화한 게 Zero Trust

## Same-Origin Policy

https://gmail.com:443/inbox

https -> protocol
gmail.com -> domain
443 -> port

여기서 Same-Origin이라고 할 때 Origin이 지칭하는 부분은 

https://gmail.com:443/inbox -> 이거 전체라고 함.

✅ 같은 Origin:
https://gmail.com/inbox
https://gmail.com/settings
https://gmail.com:443/api    (443은 https 기본 포트)

❌ 다른 Origin:
http://gmail.com              (protocol 다름: http ≠ https)
https://accounts.google.com   (domain 다름)
https://gmail.com:8080        (port 다름)
https://mail.google.com   

다른 origin의 응답 데이터를 JavaScript가 못읽게 막는 것.

## cookie란?

HTTP cookie

- piece of information that the website says, 'Browser, please always send this piece of information back to me on every request you send to this particular host. (gmail.com 등등)
- cookie도 위변조 방지를 위해서 서명되어 있음 

