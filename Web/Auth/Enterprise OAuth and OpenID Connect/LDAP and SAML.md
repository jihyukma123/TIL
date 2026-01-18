# Overview & Security Basics

과거의 인증 관련 기술들을 살펴볼거임.

그리고 엔터프라이즈/Social App들에서 어떤 문제점들이 있어서 OAuth 2.0이 등장하게 된건지 볼거임.

그리고 관련 용어를 살펴볼거임. (이 맥락에서 사용되는 용어는 알아야지)

## Security Basics - Providers

**User, Identity**

모든 앱은 '사용자'가 있음.

- 브라우저에서 웹앱을 사용하는 사람
- cron job calling your application using a REST api

아하 꼭 사람이지 않을 수 있다는 점.

중요한 건, '요청하는 주체'에 대한 정보가 '정보를 제공하는 주체'에게 제공되어야 한다는 거임. App needs to know 'who' is using it.

Identity는 바로 이 '정보 제공 주체'에게 제공되는 '요청하는 주체'의 정보. 즉 user information임

이 프로세스에 관여되어 있는 주체는 크게 4개

- User: 나
- User Agent: 나를 대신해서 인증 요청 등을 수행하는 주체. 맥북에서 돌아가는 브라우저라고 생각하면 됨
  - User Agent를 통해서, request가 하나의 데이터센터에서 다른 데이터 센터로 redirect될 수 있는 매개체라는 점에서 아키텍처에서 중요한 역할을 수행한다고 함.(무슨 소리인지 정확하게는 모르겠음. 아마 데이터 센터A -> 데이터 센터B 이렇게 정보가 왔다갔다 하는 구조가 뭔지 이해가 안돼서 그런 듯. IdP와 SP가 서로 다른 데이터센터에 있을 때 유용하게 사용된다고....)
- IdP(Identity Provider): 핵심 역할은 Authentication, 인증임. (사용자의 정보를 Service Provider에게 제공함. '이 사용자는 누구다'라는 '사용자 정보'를 묶어서 전달. how? using Token, assertion)
- Service Provider(Application): 말 그대로 앱의 핵심 기능을 제공하는 역할이지만, 보안 관점에서 보면 Service Provider의 역할은 Authorization, 인가임.

아직은 좀 헷갈리긴 하는데, 중요한건 '사용자가 누구인지'는 IdP가 확인해주지만, '그래서 우리 서비스에서 구체적으로 무엇을 할 수 있는지'는 우리 서비스(Service Provider)가 결정하는 것이 일반적인 구조라고 함.

**Authentication**

인증. 이 사람이 진짜 우리 서비스에 접속 권한이 있는 그 사람이 맞는지 검증하는 것

**Authorization**

인가. The act of making sure that that user can only do whatever the user is supposed to do and nothing more

# LDAP

Lightweight Directory Access Protocol -> 통신 규약임

HTTP 처럼 어떻게 통신할 것인지를 정의

LDAP이라는 이름에서 알 수 있듯이, 'Directory'라는 것에 접근하기 위한 경량 프로토콜인데, What is `Directory?`

Directory Service = 컴퓨터 네트워크의 사용자, 기기, 서비스, 그룹 등 자원의 정보를 중앙에 저장하고 관리하는 특수한 데이터베이스. 정보를 계층 구조로 표현해서 저장한다고 함. 한 번 등록된 정보는 잘 바뀌지 않지만, Read는 계속 발생할 가능성이 크다는 점을 고려해서 읽기(조회) 성능이 압도적으로 최적화 되어 있음. 대표적인 Directory Service에 Microsoft Active Directory가 있는 것. 가장 많이 사용되는 서비스이며, 내부적으로 LDAP을 사용한다고 함.

## Security Architecture of the Past no.1 - Homegrown Architecture

Homegrown -> SAML, OAuth와 같은 외부 표준이나, 검증된 인증 솔루션(Okta)를 쓰지 않고 개발자가 직접 DB Table 설계하고 로직 짜서 만든 인증/보안 시스템

1990s의 형식

- Application Service가, IdP/SP의 역할 동시에 수행, 자연스럽게 Datastore도 Application/identity 역할을 동시에 수행

이 구조의 문제점

- 한 조직에 10개의 application이 있다고 하면, 각각 하나의 identity data store가 필요함.
  - 하나의 identity 정보 변경이 필요하면, 전체 10개의 identity store에 다 반영해야되는 문제가 있음.
- 사용자가 입력하는 인증 정보(id,password 조합)이 개발자/운영팀에 노출됨. 이는 보안 risk로 여겨질 수 있음.

## LDAP Identity Provider

가장 대표적인게 Microsoft Active Directory.(AD -> 아마 이게 내가 알아야되는 것 같은데..? AD라고 하던게 이거구나..)

회사 AD에 모든 사용자 정보가 있기 때문에, 개별 Application은 그냥 이 AD에 연결해서 사용하면 됨.

약간 사용자 인증정보의 SSOT 역할을 하는 느낌으로 이해됨.

거의 모든 엔터프라이즈가 AD 사용한다고....

그래서 LDAP이랑 AD가 거의 같은 표현이라고 생각하면 됨 이 강의에서는.

Identity -> LDAP Identity Store에 저장됨
Authentication -> LDAP IdP가 수행.
Application -> Authorization 수행(this never changes, Application이 사용자가 어떤 기능에 접근 가능한지 알아야 된다고 함. 아까는 이해가 안됐는데 이 구조면 좀 더 이해가 되긴 하네. 예를 들어서 구글 Auth 서버에 내 정보가 있다고 생각해봐 그리고 구글캘린더/구글드라이브 등등 구글에 연결되어 있는 수많은 앱들이 있잖아. 그러면 인증 서버가 어떤 앱에 어떤 기능에 이 사용자가 접근 가능한지까지 들고있는건 좀 이상한 구조이긴하네. 그건 전혀 알 필요가 없는 정보인 것 같음 책임 관점에서 그냥 인증의 SSOT만 수행하고, 인증 정보만 관리하면 됨. 해당 사용자가 어떤 정보에 접근 가능한지는 앱 레벨에서 관리하는게 맞아 보인다.)

이 아키텍처의 단점 2가지

- Enterprise 관점에서 보면, Enterprise 안에 있는 app은 Application Provider와 LDAP IdP가 같은 데이터 센터 안에 있어서 바로 접근 가능하기 때문에 별 문제가 없음.(일반적으로) Application이 AD접근 가능하지 이러면
  - 근데 application이 enterprise 밖에 있다면? AWS, GCP, Azure 등에 배포된 앱이라면? 앱은 바로 AD에 접근이 안됨 왜냐하면 엔터프라이즈 안에 보호되어 있으니까. 보통 보안/네트워크 차원에서 AD로의 외부에서 바로 접근은 허용하지 않는다고 함. (huge security risk). 즉 엔터프라이즈 외부에 배포된 App -> 엔터프라이즈 내부에 있는 AD로 인증 요청이 안되니까, 다른 방법이 필요해짐.
- 또 한가지 단점은, 앞서 homegrown의 경우와 마찬가지로, user id/pw가 application으로 전송된다는 점. 근데 그러면 도대체 어디로 보내..? 이상적으로는 Application Provider를 거치지 않고 바로 IdP로 전송되는게 가장 안전하겠지.(어떻게는 곧 배운다고 함.)

이런 단점 2가지 때문에,(Cloud Environment와의 호환성 및 user credential 보안) -> 새로운 아키텍처가 필요하고, 그게 바로 SAML임.

# SAML and Single-Sign On

> What Problem does SAML Solve?

LDAP -> User 정보 관리 중앙화, Centralizing이라는 장점이 있었지만, 2가지 큰 단점이 있었음.

그러면 SAML이 이 두 가지 문제점을 어떻게 해결하는지 보자.

일단 앞서 봤듯이, Enterprise User/User Agent와 App들이 존재하는 데이터센터 내부의 App으로, 외부에서 바로 접근이 안됨. 그러면 외부의 데이터센터 앱에서 어떻게 접근하냐?

`HTTP Redirect`를 쓰는거임. User Agent(브라우저)를 사용해서 연결

App in Another Data Center(Cloud) <-> User Agent <-> App in Enterprise Data Center 구조로, User Agent 를 매개로 한 redirect로 첫 번째 문제를 해결함

두 번째 문제는?

일반적으로, 엔터프라이즈 네트워크에 접속되어 있는 사람은 이미 LDAP(AD)에 포함되어 있음.

-> SAML은 이 점을 활용해서, Request를 보내는 사용자가 네트워크에 접속된(기존에 이미 AD에 있는) 유저니까 해당 유저 정보를 요청한 Application에 반환함. (User에게 id/pw를 물어보는 과정이 필요하지 않음)

# SAML Single Sign-ON Flow

SAML - Security Assertion Markup Language

SAML 좀 더 구체적으로 알아보기(Overall Understanding)

SAML -> 보통 Microsoft AD기반으로 구축된 ADFS라는 서비스라고 함.

그리고 User Agent의 중요한 점은 able to redirect request from one app to another (SAML 아키텍처 상에서는, User Agent가 접속하고자 하는 Application -> SAML IdP로 리다이렉트가 필요함 )

**Piggybacking(피기백킹)**은 '어부바'를 하듯 기존의 시스템이나 인프라에 편승하여 기능을 수행한다는 IT jargon(기술 용어)

OAuth will be piggybacking off of SAML for the Authentication stuff in an enterprise

SAML IdP에서, User Agent를 통해서 SAML Service Provider에게 제공하는 사용자 정보(SAML response)는 encrypted/signed by the IdP. 그래서 SAML Service Provider가 이 정보를 복호화/recognize the sign 하기 위해서는 SAML IdP의 인증서가 필요함.(마찬가지로 SAML IdP도 SAML Service Provider의 인증서가 필요하다고 함)

This is what is called 'trust'

관련 개념들

- SAML Metadata: IdP와 SP가 서로 식별하고 통신하는 방법을 기술한 XML 형식의 명세서.
  - Entity ID(기관 식별 ID), Endpoint URL, Public Key(응답의 서명 검증이나 데이터 암호화에 사용) 등의 정보를 담고 있음
- SAML Response(Claim): IdP를 통해서 로그인을 마치면, IdP는 SP에게 사용자 정보를 담은 SAML Response를 전송함. 이 안에 포함된 핵심 데이터가 **Assertion(혹은 Claim)**
- `Trust` between IdP and SP: SAML 보안의 핵심은 '사전에 약속된 신뢰'에 있음. (아무나 인증 응답을 보낼 수 있으면 보안의 의미가 없겠지)
  - 신뢰 형성 과정
    - 메타데이터 교환: SP는 IdP의 메타데이터 등록하고, vice versa
    - 인증서 공유: IdP는 공개키를 SP에 전달. 이를 통해서 SP는 '이 응답은 내가 믿는, Trust가 성립된 IdP가 보낸 것이 확실하다'라는 것을 수학적으로 증명할 수 있음

기타 개념

- Federated user???
  - federated user란,(우리가 지금 보고 있는 엔터프라이즈 수준의 아키텍처에서 보면) 사내 SAML IdP에서 인증을 받아서, 그 인증 결과를 신롸하는(즉, 사내 SAML IdP와 신롸 관계가 미리 형성되어 있는) 다른 도메인(SP)의 자원을 사용하는 사용자를 의미함
  - federated?? 무슨 뜻이지? '연합된'이라는 의미라고 함. 독립된 여러 조직이 서로 '우리는 서로의 인증 결과를 믿어주자'라과 연합을 맺어서, 그 연합군 내에서는 자유롭게 이동이 가능한 유저라는 의미로 `federated user`라고 부른다고 함.

근데 이미 이렇게 해서 LDAP기반 시스템의 문제를 해결했는데 왜 또 OAuth/OIDC같은 개념이 등장했을까??

알아보자.

근데 그 전에, 인하우스 -> LDAP -> SAML 로 이어지면서 어떤 문제가 있었고 어떻게 다음 세대 기술이 이전 세대 기술의 문제점을 해결했는지 잘 이해하고 넘어가자.

# Enterprise Application Security and Problem Usecases

외부 클라우드/엔터프라이즈 내부환경에 배포된 앱들을 모두 하나의 사내 identity data store에 저장된 사용자 정보를 활용해서 인증하는 구조를 봤음.

그러면 이 구조에서 SAML의 문제가 뭐임?

## Enterprise problem 1 - Microservices

마이크로서비스 아키텍처의 등장과 함께 생긴 문제

User Agent가 호출하는 Application이 마이크로서비스 아키텍처 기반 앱이라면??

예를 들어서, 쇼핑몰 UI를 하나를 보는데, 여기에 연결된 Microservice가 '상품목록', '장바구니', '내정보' 3가지라고 생각해보자.

앱 UI 상에서 로그인 하는 것 -> 여기서는 큰 문제가 없음 기존처럼 SAML 기반 SSO를 시켜줄 수 있음.

근데 문제가 생기는 지점은, 어디냐면....

- 근데 application UI에서 각각 개별 App service를 호출할 때, 개별 Service가 호출하는 주체에 대해서 어떻게 믿고 정보를 제공할 수 있느냐?의 문제가 생김.

개별 App service가 SAML IdP와 정보를 주고 받을 방법이 없음.

새로운 방식을 개발해야되는거지.

-> AppUI 에서 가지고 있는 SAML 토큰을 매번 개별 서비스에 담아서 요청을 보내고, 개별 서비스가 SAML 토큰을 검증하는 구조로 가면 되는거 아님??

가능하지. 가능은 한데 몇 가지 심각한 결함이 있어서 not a good way.

- SAML Token 전송 overhead가 큼(XML이라서 json token에 비해서 장황하고, 많은 정보를 담고 있음.)
- 개별 Service마다 다 SAML IdP하고 메타데이터 저장 교환 등을 통해서 신뢰관계 구축이 필요함.

그래서 새로운 방식이 필요함.(기존 구조에서 이 문제를 해결하기 어려움)

## Enterprise problem 2 - Cloud Apps

> How does REST calls across network boundaries get secured?

App이 본인이 저장되어 있는 데이터센터가 아닌 다른 클라우드에 저장된 앱을 호출하거나, 심지어 Enterprise 밖에 있는 앱이 Enterprise on-premise api를 호출하는 등,

네트워크 경계 밖에 있는 API를 호출하는 다양한 시나리오를 어떻게 안전하게 처리할 것인지?

호출되는 API 입장에서 어떻게 호출자의 신원을 검증할 수 있어??

(SAML 방식에서는 이런 상황에 어떤 문제가 있지?? SAML 방식에서는...다른 클라우드에 있는 앱 호출 시 -> 마찬가지로 토큰 전송하거나 하면 되는데 이때는 또 외부 네트워크로 토큰 정보를 전송하는 것 자체가 리스크인건가? Cloud App 환경이 기존과 다른 새로운 문제 상황이라는게 어떤 포인트인지 이해가 잘 안됨. 마찬가지로 그냥 IdP와 연결가능한 인증된 App이 또 다른 서비스를 호출할 때 어떻게 인증할 것인가에 대한 문제가 비슷하게 있는 것 아닌가? across network boundary, 즉 마이크로서비스 아키텍처 문제 샹황에 비교해서 전자는 같은 네트워크 안에 다른 서비스를 호출하는거라면, 이거는 외부에 있는 서비스를 호출한다의 차이인데, network boundary 밖에 있다는 것으로 인해서 다른 문제가 되는 포인트가 뭐지??)

**Gemini랑 대화하면서 공부한 내용**

1. SAML은 User Agent(브라우저)가 필수임.

IdP에 직접 호출이 가능한 user agent가 매개 역할을 하는 것이 핵심인 아키텍처인데, Cloud에 있는 App이 User Agent 를 거치지 않고 다른 네트워크에 있는 API호출 시 브라우저가 개입할 수 없음.

애초에 SAML은 서버간 REST 기반 정보 교환을 고려해서 만든게 아니기 때문에 서버-서버간 통신을 구현하려면 비효율적이고 표준이 없음.

2. 네트워크 간 방화벽 등 이슈..

3. 인증된 유저에 대해서 리소스 접근 권한 쪼개기가 안됨. 통으로 접근권한을 다 주던가 안주던가 해야되는데, 이는 내부에서는 괜찮지만 외부에서 이런 접점이 많아져서 많은 앱들이 통으로 된 접근권한을 가지는 것은 보안 이슈 면적이 넓어지는 문제가 있음.

**추가로 궁금한 내용**

이 강의를 듣다 보니까, 기본적으로 엔터프라이즈 환경을 가정하고 설명하는 이유에 대해서 궁금해졌음.

왜 Data Center 안에서, User Agent와 SAML IdP가 같이 있는 환경, 혹은 App까지도 같은 Data center안에 있는 환경을 고려할까?

왜 IdP를 외부에서 접근하지 못하는게 critical 한 설계 문제를 유발했을까? 같은 의문이 들었음.

왜냐하면 나는 2022년부터 개발 공부를 시작했고, 내가 익숙한 IT시스템들은 다 B2C 시스템들이었음. (적어도 나는 오늘 그렇다는걸 깨달았음.) 브라우저환경이건 모바일 환경이건 사내 혹은 폐쇄되어 있는 환경에서 동작해야되는 시스템에 대해서는 생각을 전혀 못해봤던 것 같음.

보통 다양한 B2C 앱들은 내부 API/시스템들에 대해서 어쩔 수 없이 외부로 열려있는 접근 경로가 있고, 이게 '아예 외부에서 해당 API를 호출 불가능한' 구조에 대해서 생각할일이 잘 없었음.

근데 인증 시스템의 변화(인하우스 -> LDAP -> SAML -> OAuth) 과정에 대해서 왜 변화해왔는지에 대해서 공부하고 이해하려는 과정에서 이런 점들 깨달았다.

IT시스템들이 B2C 위주로, Application 중심으로 돌아가기 시작한게 (비교적)얼마 되지 않았다는 사실에 대해서 생각해보게 되었음. (지금도 B2C 위주라기 보다는, 이전에는 Enterprise환경이 대부분이었다면 지금은 B2C 환경도 많아졌다 정도로 이해하는게 맞을 것 같음.)

얼마 전에 김영한 DB 강의를 들으면서도 배웠던 건데, 과거에는 System들이 DB위주로 많이 돌아갔다고 했음. DB를 만들어두고 이를 기준으로 설계를 했는데, 지금은 수 많은 서비스들이 등장하면서 중심이 Application으로 이동했다고 했던 것 같음. 이것과 비슷한 맥락으로 이해할 부분들이 있어 보임.

무튼 SAML이 등장했던 2000년대 초반의 IT 환경은 지금하고 완전히 달랐다고 함.

- 중심축의 차이: IT의 메인은 '일반 사용자용 서비스(B2C)'가 아니었다고 함. 기업용 시스템이 메인이었음.
- 엔터프라이즈 관점에서의 고민이 주가 되는거지 그러니까. 기업들이 사내 망 안에 수 많은 독립적인 서버들이 있는데, 내부 직원들이 독립적인 서비스에 일일이 로그인 하려니까 불편한거야.(이메일, HR, 메신저 등등에 다 따로 로그인해야된다고 생각해봐. 어우 귀찮아 번거로워 안하고 말지!) 그래서 SSO를 구현할 방법이 필요했고, 그 방법으로 SAML이 등장한거임. (신뢰할 수 있는 보증 주체 IdP가 한 방에 다 인증시켜버리는거지)
- 당연히 망분리가 있지. 엔터프라이즈 환경은 서로 다른 성벽 안에 존재하는 시스템들이 되는거임. 그리고 XML과 같은 무거운 데이터 형식은 높은 보안 기준/복잡한 속성(부서, 직급, 권한 등) 정보를 담기에 적절했음.

근데 2010년도 이후로 클라우드/모바일 보편화와 함께 앱의 시대로 진입하면서

- Public service 수의 폭발적 증가
- 인터넷 트래픽의 급증 -> 하나하나 request/response의 경량화가 필요해짐. (XML은 적합하지 않음.)
  - 자료 경량화가 얼마나 영향을 줄까? 같은 부분도 궁금하긴 하네. 왕복 정보교환 한 번에 평균적으로 json이랑, XML 이랑 효율 차이가 얼마나 나는지?
    - 이런걸 이해하려면, 네트워크나 Request/Response 구조에 대해서 이해가 필요하겠네. 네트워크로 데이터를 전송할 때 데이터가 커지면 비용이 증가하는 이유가 뭔지, Request/Response 를 처리하는 과정에서 데이터가 커지면 어떤 단계에서 overhead가 발생하는지 등등을 직관적으로 이해하려면 이런 지식들이 결합되어야 하는구나.
- little little 순간적인 깨달음들을 바로바로 정리해주면 나중에 도움이 될 듯. 순간의 깨달음이 사라지는게 아쉽다. 그리고 깨달으면 경지가 상승하는 무협지랑 좀 비슷한 느낌이 진짜 있네 ㅋㅋㅋㅋ 재밌어 참.

## Enterprise problem 3 - Machine to Machine

외부 Application 이 사람이 API를 Trigger하는게 아니라, Cron job과 같이 주기적으로 돌아가는 스케줄 작업 등이 API를 호출해야하면? 그건 어떻게 인증시켜줌?

---

결론을 보면, SAML은 REST API를 잘 다루지 못하고, 그렇게 설계되지도 않았다는 치명적인 단점이 있음.

그래서 REST를 기반으로 Data Center 간 소통에서 인증을 처리하기에 빵꾸가 있음.

# Social Applications and its problems

자 이제 Enterprise 환경이 아닌, Facebook 과 같은 SNS 시스템들이 겪는 문제를 보자.

이 부분은 내가 OAuth 과거에 공부하면서 배웠던 내용이랑 비슷한 내용일 것 같음.

- 사용자가 어떤 앱에, 내가 다른 곳에 가지고 있는 정보를 선택적으로 일부만 제공하기 위한 방법이 필요해진거지.

Google, GitHub 등 다양한 사용자 정보가 생겼고, IdP를 많이 접하게 됨

이거는 다시 한 번 문제 상황을 이해하고 가자.

- 유데미에서 강의를 듣고,
- 강의 수강 완료한 걸 on behalf of the user 해당 user의 링크드인 post로 올리려면?
- LinkedIn에서 제공하는 Post 생성 API를 호출하면 될텐데, 문제는 그냥 호출할 수가 없잖아. 뭔가 이 사용자를 대신해서 post를 올리려면 이 사용자가 맞는지 검증을 해서 올려야될거 아니야. 그래서 써드 파티앱이 LinkedIn API를 인증하에 호출할 수 있는 방법이 필요한데
- 가장 쉬운 방법은 사용자가 유데미에 링크드인 id/비번 입력하는 거겠지. 근데 이거는 뭐 보안 문제가 미친 듯이 터질만한 잠재력이 있으니 안됨
- 뭔가 Udemy에게 linkedin api를 호출할 수 있는, 인가를 해줄 수 있는 메커니즘이 필요한거임.

그래서 등장하게 된...OAuth에 대해서는 다음 섹션에서 심도있게 공부해보자.

후후 재밌다!!
