# CLI 환경에 대한 이해

gemini cli, codex cli, opencode와 같은 도구들 사용 중이고 앞으로도 더 잘 활용하기 위해서 이런 저런 노력들을 해야될 것 같은데 막상 cli 가 뭔지도 잘 모르고 쓰고 있어서 약간의 병목이 있을 수 있겠다 싶었음

왜냐하면 cli 도구들이 agent skills를 어떻게 동작하도록 만들었는지 궁금해서 보고 싶은데 코드를 어떻게 이해해야 하는지 아예 감이 안옴.

## 터미널에서 명령어를 입력한다는 것의 의미

모든 cli tool은 터미널에서 해당 tool을 호출하는 것부터 시작할 것 같은데, 이 때 무슨 일이 발생하는건지 궁금함.
(뭘 해야지 여기서 호출되어서 내가 만든 코드가 terminal 환경에서 돌아가는지?)

터미널은 글자를 보여주는 창이고, 실제로 명령을 입력받는 주인공은 shell(zsh, bash)라고 함.

사용자가 명령어를 치면, shell은 이를 문자열로 받아들여 분석하기 시작함.

- 구문 분석(parsing): 어디까지 명령어인지, 어디까지 옵션인지(-f) 인자인지('hello')인지 구분
- 별칭 확인: 사용자가 미리 설정한 단축어(alias)가 있는지 확인

그래서 이 명령어를 실행하기 위해서 PATH 변수 탐색해서 일치하는 프로그램을 찾음

그래서 일치하는 친구를 찾으면 실행하는거임.(ls든, gemini건 둘 다 프로세스가 실행되는거라고 함, ls 같은건 short-lived일 뿐...)

부모 프로세스(내가 gemini를 입력한 shell)은 아래에서 잠시 대기 중인 상태에서, 자식이 전면에 나서서 실행되는 형식

대기 모드라는 것은, `wait()`라는 system call을 호출해서 다음 명령어를 띄우지 않고 기다리는거고,

입출력을 자식 프로세스(gemini)에게 양도해줌

-> nodejs 기반 cli 인 경우, node process가 실행되어서 프로그램이 실행되는 것

### shell이란?

사용자와 운영체제의 심장부인 **Kernel** 사이를 연결해주는 '번역기'라고 생각할 수 있음.

내부적으로 system call을 이용해서 kernel에 작업을 전달하는 거임.

kernel이 알맹이라는 의미라고 함. 그래서 shell(껍데기)는 이 알맹이를 감싸고 통로 역할을 하는 존재같은 의미임.

그리고 bash, zsh는 둘 다 쉘의 한 종류임

bash는 linux의 기본 쉘로 오랫동안 사용되어 왔음. 어디에나 있지만 사용자 편의 기능이 좀 부족할 수 있음.

zsh = z shell은 bash기반으로 사용자 편의 기능을 추가한 버전임

oh my zsh와 같은 프레임워크 붙여서 터미널 이쁘게 만들고 이런게 됨(요즘 macOS의 기본 쉘이라고 함)

사용자로부터 하드웨어까지의 흐름은 다음과 같습니다.

- 사용자 (User): "이 폴더로 가서 파일을 실행해!" (의도)
- 쉘 (Shell / 껍데기): cd /app && ./run (명령어 입력 및 해석)
- 시스템 콜 (System Call / 통로): chdir(), execve() (커널에 공식 요청)
- 커널 (Kernel / 알맹이): CPU와 메모리를 조율하여 실제 작업 수행 (실행)
- 하드웨어 (Hardware): 전기가 흐르며 데이터가 물리적으로 저장/연산됨

### PATH 환경변수

`echo $PATH` 하면, 아래와 같은 문자열이 나옴

```bash
/Users/jeff/.opencode/bin:/Users/jeff/.bun/bin:/Users/jeff/.antigravity/antigravity/bin:/Users/jeff/Library/pnpm:/Users/jeff/.local/bin:/Users/jeff/.rd/bin:/Users/jeff/.nvm/versions/node/v20.19.3/bin:/Users/jeff/.pyenv/shims:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Applications/Ghostty.app/Contents/MacOS
```

사용자가 shell에 입력한 명령어로 인식한 값을 이 경로에서 매칭되는 명령어/프로그램을 찾는다고 함. (여기 경로 하나하나 탐색하면서 있으면 그거 실행하고 없으면 not found error)

기억해둘만한 점은, 순서가 있어서 PATH에서 nvm/pyenv 경로가 시스템보다 앞쪽에 있으면 그걸 먼저 참조해서 사용됨

`~/.zshrc` 파일에 작성되어 있는 내용을 토대로, OS가 부팅되면 이 파일을 읽어서 메모리에 올려서 사용하는거임. 그래서 파일에 저장해야됨 아니면 날라간다.

지금까지 특정 프로그램들을 설치하면, 간혹 instruction에 `~/.zshrc` 파일에 뭐 추가하고 `source ~/.zshrc` 하라는 경우들이 있었는데 이제 이해가 좀 되네

그냥 따라했었는데 히히

파일에 추가하는건 설치한 경로를 PATH변수에 등록될 수 있게 값을 추가하는거고, (아래에 작성할 수록 먼저 탐색된다고 함 변수 앞쪽에 붙어서)

source 명령어는 쉘에 특정 스크립트를 로드해서 실행하는 명령어라고함

그래서 zshrc파일을 다시 읽어서 PATH변수 업데이트 해주는거임(껐다 켜도 동일한 효과)

## 터미널에서 명령 입력 시, nodejs 프로그램이 실행된다는 게 무슨 소리지?

> At the most fundamental architectural level, the Gemini CLI is indeed a REPL (Read-Eval-Print Loop) application running on Node.js, just like your script.

내가 익숙한 터미널 환경에서 node로 실행하는건 단일 javascript 파일임

node test.js 이런 느낌으로 근데 gemini라고 해서 실행하는 프로그램이 그거랑 근본적으로 동일하다고 함.

## 간단한 CLI 프로그램 만들어보기

ink라고 react로 cli 프로그램 만들 수 있는 라이브러리 있어서 만들고, npm link로 실행하니까,

`my-cli` 같은 커스텀 명령어로 바로 간단하게 만들어볼 수 있었음.(gemini cli 도 ink로 만들었다고 하네 )

이런 식으로 동작하는거구나.

출력이 이쁘게 구성된, terminal에서 돌아가는 nodejs 프로세스구나.

오케이 이해했어.

JavaScript 파일들이 agent 명령어 실행 시 뭘 어떻게 처리하는지를 좀 이해해보면 opencode의 agent 나 skills 같은 명령어 기반 workflow 동작 원리를 좀 더 들여다볼 수 있겠네.
