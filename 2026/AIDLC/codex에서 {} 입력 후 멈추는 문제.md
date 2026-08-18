아래는 실제로 발생한 흐름과 제가 분석한 원인입니다. 결론부터 말하면, 문
제는 AI-DLC 자체가 멈춘 것이 아니라 제가 request_user_input 뒤에 같은
assistant 턴에서 후속 기록 도구를 호출한 데서 시작됐습니다.

정상 규칙은 이렇습니다.

aidlc-log.ts decision
→ request_user_input
→ assistant 턴 종료
→ 다음 사용자 턴
→ aidlc-log.ts answer 또는 aidlc-orchestrate.ts report
→ 다음 작업을 계속 도구 호출

제가 실제로 한 잘못된 흐름은 이랬습니다.

aidlc-log.ts decision
→ request_user_input
→ 같은 assistant 턴에서 aidlc-log.ts answer   ← 문제

aidlc-log.ts answer는 “질문을 낸 뒤 새 사용자 턴이 발생했는지”를 검사합
니다. 같은 assistant 턴 안에서는 그 조건이 충족되지 않아 다음 오류를 냈
습니다.

Refusing to record this answer:
a real human has not acted at this checkpoint this turn.

## 1. 요구사항 분석에서 처음 어긋난 지점

요구사항 Q1~Q3을 묻는 과정에서의 호출 순서입니다.

request_user_input(Q1, Q2, Q3)
→ 반환: Q1 사용자 입력, Q2=A, Q3=Other
→ questions 파일에 Q1/Q2 기록
→ aidlc-log.ts decision(Q1~Q3)     ← 질문 후에 기록함: 순서 오류
→ aidlc-log.ts answer(Q1/Q2)
→ 오류: 새 사용자 턴이 없다고 거부

여기서는 decision을 질문 전에 기록해야 했는데, 답을 받은 뒤에 기록했습
니다. 그래서 바로 뒤 answer가 “decision 이후의 새 사용자 답변”을 찾지
못했습니다.

그 뒤 Q3 보충 질문에서도:

request_user_input(Q3 보충)
→ 반환: “날짜, 수행 내용, 소요 시간, 완료 여부, 다음 작업”
→ 파일 갱신
→ aidlc-log.ts answer
→ 같은 오류

이때도 위젯 반환 직후 같은 턴에서 answer를 호출했습니다.

## 2. “첫 질문 묶음은 기록됐는데 두 번째 묶음이 안 됨” 현상

요구사항 Q4~Q6에서는 다음 흐름이었습니다.

aidlc-log.ts decision(Q4~Q6)
→ request_user_input(Q4~Q6)
→ aidlc-log.ts answer(Q4~Q6)
→ 성공

그런데 같은 assistant 턴에서 바로 Q7~Q8도 계속 실행했습니다.

aidlc-log.ts decision(Q7~Q8)
→ request_user_input(Q7~Q8)
→ aidlc-log.ts answer(Q7~Q8)
→ 오류: 새 사용자 턴이 없다고 거부

즉, 그 턴에서 감사 로그가 인정한 사용자 입력 기회가 Q4~Q6 기록에 사용된
뒤였고, Q7~Q8의 위젯 결과는 별도의 새 사용자 턴으로 인정되지 않았습니
다.

이 때문에 제가 확정을 다시 보내 달라고 했고, 그 다음 실제 사용자 메시지
에서 Q7~Q8 답변을 기록할 수 있었습니다.

## 3. answers: {}가 나온 시점

answers: {}는 정확히 두 번 나왔습니다.

  시점             호출                                  결과
━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━
  요구사항 분석    request_user_input(생성 전 통합 확    {"answers":{}}
                  인)
───────────────  ────────────────────────────────────  ────────────────
  정교화 목업      request_user_input(다음 작업 메모)    {"answers":{}}

첫 번째는 이 호출입니다.

aidlc-log.ts decision(
  checkpoint=summary-confirmation
)
→ request_user_input(
  “이 내용이 맞으면 요구사항 문서를 생성하겠습니다”
)
→ 반환: {"answers":{}}

그 뒤 당신이 확인이라고 직접 입력했고, 다음 호출은 정상 성공했습니다.

파일에 [Answer]: Looks correct 기록
→ aidlc-log.ts answer(
  checkpoint=summary-confirmation,
  details=Looks correct
)
→ 성공: SUMMARY_CONFIRMATION_RECORDED

두 번째도 동일합니다.

aidlc-log.ts decision(
  “다음 작업에 추가할 메모가 있나요?”
)
→ request_user_input
→ 반환: {"answers":{}}

당신이 아니 없어라고 직접 입력한 뒤:

aidlc-log.ts answer(details="Nothing to add")
→ 성공: QUESTION_ANSWERED

따라서 {}가 나온 뒤의 직접 입력은 정상적으로 처리됐습니다.

## 4. 목업 단계에서 반복된 이유

정교화 목업에서도 같은 패턴을 반복했습니다.

사용자: guide me
→ aidlc-log.ts answer(Guide me) 성공
→ aidlc-log.ts decision(Q1~Q3)
→ request_user_input(Q1~Q3)
→ 같은 턴에 aidlc-log.ts answer(Q1~Q3)
→ 오류

그래서 계속을 다시 요청했습니다.

그 다음에는:

사용자: 계속
→ aidlc-log.ts answer(Q1~Q3) 성공
→ aidlc-log.ts decision(Q4~Q5)
→ request_user_input(Q4~Q5)
→ 같은 턴에 aidlc-log.ts answer(Q4~Q5)
→ 오류

그래서 또 확정을 요청했습니다.

즉, {} 때문에 반복한 것이 아니라, “한 assistant 턴에서 질문 묶음을 두
번 이상 처리하려 한 것”이 반복 원인입니다.

## 정확한 수정 방법

앞으로는 질문이나 승인마다 다음 흐름만 사용해야 합니다.

1. aidlc-log.ts decision
2. request_user_input
3. 즉시 assistant 턴 종료

4. 다음 사용자 메시지 수신
5. aidlc-log.ts answer 또는 aidlc-orchestrate.ts report
6. 다음 작업을 계속 실행

request_user_input이 선택값을 즉시 반환하더라도, 그 반환값으로 같은 턴
에 answer를 호출하지 않아야 합니다. 그 값은 화면 표현용 결과일 뿐, AI-
DLC 감사 로그가 요구하는 “후속 사용자 턴”과 항상 동일하지 않았습니다

 이 문제가 시작된 가장 큰 원인은

  {}이 입력으로 전달되어서 그런거야?


• 아니요. 가장 큰 원인은 {}가 아닙니다.

  핵심 원인은 제가 request_user_input 뒤에 assistant 턴을 끝내지 않고, 같
  은 턴에서 곧바로 aidlc-log.ts answer와 다음 질문을 실행한 것입니다.

  {}는 위젯이 선택 결과를 전달하지 않은 두 사례일 뿐입니다. 그 경우에는
  당연히 멈춰야 했습니다.

  반면 대부분의 중복 멈춤은 위젯이 실제 선택값을 반환한 경우에도 발생했습
  니다. 그 선택값을 받은 직후 같은 턴에서 답변 기록을 시도하자, 감사 로그
  가 “질문 이후 새 사용자 턴이 없다”고 거부했습니다.


----

원인을 이해하는 과정에서 ai dlc 규칙과 동작 방식을 더 잘 이해할 수 있을 것으로 보임.

+ Terra 모델을 사용하면 이런 문제가 발생한다는 점을 알아내는 것도 의미가 있을지도?
