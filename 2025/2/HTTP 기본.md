# 웹어플리케이션 구조 관련

[An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

## Web Server

웹서버 - a `computer` that hosts the website on the internet

host - web server(the computer) making the website available and accessible on the Internet.

hosting을 위해서 필요한 요소들

- Storage: website파일을 저장하기 위한 storage가 필요
- Accessibility: 접근 가능한 public IP 주소가 있어야 하며, 24/7 인터넷에 연결되어 있어야 함
- Serving: 웹브라우저를 통해서 전송되는 클라이언트 요청을 수신하고, 그에 따른 응답을 반환할 수 있어야 함.(웹페이지 반환)
- Management: Server가 계속 돌아가도록 관리하고, 메모리/CPU 등 리소스 관리 및 보안 유지가 필요

website를 웹서버(컴퓨터)가 `hosting`한다는 것은 위와 같은 일들을 해당 컴퓨터가 수행한다는 뜻.

웹서버는 하드웨어와 소프트웨어로 구성되어서 클라이언트의 HTTP요청을 처리한다.

## HTTP

HTML 문서와 같은 리소스를 가져올 수 있도록 해주는 `프로토콜`

- 웹에서 이루어지는 모든 데이터 교환의 기초
- 클라이언트-서버 프로토콜로, 이는 수신자인 클라이언트 측에서 요청이 시작된다는 뜻.

클라이언트와 서버는 단일 메세지를 교환하는 형식으로 통신한다. (이와 반대되는 개념은 stream of data)
-> stream of data를 교환하는 형식으로 통신하는 프로토콜의 예시가 WebSocket. 클라이언트와 서버 간 연결을 지속시켜서 실시간 데이터 교환.

**HTTP 기반 시스템의 구성요소**

user-agent(혹은 user-agent를 대행하는 proxy)에 의해서 요청이 전송된다. 대부분의 경우에 user-agent는 웹브라우저이지만, 무엇이든 될 수 있음.

각 개별 요청은 서버로 전송되어서 처리되고 `response`라고 부르는 응답으로 제공된다.

클라이언트와 서버 사이에는 다양한 개체들이 있는데 이를 합쳐서 `proxy`라고 통칭한다. `proxy`는 게이트웨이나 캐시 등 다양한 역할을 수행함.

웹서버

- 가상적으로는 단일 머신으로 보이지만, 실제로는 여러 서버가 부하를 분산하는 구조(로드밸런싱)이나, 다른 소프트웨어(캐시, DB서버 등)일 수 있음.

프록시

- 웹브라우저와 서버 사이에는 여러 컴퓨터/머신들이 HTTP 메세지를 이어서 전달함.
- 대부분은 전송/네트워크/물리 계층에 속해서 HTTP 레이어에서는 보이지 않음. 이 중에서 Application계층에서 돌아가는 컴퓨터들을 프록시라고 한다.
- 캐싱, 필터링, 로드 밸런싱, 인증, 로깅 등 다양한 역할 수행할 수 있음.

**HTTP의 기본적인 특성들**

1. HTTP is simple

간단하고 사람이 이해하기 쉽도록 고안되었음. (HTTP/2에서 )

2. HTTP is extensible

HTTP/1.0에서 제안된 `HTTP headers` 덕분에 이 프로토콜은 쉽게 확장하고 실험가능함.

클라이언트-서버 간 새로운 header semantic에 대해 상호합의해서 새로운 기능을 추가하는 것도 가능함.

3. HTTP is stateless, but not sessionless

stateless - 서로 다른 두 요청이 서로 관련이 아예 없음. 각 요청은 독립적인 개별적인 요청이다.

그래서 stateful한, 어떤 persist된 데이터를 기반으로 HTTP 소통을 하기 위해서는 세션과 같은 state를 보관할 수 있는 개념이 필요하다.

4. HTTP and connections

네트워크 연결 자체는 transport layer에서 control 된다. 즉 네트워크 연결 자체는 HTTP의 범위 밖에서 존재한다.

사실 HTTP는 밑에 깔려있는 전송 프로토콜이 꼭 연결 기반(connection-based?)일 필요가 없다. 그냥 전송 프로토콜이 안정적이라는 것만 요구사항이다. (메세지가 소실되지 않도록) 그리고 가장 흔한 전송 프로토콜 2가지 (TCP, UDP) 중 UDP는 안정적이지 않고 TCP는 안정적이다.

클라이언트와 서버가 HTTP 요청/응답을 짝으로 교환하기 전에 클라이언트-서버 간 TCP통신이 성립되어 있어야 한다. (이를 위해서는 several round trips가 요구된다고 함)

HTTP/1.0 -> default behavior가 각 HTTP 정보 교환마다 별도의 TCP 연결을 열어서 처리 -> 여러 요청이 단시간에 전송되는 경우, 비효율적 -> 이를 보완하기 위해서 HTTP/1.1에서 pipelining/persistent connection 방법을 도입하고자 함.

HTTP/2 는 더 나아가서 메세지를 하나의 연결 상에서 multiplexing 해서 안정성과 warm(을 높였다.)
-> warm이 뭐임?

지금도 HTTP를 위해서 더 나은 전송 프로토콜을 만들기 위한 시도들이 진행되고 있음 (구글의 UDP 기반 QUIC)

## What can be controlled by HTTP(더 구체적으로 공부가 필요)

HTTP로 통제할 수 있는 일반적인 기능들

- Caching

- Relaxing the origin contraint:

- Authentication

- Proxy and tunneling

- Sessions

## HTTP 메세지의 구성

**Request**

메서드, HTTP 프로토콜 버전, 리소스 경로, 헤더(optional), body(POST와 같은 몇 메서드에서 리소스 전송을 위해서 사용)

**Response**

HTTP 프로토콜 버전, Status code, status message, HTTP header, body(optional)

## 요약...

HTTP는 헤더를 추가하는 구조를 통해서 확장되고 성장하고 있는 웹의 capability와 함께 지속적으로 성장해나갈 수 있음.

쉽고 확장성 있으며 사람이 이해하기 쉬운 프로토콜이다.
