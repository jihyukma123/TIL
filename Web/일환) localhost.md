# 내가 일하는 환경 이해하기 시리즈 - localhost란?

사이드 프로젝트(FE BE DB 풀스택 경험을 위한)하고 있는데, postgresql이 어떻게 내 컴퓨터에서 실행되고 있는지 몰라서 생각하다가 문득, react app은? fastapi app은?

습관적으로 npm run dev를 실행해서 브라우저 상에서 localhost:5713 으로 접속해서 개발을 하긴 하는데, 무슨 일이 진행되는건지 어떻게 이게 가능한지 생각해본적이 없는데 몰라서 한 번 찾아봄.

## 127.0.0.1

특별한 IP 주소임.

컴퓨터 네트워킹 표준에 의해서 `loopback address`로 지정되어 있음.(loopback -> 다시 돌아온다는거지.)

원래 어떤 IP주소로 요청을 보내면, OS가 해당 데이터를 NIC(network interface card, 랜카드라고 부르는 친구)를 통해서 외부 네트워크로 전송함. (그리고 라우터 등등을 거쳐서 목적지 컴퓨터에 요청이 도착하는 구조)

근데 `127.0.0.1`으로 요청을 보내면, OS가 외부로 보내지 않고 소프트웨어적으로 바로 내부로 돌려보냄.

아하 그래서 마치 내 컴퓨터가 client이자 server의 역할을 수행하는거구나.

client(거의 대부분의 경우 브라우저지?)에서 `127.0.0.1:5173`, `127.0.0.1/8000`으로 요청 보냄 -> 외부로 내보내지 않고 내부로 돌려보냄 -> 내부의 5173, 8000번 port에 listen 중인 앱으로 연결 -> vite앱이 react resource를 반환하거나, uvicorn이 요청을 받아서 연관된 fastapi 기능을 실행하거나 등등..

싱기방기.

## 근데 왜 127.0.0.1 == locahost?

`호스트파일`이라는 존재 때문에 그렇다고 함. 컴퓨터가 도메인 네임을 IP주소로 변환할 때 **가장 먼저** 확인하는 파일

DNS질의하기 전에 이 파일부터 확인한다고 함.

내 컴퓨터 호스트파일을 확인해보니 다음과 같음

```
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost  -> 아하! localhost가 127.0.0.1로 mapping 되어 있네!!
255.255.255.255	broadcasthost
::1             localhost
```

`const`가 JS 예약어인것처럼, `localhost`/`127.0.0.1`도 일종의 OS단에서 사용되는 예약어라고 생각하면 되는 것 같음.

## vite...fastapi...postgresql....

로컬에서 react app, fastapi app, postgresql app을 동시에 돌리는 것에 대해서 조금 더 이해가 됐음.

## 조금 더 나아가서...

vite로 react 앱을 띄우면 왜 브라우저에서 볼 수 있냐?

일단 vite가 내부적으로 개발 서버를 띄우고, port 5173에 listen 하도록 연결함.

근데 5173 port을 어떻게 listen 해? os에 요청하는거야?
-> 일단 프로그램은 직접 하드웨어 제어할 수 없기 때문에 OS의 도움을 받아야 함. vite개발 서버가 시작되면, 내부적으로 작성된 코드(nodejs의 http 모듈을 쓸거라고 gemini는 추정함.)로 OS에 system call을 보냄(localhost의 5173으로 들어오는 연결 내가 받을래!!) -> OS는 요청 받아서 5173 사용중인지 확인하고, 사용 중이 아니라면 vite에 bind하고 네트워크 요청을 vite 서버로 전달하도록 설정.

궁금해서 gemini한테 vite가 어떻게 system call하는지 알아봤더니, nodejs의 http 모듈을 활용해서 createServer하고 있는거같음. 신기하네.

아래와 같은 코드로 간단하게 특정 port를 열어서 들어오는 http 요청을 처리하는것도 가능했음. 싱기방기.

nodejs의 http 모듈은 또 뭐 C++을 사용해서 뭐 system call을 하고 한다는 뭐시기저기기가 있는데 그건 또 언젠가 다음에....

```javascript
// 1. 'http' 모듈을 불러옵니다.
const http = require("http");

// 2. 서버가 기다릴 호스트와 포트 번호를 설정합니다.
const hostname = "127.0.0.1"; // 또는 'localhost'
const port = 3000;

// 3. 서버를 생성합니다.
const server = http.createServer((req, res) => {
  // 요청(req)에 대한 응답(res)을 설정합니다.
  // 상태 코드 200 (OK)과 Content-Type 헤더를 보냅니다.
  res.writeHead(200, { "Content-Type": "text/plain" });

  // 클라이언트에게 보낼 응답 내용을 작성하고 연결을 종료합니다.
  res.end("내가 생성해본 서버 히히.\n");
});

// 4. 서버를 'listen' 상태로 만듭니다.
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
