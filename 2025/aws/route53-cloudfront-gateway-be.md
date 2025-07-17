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
