# Agent Skills

Gemini CLI Release Note에 Agent Skills 기능이 Preview로 추가되었다고 해서 뭔지 알아보고, 사용해보려고 함

Agent Skills는 Open Standard로, 공식 웹사이트도 있음.(https://agentskills.io)
(Claude skills라는 이야기를 들었던 것 같은데, Claude에 국한된 내용이 아닌 것으로 보임)

## Agent Skills란?

> Folders of instructions, scripts and resources that agents can discover and use to do things more accurately and efficiently

Agent가 동작할 때, 더 의도대로 잘 동작하도록 Context를 잘 주입하기 위해서 만든 방법이라고 이해됨

폴더를 하나 만들고, 그 안에 특정 작업단위에 대한 지시사항/실행시키고자 하는 스크립트 코드/리소스 등, Context 정보를 저장해두면, Agent가 필요하다고 판단될 때 자율적으로 해당 폴더 내의 정보를 context로 불러들여서 작업을 수행하는 개념

## Why Agent Skills?

어떤 문제를 해결하려고 하는지에 주안점을 두고 보면 되는 듯?

Agents(사실상 LLM이지) -> 성능이 점점 좋아지는데, 성능이 아무리 좋아져도 Context를 주입해주는건 필요함.

Skills는 이 문제를 해결하려고 함.

Agent들이 온디맨드 방식으로 절차적 지식이나, 특정 상황에 필요한 컨텍스트에 접근해서 사용할 수 있는 방법을 제공

단일 스킬에 의존하기 보다는, 여러 Skill들을 정의해두고 작업 수행하면서 그때그때 필요한 Skill를 Agent가 활용하는 것.

## 그래서 Skills로 뭘 할 수 있는데?

- Agent에 구조화된 방식으로 Domain 지식 제공: 법적 검토 프로세스, 데이터 분석 파이프라인 등 일련의 작업을 재사용 가능한 instruction 묶음으로 패키징해서 Agent에 제공 가능
- Agent에게 새로운 능력 부여 (데이터 분석 등..)
- 다단계로 구성된 작업을 일관되고 파악가능한 workflow로 변환해서 수행 가능
- `Agent Skills` 스탠다드를 준수하는 skill은 Skill-compatible 한 Agent 라면 어디서든 재사용 가능
  - 좋은데...? Gemini CLI, Claude Code, Codex, VSCode 등 내가 마음에 드는 환경에서 동일하게 재사용 가능하다는 소리잖아??

## Skills 구조

Skills라고 이름을 지은게 이게 맞나 싶기도 하면서 좀 괜찮은것 같기도 하고.....이름 때문에 와닿지 않는 것 같기도 한 느낌..?

일련의 작업 단위를 하나의 skill이라고 보면 되는 것 같음.

원래는 하나의 Agent 안에 여러 지시사항이 혼재되거나, Agent를 둘로 분리하거나 했어야 하는 것 같은데 이제는 하나의 Agent에 여러 개의 Skill을 붙이면 된다고 이해했음

내가 지금 만들고 있는 학습 도우미 Agent 같은 경우, 아래와 같은 Skill들로 구성해서 Agent를 돌릴수도 있겠지.

- daily-study-review: 매일 학습한 내용을 사용자가 입력하면, 해당 내용에 대해서 시니어 개발자/아키텍트 출신 멘토라는 정체성을 가지고 평가/조언
- Weekly-review: 일주일동안 사용자가 학습한 내용을 토대로, 일주일 공부 내용에 대해서 요약 및 정리, 복습 세션을 돕고, 다음에 학습할 주제에 대해서 조언하는 Agent

여러 가지 Agent 구성을 좀 쉽게 해준다 정도로 이해하면 될 것 같네.

### 구성

```sh
my-skill/
├── SKILL.md # Required: instructions + metadata
├── scripts/ # Optional: executable code
├── references/ # Optional: documentation
└── assets/ # Optional: templates, resources
```

SKILL.md -> yaml frontmatter(name/description으로 구성) agent에게 작업을 지시하는 instruction으로 구성. 이거는 무조건 있어야 함.

여기에 추가로, 스크립트 등 agent 작업 실행 시 필요한 자원을 명시하는게 가능함.

## How skills work.

`Progressive disclosure`를 사용 (점진적 공개라고 해석)

Discovery -> Activation -> Execution 으로 이루어진 3단계를 통해서 Agent에 컨텍스트를 주입함

점진적으로 Agent에 주입되는 정보의 양을 늘려가는 것 -> Agent Skill도 결국 Context Engineering의 일환인 것 같음. 현재 Agent 개발이나, Agent를 포함한 시스템 개발에서 가장 중요한건, Agent 동작 시 최소한의 가장 relevant 한 범위 내의 정보만 최대한 풍부하게 주입하는 것이라는 것을 보여주는 듯? Agent를 개발하는 사람들이 다 비슷한 결론에 도달하는 과정에 있는 것 같음. 적절한 Context를, 불필요한 Context는 안주는게..해결해야될 문제라고 보는거지.

1. Discovery: Agent가 최초 실행 시 available 한 skill들의 SKILL.md의 frontmatter에 있는 name/description만 load함.(사용자가 입력한 질의를 처리하기 위한 skill이 있는지 등을 판단하기 위해서 필요한 이 단계에서의 최소한의 정보만 수집)

2. Activation: Task를 봤을 때 어떤 Skill을 써야된다고 생각이 되면, `SKILL.md` 파일 전체를 Context로 읽음.

3. Execution: SKILL.md의 instruction에 따라 필요하다면 정보를 추가로 읽어서 요구된 작업을 수행.

단계별로 Agent의 컨텍스트에 주입되는 정보를 보면,

name/description 목록 -> 하나의 instruction(mini system prompt) -> 관련된 전체 context.

# 적용해보기

계획 중이었던

- 당일 공부 내용 리뷰용 시니어 개발자 Agent
- Weekly 공부 내용 복습 지원 Agent

이 2가지를 하나의 디렉토리에 separate skills로 구현하고 테스트해보았음.

30분 정도 테스트 사용해본 결과 일단 개별 Skill 별로 호출은 매우 잘 되는 것 같음.

뭔가 내가 해보려고 했던 작업에 딱 맞는게 타이밍 좋게 등장한 느낌이라 신기하긴 함.

내가 고민했던 부분

- GEMINI cli를 활용해서 Agent 를 만들고 싶은데,
- 오늘 공부한 내용에 대한 피드백을 주는 Agent와
- 주기적으로 공부한 내용을 정리/복습을 도와주는 Agent가 필요했음.

근데 문제는, GEMINI.md 파일은 프로젝트당 하나를 만들 수 있는데

처리하고 싶은 문제가 2개라서 디렉토리를 2개로 굳이 나눠야한다는 것이 좀 불편하게 느껴졌음.

그래서 GEMINI.md file의 지시사항을, orchestrator같은 역할을 하도록 지시해서 만들어 보는 중이었다.

GEMINI.md 파일을 보고, 사용자 질의를 처리할 수 있는 개별 instruction을 읽어서 처리하게 하고 있었는데 거의 Skills랑 동일한 구조였던 것 같음.(만들다보면 다 이런게 필요해져서 하나로 회귀하는 느낌인듯?)

그래서 Skills를 써서, `study-mentor`와 `weekly-reviewer` 두 개의 skills를 만들어서 질의를 다르게 해가면서 테스트했는데

잘 동작하는 것 같다.

이렇게 구조화해서 관리하니까 확실히 뭘 하는지도 더 잘 알겠고, AI도 컨텍스트 주입을 효율적으로 받아서 처리하는 것 같음.

좋은데?? 로컬에서 여러 Agent를 만들어서 workflow를 돌려야 하는 사람은 이거만한게 없을 것 같음.

일상 생활 속의 문제를 해결하는 것도 이걸로 해볼 수 있을 것 같은데...

전체는 `집안일`이 되는거고, `저녁 메뉴 추천`, `냉장고 재고 관리` 등등... 이렇게 하면 자연어로 집안일 관련된 일들도 처리 가능할듯?

그리고 이런 Agent들에 적절한 FE interface만 제공하면 그게 프로덕트잖아..!?

좋은 것 같다 좋은 사고 구조 및 컨텍스트 제한 방법인 것 같음

# 문제점

아직은 서로 다른 Skill을 하나의 대화세션에서 사용하면 컨텍스트가 섞이는 것 같음.

즉 제거가 안됨

Skill하나를 호출하고 다른 Skill이 호출되었을 때, 이전 Skill은 제거되도록 하는 옵션이나 방법이 있어야하지 않을까 하는 생각이 들었음.

아니면 overall 동작 control이라던지...(GEMINI.md에 명시하면 되려나..?)

더 많이 사용해볼 필요가 있어보이고, 지금은 간단한 instruction만 가지고 처리했는데

보다 다양한 usecase를 구현해봐야할듯

- script를 사용하는 case
- 외부 system과 연동해서 workflow/data pipeline을 처리하는 case

등등...

real-life에서 사람들이 사용했을 때 도움이 될만한 flow를 생각해보자.
