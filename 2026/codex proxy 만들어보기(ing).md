# Codex proxy 만들어보기.

Codex cli에서 default mode 에서 AIDLC를 돌릴 때, 사용자에게 질문을 할 때 기본으로 config.toml 파일에 `default_mode_request_user_input = true` 설정이 있어서, default 모드에서 aidlc 를 돌려도 사용자에게 표시가 되는 이슈가 있음
(question-rendering.md 라는 파일이 있는데, 이 파일의 codex 버전에 default_mode_request_user_input 사용하도록 권장되어 있음. 원래 시간 설정하는 옵션은 설정하지말라는 내용도 있었는데 쓸모가 없어서 제거된듯....동작을 안함 ㅎ)

그래서 이거를 해결할 수 있는 방법을 찾아봤는데, post/preToolUse 훅을 써서는 완전히 터미널 프로세스를 통제하지 못하는 문제가 있어서 그렇게는 해결이 안될 것으로 보임. (왜 정확히 안된다는 건지에 대해서도 이해해보면 이 도구들이 동작하는 방식에 대해서 더 잘 알 수 있을 듯.)

그래서 해결 방법이 남은게...
- 설정을 주지 않고 다른 방식으로 표시되는 UI를 사용하기 -> 근데 이거 불편할 것 같은 느낌이 좀 있는데.
- codex cli로 하는 경우 proxy를 설정해서 codex app server에 입력되는 메세지에서 필요한 데이터를 추가/제거해서 전달한다.
- 기다린다? ㅎㅎ

그래서 일단 2번 방법으로 한 번 구현해보려고 함.

왜냐하면 그냥 재밌으니까?ㅋㅋㅋㅋㅋ

사실 쓸모는 없을지도 몰라.

## 이왕 하는 김에 공부도 좀 해보자.

만들려는 프로그램이 동작하는 방식에 대해서 먼저 이해를 좀 해보자.

이왕 하는거 codex app server를 활용해서 뭔가를 만들어보는거기도 하고.

## 터미널에서 실행할건데...입력받는 `쉘 프로세스`?

ghostty와 같은 터미널 프로그램을 실행하면, 보통 `shell process`를 실행한다고 함.(ex. zsh)

shell -> command interpreter inside my terminal. the program that reads what I type and runs it.

고스티켜면 보통 그 안에서 설정된 기본 쉘 프로세스를 실행함.
-> macOS의 경우 보통 zsh를 쓰는 경우가 많고, zsh는 내가 입력한 명령어를 해석하고 실행함.

`ls`를 입력하면 -> `ls`라는 프로그램을 zsh가 찾아서 실행하고 ls가 파일 목록을 OS에 요청해서 결과를 출력함.

## 터미널은 그러면 뭐여?

어차피 터미널 켜면 바로 shell process가 실행되는데 그러면 터미널의 역할은 뭐여?

**명령어를 해석하고 실행하는 프로그램이 사용자와 상호작용할 수 있도록 해주는 환경** 그러니까, 뭔가 입력하고 출력을 볼 수 있게 해주는 환경이 제일 큰 역할임.

## 그래서 코덱스 나눠서 실행하는건 뭔데

그냥 codex 실행하면, TUI에서 바로 그냥 로직 실행(사실 아직 이게 정확히 뭔지는 모르겠지만)

근데 codex --remote 옵션을 주면, remote-server가 있을거라고 실행하고 해당 shell에서는 TUI만 실행됨. -> 그리고 localhost에 app-server가 띄워져있을 port에 연결하는 형태

그러면 실제로 로직을 처리하는 app server는 별도 process로 다시띄워놔야함.

fe-be 구조가 되는 느낌.

```
TUI = 프론트엔드 역할
- 화면 표시
- 키보드 입력
- 승인/질문 UI

App Server = 백엔드 역할
- Codex 작업 실행·상태 관리
- 모델/도구/명령 처리
- 이벤트 전송

그리고 둘이 약속된 App Server 프로토콜(JSON-RPC)로 통신

TUI  ⇄  JSON-RPC over WebSocket  ⇄  App Server
```

다만 TUI에서 app server가 떠있을거라고 예상하는 port로 연결하는 구조이지, app server가 떠있는 서버인지 확인하거나 하는 형태가 아니라서, (애초에 의도된 분리인듯?)

port를 proxy로 돌리고, proxy가 app server에 전달하는 구조로 실행하는것이 가능함.

그러면, proxy에서 메시지를 받아서 중간에 request_user_input 의 실행시간이 그렇게 되지 않게도 할 수 있음.

가능하지.

이런 소리였구나 재밌넹.
