# 가드레일?

AI 관련 프로젝트 진행하는데, 앞으로 가드레일을 추가할 예정이라는 이야기를 들었는데 정확히 뭔지 몰라서 한 번 찾아봤음.

# Bedrock Guardrails에 대한 내용

ai model이 민감정보를 오픈하거나, 부적절한(inappropriate라고 하는데 뭐가 Inappropriate한거야..?) 내용을 제공하거나 아니면 일관성 없는 답변을 하는 경우, 프로덕션 환경에서는 문제가 된다.

Amazon Bedrock Guardrails가 풀고자 하는 문제가 이런 문제들임.

Bedrock Guardrails는 다음과 같은 예방책을 제공

**1. content safety**

모델이 생성할 수 있는 컨텐츠 범위의 제한을 둘 수 있도록 함.

**2. Data privacy**

민감 정보 유출 방지

**3. Response Consistency**

동일한 tone으로, in consistent business parameter 범위 안에서 답변을 제공하는게 중요함. 내 브랜드(서비스)의 느낌과 비즈니스 역할에 맞춰서 일관된 답변을 제공하도록 함. (hallucination 발생여부 확인 포함)

# Guardrail이 애초에 필요한 근본적인 이유??

Machine Learning이 동작하는 방식이 fundamentally non-deterministic하기 때문에

전통적인 소프트웨어와 다르게 비결정적으로 동작한다. 동일한 input에 대해서 동일한 output이 보장되지 않음.

연관된 다음과 같은 이슈들이 발생함.

- hallucination
- falsehoods
- lack of correct structure
- prompt injection

근데 개발자 입장에서 이런 것들을 조정하기 위한 도구는 prompt 밖에 없다...

진짜? 진짜 프롬프트 밖에 없어??? 이건 다시 좀 고민해봐야할 부분인 것 같음(처음에 이 글을 작성했을 때 대비해서, AI 관련 다양한 자료들을 접하면서 조정할 수 있는 방법은 Software 2.0에 대한 지식을 기반으로 모델 자체를 좀 fine tuning 하거나 하는 방법도 있지 않을까 싶다.
