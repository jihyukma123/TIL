# RAG를 이해해보자.

RAG가 뭔지, 어떻게 동작하는지 관련된 개념과 기술들을 이해해보자.

# What is RAG?

[What is RAG (Retrieval-Augmented Generation)?](https://aws.amazon.com/what-is/retrieval-augmented-generation/?nc1=h_ls)

아마존 문서를 보자.

LLM 출력 결과를 최적화하는 과정.

- 뭘로? LLM을 훈련하는데 사용된 데이터 외의 검증된 knowledge base를 참조해서.

RAG를 통해서 LLM의 강력한 능력을 특정한 도메인이나, 조직의 내부 knowledge base를 기반으로 확장하는게 가능함.

장점은 모델을 다시 훈련시킬 필요가 없다는 점. 그래서 비용면에서 효율적임.

# 근데 왜 그렇게 중요해 RAG가?

LLM 챗봇등의 기반이 되는 가장 중요한 AI 기술.

근데 LLM기술의 특성 상, 생성되는 응답은 종종 예측 불가능함. 그리고 학습에 사용된 데이터 자체는 static하며, 특정 시점 이전의 데이터만 가지고 있다.

LLM은 다음과 같은 문제가 있음.

- 답을 모를 때 잘못된 정보를 제시함.
- 사용자가 구체적이고 최신 정보를 받고 싶은데 오래되거나 더 generic한 답변만 제공
- 공신력없는 출처 기준으로 응답 생성
- 다른 사항들에 대해서 동일한 개념을 사용하는 서로 다른 리소스들 때문에 개념을 혼동해서 잘못된 응답 생성

이러한 문제를 해결할 수 있는 방법 중 하나가 RAG임.

RAG를 활용하면 생성되는 텍스트를 좀 더 컨트롤 할 수 있고, 뭘 기반으로 생성되었는지 조금 더 잘 알 수 있음.

# RAG가 제공하는 이점

1. 비용면에서 효율적임.

챗봇 같은 걸 개발하는 것 기본적으로 foundation model을 사용함.

특정한 데이터를 기반으로 foundation model을 다시 훈련시키는 비용은 비쌈(computational + financial cost 둘다)

RAG는 비교적 적은 비용으로 LLM에 새로운 데이터를 제공할 수 있음.

2. 최선 정보 제공

RAG를 사용해서 LLM을 바로 SNS, 뉴스 등 기타 최신 정보 소스에 연결시킬 수 있음.

3. 유저 신뢰 향상

RAG는 출처를 제공할 수 있음. 출처가 되는 문서를 함께 제공해서 제공되는 정보 신뢰도 up

4. more developer control

개발자는 제공하는 서비스를 더 효율적으로 테스트하고 개선할 수 있음.

- 민감 정보 조회 권한에 따라 제한해서 정보 제공 가능.
- 특정한 질문에 대해서 잘못된 답변 제공 시 미세조정 가능함.

# How does RAG work?

RAG에서는 an information retrieval component가 있음.

이 컴포넌트는
