# [Replacing Humans with AI is Going Horribly Wrong](https://www.youtube.com/watch?v=QX1Xwzm9yHY)

현재 사람들이 AI라고 부르는 LLM의 근본적 한계

Prompt -> TNN(Transformers Neural Network) -> Output 구조로 응답이 생성됨.

근데 이게 동작하는 방식이, 단어간 연관성을 측정해서 다음 단어를 예측하는 구조인데, 이 구조 상 hallucination이 발생함

[OpenAI admits AI hallucinations are mathematically inevitable, not just engineering flaws](https://www.computerworld.com/article/4059383/openai-admits-ai-hallucinations-are-mathematically-inevitable-not-just-engineering-flaws.html)

# hallucinations and real-world consequences

AI에게 어떤 작업을 시켰을 때 일정 확률로 할루시네이션이 필연적으로 발생한다고 하면, 무슨 문제가 있을까?

AI에게 시킨 작업의 중요도가 높다면?(Accurate해야만 한다면?)

뭘 만들어냈는지 모름 -> 뭐가 정확한지도 모름 -> 결국 인간이 전수조사 하지 않으면 어디에 뭘 만들어내서 데이터를 생성했을지 알 수 없음.
(애초에 사람이 했으면 한 번으로 끝날 일인데 결국 다시 또 사람이 봐야해서 리소스 낭비가 발생함)

실제로 의사결정권자들이 AI에 대한 과도한 믿음을 가지고 업무 자동화나 AI 도구 도입을 지시한 후에 실무자들이 이로 인해서 오히려 업무량과 고통이 늘어나는 사례가 많다고 함.

그리고 데이터가 무조건 완벽해야 되는 분야(ex. Medical)에서는 더욱더 AI를 활용한 자동화를 믿을 수 없음.

그리고 줌미팅 요약을 잘 하기는 하는데, 내용을 만들어내는 경우가 많다고도 함.

LLM은 결국 확률적으로 다음 단어를 예측하는 시스템일 뿐, 본질적으로 내 의도를 '이해'하고 답변하는게 아니기 때문에 모르면 모른다고 하지 못함.

사람들 AI로 대체한 것을 55%의 회사들은 후회한다는 연구도 있음. (챗봇을 만들어서 상담팀을 해고했는데 너무 개판이라 다시 사람을 재고용한 케이스도 존재...)

# 그러면 제대로 비즈니스 가치를 창출하는 회사들은 HOW?

95%는 별 가치를 못느끼고 있지만, 몇몇 회사는 `really excelling with generative AI`

이들의 성공 비결을 이렇게 분석함.

- 하나의 페인포인트를 잡아서
- 제대로 해결하고
- 본인의 프로덕트를 쓰는 회사들과 현명한 협업관계를 구축함

# 닷컴버블과 AI hype를 비교해보자.

현재 (긍정적인) 미래에 대한 예측은..

AI가 비용의 40%를 감축하는 효과를 창출하는 것.

하지만 몇 가지 시나리오를 보자.

## AI가 계속 이 정도 수준의 성능으로 쭉 가는 시나리오

- 비즈니스 리더들이 조만간 AI가 발생시키는 문제 대비 가져다주는 효용이 작다고 느낄 가능성이 높음..
- LLM을 통해서는 AGI를 달성할 수 없다는 것을 인정해야함.
- 대중이 LLM에 대해 익숙해지고 지겨워짐..(hype 사망)
- 투자금 다 쓰고 망..(OpenAI가 데이터센터 등 운용하는 비용 대비 수익이 안나옴 지금도)
