# 들어가며..

새로운 프로젝트에 합류하면서 관련 문서를 읽어보는데, SE가 수행하는 역할 중에 Rerank가 있어서 무엇인지 알아보고자 한다.

KB에서 조회한 결과를 질의 내용에 따라 우선 순위를 결정하는 Rerank 알고리즘(연관도 검색, 키워드 검색, 혼합 검색 등) 알고리즘을 설계하고 개발하는 능력이 필요하다고 함.

# Reranking이 뭘까?

Reranking이란, RAG에서 쿼리와 관련해서 추출된 문서들을 한 번 더 재정렬 하는 것.

RAG를 더 정확한 문서를 기반으로 진행해서 답변 퀄리티 개선하는 것이 목적이라고 한다.

많은 경우에 기대보다 성능이 떨어지는 RAG pipeline을 개선하기 위한 가장 쉽고 빠른 해결책이라고 함.

# 문제 상황 파악

일단 뭐가 문제인지 알아보자.

문서기반 RAG를 수행하기 위해서, 여러 텍스트 기반 문서를 활용해서 semantic search를 수행함.

근데 이 문서가 엄청 많을 수 있기 때문에, 규모가 많을때도 빠른 검색을 수행하기 위해서 vector 검색 방식을 적용한다.

이는 텍스트를 vector로 변환해서 vector space에 저장하고(vector space의 한 점으로 저장된다고 함. ) 그래서 이 공간에서 특정 벡터들이 서로 얼마나 가까이 있는지를 측정해서 유사도 검색을 수행(의미가 비슷하면 벡터 공간에서 가까운 위치에 배치된다고 한다.)

이런 식으로 검색 속도를 위해서 벡터로 변환해서 검색할 수 밖에 없는데, 문제는 벡터로 변환 시 압축 과정에서 정보 손실이 발생하고, 이로 인해서 벡터 검색의 결과물 중 우리가 설정한 순위 내에 유의미한 정보를 담고 있는 문서가 없을 수 있음.(3번째 문서까지 반환하도록 했는데, 알고보니 5번째 문서에 연관성이 가장 높은 정보가 있다면..?)

제일 쉬운 방법은, vector search를 통해 받은 문서를 다 LLM에 유관정보로 던지는 것. 근데 LLM은 모델별로 context window limit이 존재해서 마냥 모든 문서를 같이 프롬프트로 먹일수가 없음.

게다가, 몇몇 최신 모델들은 엄청난 크기의 컨텍스트 윈도우를 제공하기 때문에 많은 양의 문서를 전달하는 것 자체는 가능하지만 그렇게 했을 때 LLM의 유의미한 답변을 생성하는 퍼포먼스가 떨어지는 경향이 있다고 함(lost in the middle)

문제를 요약해보면

- 문서를 벡터화해서 저장하는 이유는, 많은 양의 문서 pool에 대해서 semantic search를 수행하기 위함(빠른 검색을 위해서)
- 근데 벡터화하는 과정에서 텍스트를 벡터값으로 압축하면서 정보 손실이 발생하고,
- 이로 인해서 RAG를 위한 문서 retrieve할 때 가장 연관성 있는 문서가 내가 설정한 Top N개의 문서 안에 없을 수 있음.
- 그러면 그냥 검색된 문서 다 LLM에 때려넣으면 해결되는거 아니야?? 라고 생각할 수 있지만,
- 일단 LLM에 자체에 context window limit도 존재하고, limit이 크다고 해도 너무 많은 정보를 입력하게 되면 프롬프트를 기반으로 유의미한 답변을 생성하는 정확도가 떨어지는 문제 존재.
- 그러면 어떻게 LLM에 최대한 효율적인 양의 정보를 전달하면서도 유의미한 문서를 전달할 수 있을까?
- retrieve되는 문서 자체는 많이 가져오고, (maximize retrieval recall) 가져온 문서 중에서 LLM에 입력되는 문서는 최소화 해야함.(maximize LLM recall by minimizing the number of documents give to the LLM)

그리고 이 문제를 해결하기 위해서 Reranking이라는 방법을 사용한다.

# Reranker란?

Reranking을 구현하는 언어 모델.

검색 쿼리와, 문서 간의 관련성 점수를 계산하는 언어모델 유형임.

크고 복잡한 문서에 대한 쿼리를 처리해야 하는 경우에는 임베딩 기반 검색 후에 Reranker를 사용하는게 성능 개선에 도움이 됨.

Retriever -> Reranker 의 2단계 접근법이다.

- 이 2단계 접근법의 아키텍처? 간략한 순서는,
  - 1단계: Retrieving 순서로, 임베딩된 Document가 저장된 Vector DB에 대해서 Retriever를 통해서 Top K 문서를 검색하고,
  - 2단계: 1단계의 결과물인 Top K 문서들에 대해서 Reranker를 활용해서 순서 재정렬을 수행해서 연관도가 높은 문서가 검색에 잘 활용되도록 처리

왜 한다고..? `쿼리와 관련도가 높은 문서를 찾기 위해서`

근데 왜 two stage로 일반적으로 수행할까? 그냥 애초에 전체 문서를 유사도 기반으로 reranking해서 유사한 결과를 가져오면 되는거 아니야??

이는 처리 속도 때문이다. 많은 양의 문서에서 작은 규모의 문서를 Retrieve하는게 많은 양의 문서를 rerank하는거보다 훨씬 빠르기 때문에(Reranker는 느리고, retriever는 빠르다.)

## Reranking model

`Cross-encoder`로 알려진 이 모델은 쿼리와 문서가 주어졌을 때 유사도 점수를 반환하는 모델이다. 이 유사도 점수를 기반으로 쿼리에 연관도가 높은 순으로 문서를 재정렬함.

느리지만, 사용하는 이유는 임베딩 모델들보다 훨씬 더 정확하기 때문에.

임베딩 모델의 기저에 있는 동작방식인 `bi-encoder`의 경우 여러 문서의 의미를 하나의 벡터로 압축해서 의미손실이 발생해서 정확도는 떨어진다 그리고 임베딩 시점에 유저의 쿼리를 알 수 없으므로 유관정보가 부족함. 대신 빠르다.

# AdvancedRAG with Reranker

AdvancedRAG는 쿼리 관련 문서를 유사도 검색을 기반으로 검색하는 방법을 발전시켜서, 관련 문서를 더 정확하고 효율적으로 검색하여 답변 성능을 높인 RAG방식.

- 메타 데이터 추가, 데이터 구조화, 파인튜닝, Reranker, 프롬프트 컴프레션 등의 방법들이 있음.

# what makes Reranker models capable of what they aim?

어떤 학습 방식으로 훈련되었길래??

Retriever모델이 Bi-Encoder방식으로 학습되었다면,

Reranker는 `Cross-Encoder` 방식으로 학습된 언어 모델임.

Bi-encoder는 이름대로, 2개의 문서를 서로 다른 2개의 encoder를 이용해서 얻은 2개의 vector값을 비교해서 유사도를 구하는 방식.(질문과 문서에 대한 독립적인 임베딩을 활용해서 유사도를 비교하는 것)

`Cross-Encoder`의 경우, 문서A와 문서B를 하나의 encoder에 입력 후, dense layer를 통과시켜서 하나의 유사도 점수로 표현하게 됨

문서A가 사용자가 입력한 쿼리, 문서B가 해당 쿼리를 기반으로 retrieve된 문서라고 하면 이 둘 간의 유사도 점수를 뽑아낼 수 있고, 이 점수를 기준으로 retrieve된 문서들을 재정렬하면 된다.

질문과 문서를 동시에 분석해서 독립적인 임베딩 벡터 기반의 bi-encoder방식에 비해서 더욱 정확하게 유사도 측정이 가능함.

# Retriever와 Reranker

## 참고자료

[Reranker로 문서 검색 성능을 높이고 RAG에 활용하는 방법 | Cohere AI Reranker](https://www.youtube.com/watch?v=12QnGI2NkYQ&t=180s)
[Rerankers and Two-Stage Retrieval](https://www.pinecone.io/learn/series/rag/rerankers/)
[AWS기술블로그 - Reranker를 활용한 검색 증강 생성(RAG) 성능 올리기](https://aws.amazon.com/ko/blogs/tech/korean-reranker-rag/)

## lost in the middle 현상

[Lost in the Middle](https://medium.com/@simple0314/lost-in-the-middle-0313264b35d0)

N. Liu, K. Lin, J. Hewitt, A. Paranjape, M. Bevilacqua, F. Petroni, P. Liang, Lost in the Middle: How Language Models Use Long Contexts (2023)

이 연구에 따르면, LLM에 긴 프롬프트를 입력했을 때 특정 부분(중간 영역)에 해당되는 프롬프트의 정보에 대해서 LLM이 제대로 문장을 파악하는 능력이 현저히 떨어지는 점을 발견했다고 함.

이걸 lost in the middle이라고 부른다고 함. LLM이 프롬프트 안의 정보를 충분히 활용하지 못할 때.

특히 LLM성능 평가에서 긴 컨텍스트를 얼마나 잘 활용해서 답변을 생성하는지가 중요한 지표 중 하나라고 함.

이와 관련해서 다음과 같은 개념들이 있다고 한다.

- Lost in the Middle: 긴 입력 프롬프트의 중간 부분에 있는 정보를 모델이 효과적으로 활용하지 못하는 현상을 가리킵니다.
- Recency Bias: 모델이 입력 프롬프트의 후반부(최근)에 있는 정보를 더 잘 활용하는 경향을 의미합니다.
- Primacy Bias: 모델이 입력 프롬프트의 초반부(처음)에 있는 정보를 더 잘 활용하는 경향을 의미합니다.
- U-shaped Performance Curve: 모델의 성능이 관련 정보의 위치에 따라 U자 형태의 곡선을 그리는 현상을 설명합니다. 즉, 정보가 프롬프트의 시작이나 끝에 있을 때 성능이 높고, 중간에 있을 때 낮아지는 패턴을 의미합니다.
