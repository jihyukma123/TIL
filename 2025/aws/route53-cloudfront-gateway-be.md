# 음.

진행 중인 프로젝트가 Route53, CloudFront, API Gateway 같은 AWS 서비스를 사용 중인데 각각 어떤 역할을 하는지 잘 몰라서 알아보고자 함.

# Route53

Intelligent DNS Service

## Network - BandWidth and Latency(기초 지식)

네트워크 퍼포먼스 측정하는데 사용할 수 있는 중요한 지표

Bandwidth - rate of data transfer for a fixed period of time measured in Gbps, How much data can you get down the wire.

Latency - 데이터 패킷이 source부터 도착지에 도달하는데 걸리는 시간.

- 최초 연결 요청(the first 14Kb bytes..?)의 경우는 DNS lookup, TCP handshake, secure TLS negotiation 등의 작업을 수행하기 위해서 응답이 느림. 이후의 데이터 패킷들은 connection이 수립된 상태에서 전달되기 때문에 레이턴시가 줄어든다.
- 거리가 영향을 많이 주는 변수이고, 거리와 레이턴시는 무조건 비례함.(Propagation delay)
- Transmission Delay: 데이터 패킷을 연결선에 밀어넣는데 소요되는 시간, 패킷의 크기와 연결 대역폭에 달려있음.
- Queueing Delay: 패킷이 처리되거나 전송되기 위해서 큐에서 대기하는 시간
- Processing Delay: 라우터/스위치가 패킷 프로세싱하는데 걸리는 시간. 거리가 멀수록, 중간에 다수의 라우터/스위치 같은 장치를 통과해야하므로 프로세싱 지연도 증가할 가능성이 크다.

## DNS

The Domain Name System.

컴퓨터끼리 소통할 때는 IP주소로 서로 식별함.

클라이언트에서 주소창에 특정 도메인을 입력하면, 리소스를 요청해서 받아서 표시하기 위해서는 해당 리소스가 있는 웹서버에 연결하기 위해서 IP주소를 알아내야 한다.

이 주소를 가지고 있는 DNS Server들이 존재하고, 클라이언트에서 DNS 서버에 질의를 보내서 mapping되어 있는 IP 주소를 알아내야함.(DNS Query)

## Route53이 그래서 뭔데?

도메인 등록 및 hosted zone 생성 뿐만 아니라, 해당 도메인에 연결되는 리소스의 Health Check 작업이나 Traffic Flow 제어 등 작업도 같이 처리한다.

public domain name을 등록하면? public hosted zone이 생성되고, private domain name을 등록하면 private hosted zone(VPC) 이 생성됨

이 부분이 잘 이해가 안돼서 GPT 한테 물어봤음.

예를 들어서 Route 53에 myapp.com을 등록하면,

자동으로 아래와 같은 형식의 Hosted Zone이 생성된다고 함.

```yaml
Hosted Zone: myapp.com
└── A record: myapp.com → 192.0.2.10
└── CNAME: www.myapp.com → myapp.cloudfront.net
└── MX record: 이메일용 메일서버 주소
└── TXT record: 도메인 소유권 검증용
```

단순히 Routing을 규칙에 따라 처리만 하는게 아니라, 좀 똑똑하게 routing 시켜주는 기능들도 제공된다고 함.

- Failover기능을 제공해, health check를 통해서 primary destination에 문제가 있으면 secondary destination으로 연결
- Client의 위치를 이용해서 지리적으로 가까운 region으로 연결
- Latency를 고려해서 지연이 낮은 리소스로 연결
- Multivalue Answer라는, IP주소 몇개를 반환해서 기본적인 load balancer의 기능 수행
- Weighted routing이 가능해서, 리소스 A,B에 각각 트래픽을 정해진 비율(ex. 8:2)로 전달 가능
- 전달된 IP 기반으로 트래픽 routing가능


# CloudFront

CDN 서비스.

## CDN

예를 들어, 미국 특정 YouTube서버로 영상이 업로드된 상황을 가정해보자.

이 비디오는 전세계에 있는 `Edge location`이라고 부르는, 서버들에 전달되어서 캐싱된다고 한다.

이렇게 처리하면 사용자들은 각자 위치한 곳에서 가까운 곳의 `Edge Location`에서 해당 동영상 정보를 받을 수 있어서 퍼포먼스가 향상됨.

CDN은 이런 구조를 활용해서 퍼포먼스를 개선하는 메커니즘임.

## CloudFront에 대한 이해

CloudFront에서는 `Distribution`이라는 것을 생성함. 

이 `Distribution`안에는 origin이라고 하는, 실제 리소스가 어디에 위치해있는지에 대한 정보가 있음.

실제 리소스는 전세계에 퍼져있는 Edge Location이랑, Regional Edge Cache라는 서버들에 캐싱됨.

가까운 위치로 접속해서 리소스를 받아오니까 Latency가 줄어들어서 performance가 개선됨.

그리고 추가로, CloudFront를 사용하면 AWS가 관리하는 통신망인 AWS Global Network를 사용하므로 성능과 연결안정성이 향상됨.

## Lambda@Edge

사용자에게 가까운 위치에서 람다 함수로 데이터 처리가 가능토록 해주는 기능이라고 함. 재밌네.

약간 그 네트워크 시간에 배운 그거랑 좀 비슷한거같은데, 엣지 컴퓨팅? 사용자와 가까운 곳에서 데이터를 처리해서 네트워크 지연시간을 최소화하는 기술

CloudFront Cache 서버들에서 람다함수 실행해서 캐싱된 contents가 있으면 사용자 가까운 곳에서 람다함수 실행.

또한 이런 식으로 Origin과 User사이에 존재하는 Caching layer에서 람다함수 실행이 가능한 구조에서는, 필요하다면 람다 함수를 사용해서 사용자의 요청을 처리해서 Origin으로 전달하거나, 반대로 origin의 response를 특정 방식으로 처리해서 사용자에게 반환하는 식의 처리도 가능함.

## 보안 기능 제공

HTTPS, AWS ACM, AWS Shield/WAF, OAI 등 보안 수준을 강화할 수 있는 방법들을 제공함.
