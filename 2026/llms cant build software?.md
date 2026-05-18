# [Why LLMs Can't Really Build Software](https://zed.dev/blog/why-llms-cant-build-software)



## 통상적으로 소프트웨어 개발하는 방법은?

software engineering loop is...

요구사항이 주어지면
- 요구사항에 대해서 build a mental model
  - building a mental model means...요구사항을 처리할 수 있는 코드 작성하기 전에 미리 구조나 데이터 흐름에 대해서 잡아보는 것
- write code that does that(hopefully)
- bulid a mental model of what the code actually does
- identify the diff and update the code to meet the mental model that corresponds to the requirements

effective engineer라면? 명확한 mental model 을 가지고 개발작업을 수행함.

## LLM이 코드를 작성하는 방식은 어떻게 되는지?

LLM은코드 잘쓰고, 테스트 잘 쓰고, 코드 업데이트 하거나 버그픽스도 잘함

근데 잘 못하는게 무엇인지?
- maintain clear mental models

뭐가 잘못되면, 뭘 어떻게 해야되는지도 모르고 다시 처음부터 하고 이런 경우가 많음.

근데 보통 개발자들은, 물론 시행착오를 겪고 중간중간 다양한 의사결정을 해야하지만, 그 과정에서 문제 자체에 대한 더 명료한 이해를 얻어감.

근데 LLM은? 시행착오를 반복했다고 해서 그것이 어떤 'better understanding of the problem'이 되지가 않음. 

왜냐하면 매 iteration이 새로우니까. 물론 이를 보완할 방법들을 찾을 수 있겠지. 이전 loop의 처리 결과를 산출물로 만들어서 next loop에서 참조하게 하면 어느정도 보완은 되겠지만, innate 하게 문제와 문제를 해결하기 위한 Mental model & understanding이 깊어지고 확장되는 구조는 아니라는 점.

## 나아지지 않을까?

모델 성능이 개선되면 다 해결될 문제가 아닌지?

저자는 동작원리 상 그렇지 않을 가능성이 크다고 보는 것 같음

사람은, 문제에 직면했을 때 동적으로 context switch 해서 context focus의 범위를 조절하는 것이 가능함 자연스럽게

문제에 집중했다가 다시 보다 큰 범위의 작업으로 context focus out 하고 이런 것들이 가능한데, LLM은 왔다갔다 하는게 안되니까...

심지어 context 크지 않아도, llm 들은 사람처럼 clear한 mental model을 유지하는 것을 방해하는 기술적인 한계들이 존재함

- context omission
- recency bias
- hallucination

memory 같은 개념들을 추가해서 이런 문제를 해결해보려고 하고 있으나 여전히 llm들은 'really understand what is going on'인지 이해하지 못함.

2개의 비슷한 Mental model (요구사항에 대한 Mental model과, 실제 작성한 code에 대한 mental model)을 동시에 머릿속에 유지하면서, 차이점을 인식해서 코드를 고칠지, 아니면 요구사항 수정에 대해서 사람과 논의해야될지 결정하는 등의 일련의 작업을 하지 못하기 때문에....LLMs cannot build software...
(근데 이 정도는 할 수 있지 않나?)

## 그래서?

developer는 LLM이 기반으로 코드를 작성하게 될 요구사항이 clear하도록 만드는 것이 더욱더 중요하고, 

이 부분은 llm에 위임하면 안된다.

building a clear mental model of how to implement the requirement가, 여전히 developer의 역할이고 무엇을 만들지에 대한 영역이 사실 더 중요하니까 당연히 developer가 driver, llm is a tool

llm이 아직 driver가 되지 못한다는 점.

## 기타 질문들

- llm이 driver가 되는 것은 어떤 느낌일지?
- 진짜 안되나??
  - 이 문제를 어떻게 gap을 좁혀서 갈지?
