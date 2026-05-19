# The agent loop

[OpenAI - Unrolling the Codex agent loop](https://openai.com/index/unrolling-the-codex-agent-loop/)

---

**agent loop**: the core logic in Codex CLI that is responsible for orchestrating the interaction between the user, the model and the tools the model invokes to perform meaningful software work.

Agent가 사용자 질의를 처리하는 과정 간단하게 살펴보면,

- agent takes input from the user
- (inference)query the model and ask for response
- inference result is either
  - (1) final response
  - (2) tool call request
    - in this case, the 'agent' executes the tool call and appends its output to the original prompt
    - re-query te model with the tool call result 포함한 input


코덱스는 agent loop을 어떻게 돌리는지?

- overriding system prompts (per model)
  - 기본적으로 프롬프트가 있는데, 예를 들어 5.2 -> Frontend 용으로 또 있다. 모델마다 다르게 적용되어 있는 것들이 있어서, 세분화해서 다루려면 이런 내용을 override하는 프롬프트를 config.toml에 추가해야될수도 있음.(근데 모델별로 다르게 설정하는게 가능한가? 없다면 기능을 추가해봐도 괜찮을 것 같음.)
- caching에 대한 이해, 비용에 대한 이
- codex가 어떻게 compact를 다루는지 (일정 threshold 이상 토큰이 늘어나면 compact를 알아서 수행한다. -> but....애초에 compact가 자주 일어나는게 좋은 일인지는 나도 모르겠음.)
