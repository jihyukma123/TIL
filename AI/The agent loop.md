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
    - re-query te model with the
