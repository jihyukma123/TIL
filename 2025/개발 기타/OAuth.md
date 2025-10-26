# What is OAuth

MCP기반으로 구현되어 있는 Apps SDK에서의 인증이 어떻게되는지 알아보기 위해서 OAuth를 공부해보고자 한다.

왜? MCP의 Auth 규격이 OAuth2.1 기반이라는데 나는 OAuth가 뭔지도 잘 모름.

# what for?

OAuth = Open Authorization(not authentication)

Open?? 열려있는 인증이라는게 무슨 소리일까....

이 기술이 왜 등장했는지부터 알아보자.

서비스 개발자들이 사용자들의 특정한 정보에만 접근하고 싶었는데, 이를 위해서 사용자들의 특정 정보를 가지고 있는 서비스에 접근할 수 있는 표준화된 방법이 없었음.

예를 들어, 어떤 서비스가 사용자들의 구글 주소록에 접근해서 연락처 정보만 받아오고 싶었음. 근데 이 정보만 받아오는 방법이 없으니까 사용자들의 구글 로그인 정보를 같이 저장하거나 했어야했는데, 서비스 입장에서는 risky한 선택이었음. 내 보안 문제로 사용자의 구글 로그인 정보까지 털리면? 사용자 입장에서는 개인정보 risk, 기업 입장에서는 소송 risk..

비밀번호 공유 없이 API 접근 권한을 위임하는 메커니즘이 필요한 상황이었음.

인증(사용자가 누구인지?)와는 별개로, 안전한 API 접근 위임을 위한 표준을 만들고자 하는 시도의 결과물이 OAuth.

이게 무슨 소리인지 바로 이해가 잘 안됐음.

API접근 권한의 위임이라..

구글주소록에 접근하고자 하는 새로운 서비스가 있을 때, 이 서비스는 구글 로그인 정보가 다 필요하지 않음

특정 요청이, 특정 사용자가 구글에 등록한 연락처 정보에 접근할 권한이 있는지만 알면 되는데, 문제는 이를 위해서 정해진 방법이 없음.

그래서 구글이, 사용자를 대신해서 해당 서비스에 연락처에 접근할 수 있는 권한만 위임해주는 표준화된 방법을 만들었고 이게 OAuth

왤케 여전히 뭔가 와닿지 않는 느낌이 들까 생각해봤는데, '위임'이라는 단어가 헷갈리는 요소인 것 같음.

누가, 뭘, 누구한테 위임한다는건지 명확한 느낌이 아니라서...

그래서 위임이라는 단어를 빼고 다시 이해해보자.

OAuth의 핵심은 비밀번호 대신 특정 권한만 가진 임시 출입증을 발급받아 사용하게 하는 과정임.(고급차들은 'valet key'가 있다고 함. 발렛파킹할 때 맡길 수 있는 별도의 열쇠로 주행거리나, 트렁크/특정 정보 잠김 같은 권한이 있음. ㄷㄷ)

involve되어있는 주체가 3개네

- 사용자: User
- 사용자의 특정 정보를 가지고 있으면서, 다른 제3의 서비스에 특정 정보에 대한 접근 권한을 발급하는 주체: Service Provider
- 사용자에 대한 특정 정보가 필요해서, 해당 정보를 가지고 있는 서비스에 정보 접근 권한을 요청하는 제3의 주체: Consumer

구글 비번을 알려줄 수 없는데 그러면 어떻게 구글 연락처 접근을 시켜주지..?라는 문제를 해결하고자 함.

- allows the User
- to grant access to your private resources on one site(Service Provider)
- to another site(Consumer)

OpenID - using single identity to sign into many sites
OAuth - giving access to my information without sharing my id at all

OAuth는 웹뿐만 아니라, 모바일 등 다양한 환경에서 사용되는 것을 전제로 만들어졌다고 함.

# OAuth 동작방식

# 참고자료

- [What is OAuth?](https://www.microsoft.com/en-us/security/business/security-101/what-is-oauth)
- [Introduction](https://oauth.net/about/introduction)

## 기타

인증(Authentication) -> '누구인가?'

인가(Authorization) -> (인증이 완료된 사용자가) '무엇을 할 수 있는가? 어떤 권한이 있는가?'
