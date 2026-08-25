# aidlc v2 동작 방식 이해하기

로직이 섞여있어서 이해하고 사용하는게 좋겠다는 생각이 들었다.

## codex 상에서 $aidlc ~~해줘 하면...

대략 다음과 같은 흐름으로 전개된다고 함.

사용자 의도
-> Codex의 스킬 선택
-> aidlc skill의 SKILL.md에 명시된 forwarding loop 동작 (wtf is forwarding loop?)
-> orchestrate.ts 의 next(state + graph + flags)가 실행되어서 JSON directive 출력
-> LLM이 directive를 받아서 작업 수행
-> 검사/reviewer/사용자 승인 gate
-> orchestrate.ts report(outcome)
-> state/audit 갱신
-> 다음 next

일단 이번에 공부하는 건, 아예 처음 실행하는 경우임. (기존에 이미 활성 intent가 있는 경우에는 다른 동작 방식이 존재함. SessionStart hook에서 AIDLC WORKFLOW ACTIVE와 forwarding-loop 규칙을 모델에게 주입한다고 함.)

aidlc를 최초에 실행하면 '최초 실행 여부'가 next 실행 시 판단됨.
-> 간단하게 말하자면, '현재 active space에서 진행 대상으로 결정된 intent의 aidlc-state.md 파일을 찾을 수 있는지'를 검토해서 판단함


최초로 next()가 실행되었을 때 aidlc-state.md 파일이 없으면
- scope가 명시되거나 유추 가능한 경우 (`aidlc --scope feature ~~만들어줘`, `aidlc feature 인증 기능 만들어줘` 혹은 기타 로직에 들어오는 경우) -> 확실하게 지정한 경우에는 곧바로 `print directive` JSON 반환. 
- scope를 결정적으로 존재한다고 판단이 안되는 경우 -> 맞춤형 plan(scope)를 만들겠냐는 compose 제안
  - 승낙하면 LLM이 과제를 수행하는데 필요하다고 판단되는 custom scope를 만들어서 -> validator(결정적 로직)이 구조/의존성 검사 -> 사람 승인 -> 승인 시 workflow 생성

여기까지 오면 이제 

print directive에 적힌 `intent-create` 명령이 실행됨.


## 몇 가지 사실들

- next는 상태 전이를 유발하지 않는다.(read-only 라고 명시되어 있음)
- `print directive`: Conductor에게 "이 메세지에 적힌 내용을 그대로 수행해"라고 반환하는 명령 봉투
  - -> 근데 어차피 결정적인 명령을 출력할거면, why not 바로 실행..?
    - GPT가 생각하는 이유는, `next` 함수는 workflow state를 변경하지 않는다는 원칙(READONLY)를 가지고 있기 때문에, 이 함수의 역할은 '변경이 필요하다는 사실을 판단' -> 출력 -> Conductor가 명령 실행.
      - 그렇다면 출력한 메세지를 실행하지 않을 가능성에 대해서는..? 이조차도 LLM이 갑자기 미쳐서 그대로 실행하지 않을 수 있는데.
        - 안전장치들이 있다고 함.


## forwarding loop


- diretive.kind === done 이 될때까지 루프를 돌도록 LLM 프롬프트 (컨덕터)에 강제되어 있는 항목임.


## 상태 전이

상태 전이라는 말이 계속 나오는데, 이게 무슨 개념인지 이해하는게 critical 할 것으로 보임.

아마 `컴파일된 state graph와 scope grid`하고 관계가 있을 것 같기는 한데.


## 기타

AIDLC 설계 철학

LLM을 신뢰하지 않는다
→ 그렇다고 제거할 수도 없다
→ 판단이 필요한 곳에만 사용한다
→ 나머지는 도구가 제한하고 검증한다
→ 실수하더라도 상태와 증거가 거짓말하지 않게 한다
