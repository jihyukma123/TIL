# [Software engineering at the tipping point](https://www.youtube.com/watch?v=2n41YjR5QfU)

Software Ecology.

Ecology - 생태학. 생태계

미래를 예측할 순 없어도, 현재의 소프트웨어 시스템을 잘 관찰하면 미래가 어떻게 되어갈지에 대한 답을 어느 정도 엿볼 수 있으리라는 가정 하에 현재 시스템을 관찰해본 경험에 대한 내용일 것으로 보임.

콘웨이의 법칙 -> 시스템을 설계하는 조직은, 그 조직의 커뮤니케이션 구조를 닮은 설계를 만들게 된다. 시스템의 구조는 조직의 구조와 inseparable 하다는 것.

Socio Technical system -> 시스템은 단순히 코드,서버,DB로만 구성되는 것이 아니다.
시스템이라는 것은 사람, 조직구조, 업무 절차, 문화, 정책, 도구, 코드, 인프라, 운영 방식 등 모든 것이 함께 맞물려서 돌아가는 것.

기술만을 가지고 구현되는 것이 아니라, 사회적인 요소들이 기술 시스템의 동작에 크게 영향을 준다는 것. -> 그치 누가 그 시스템을 사용하는지에 따라 달라지는 것처럼...

Software is people. -> Things we build, and the we build them is a reflection of what we value. -> 이에 대해서 잘 생각해보면, 이런 부분을 잘 파악해서 원하는 가치를 더 증폭시키고 확장시키는데 활용할 수도 있겠지.

Software ecology is the holistic study of the socio-technical ecosystems that produce software. -> holistic은 전체론적이라는 소리임. 즉 부분만 보지 않고 전체 관계를 함께 본다는 것.

---

Real Example.

Google. -> Software Engineering at Google 이라는 책이 있다고 함. (Oreilly) 이 책의 첫 half는 Google의 Engineering Culture에 대한 내용이라고 함. 그 문화를 이해하지 못하면, 구글이 내린 기술적 의사결정을 이해할 수 없다고...

Shared fate 

---

Generating code 10x faster, and engineering 10x faster 는 엄청 다른 일임. 완전히 다른 일..

Code 생산 속도가 엄청 빨라진 지금, 어떻게 이를 기반으로 'engineering'을 해야지 고객들에게 실제로 빠르게 가치를 전달할 수 있을지에 대한 고민이 필요한 시점임.

확실한건, 기존의 방법이 10x 구조에서는 그대로 동작하지 않을 것이라는 점.

---

Complilation, 컴파일링은 공짜가 아니다. 다만 너가 그걸 눈치채지 못하고 있을 뿐.

Agents are good in writing code, but not good in thinking long term, 유지보수 등을 고려하지 못한다는 점.

---

뭐가 됐든, 한 가지는 부정할 수 없는 사실이다.

Agents are doing a lot of work for use now. 그렇기 때문에 우리는 어떻게 Agent를 최고로 효율적으로, 효과적으로 사용할 수 있을지에 대한 고민이 필요하다.

---

What is the largest binary you can compile

---

No one wants to be a blocker. 10x more code가 생성되는 이 시점에, 그 코드를 리뷰하는데 있어 분명 인간의 능력의 한계로 인한 병목이 발생하는데 문제는 아무도 블로커가 되고 싶지 않아한다. -> 그러면 어떻게 돼..? 뭔가 제대로 리뷰하지 않거나 하는 일이 발생하게 되겠지 그냥 두면

---

비싼 리소스 -> 토큰. 토큰에 대한 것도 이제 신경 써야한다.

- 제한된 토큰의 양을 어딘가에 써야한다면, 그건 어디에 써야하는가?
- 당장 지금 토큰이 어디에 소모되고 있는지 볼 수 있는 visibility는 있는지..?

---

Testing infrastructure 가 소모하는 compute에 대해서 생각해본적이 있는지?

Agent가 더 많은 코드를 생성하는데, Agent들은 Test를 좋아해 왜? 그나마 본인이 일을 제대로 했는지를 평가할 수 있는 수단이니까. 근데 문제는 이러면 수행해야되는 테스트의 수가 엄청 늘어날 수가 있음.

codebase grows -> dependency graph grows 선형적으로 증가하지 않고, 4배 이런 식으로 지수적으로 증가함.
-> 테스트의 수가 엄청 늘어난다는 소리임.

그렇다고 해서 테스트가 없다고 하면? 그건 더 문제지...Agents are 'yoloing' all over your codebase 라는 의미가 될 수 있음.

---

version control system의 성능은..?

이런건 생각도 안해봤네...대부분의 version control은 성능을 고려하지 않는다고 함. 한 번에 할 수 있는 커밋의 수는..?

---

Jevon's paradox


---

You really only need 2 questions.

Why? 
What if?

---

AI is an amplifier -> AI can do more. but more confusion. Amplification 은 magnitude 이고, not a direction

그렇다는 것은, 이미 기반이 탄탄하고 방향성에 대해서 잘 인식하고 그를 위한 시스템이 갖춰진 팀과, 그렇지 않은 팀간의 격차가 크게 벌어진다는 것.

Fundamentals still matter

- Decision making
- Technical Strategy
- Developer productivity
- organizational collaboration
- Security
- code health
- release hygiene
- reliability

---

같이 생각해봐야 하는 주제들

- Infrastructure Capacity -> AI 추가되면서 늘어나는 compute/deploy를 위한 저장소 등 인프라 관련 케파를 어떻게 관찰하고 관리해야되는지?
- Validation: you cant, and should not ship software that you have not validated -> 그리고 추가로, validation이라는 것이 무엇인지에 대한 개념도 변경될 것이므로 새로운 validation 전략이 필요해질 것.
- Isolation: 코드로 해결하지 않았던, 혹은 굳이 거기까지는 코드로 처리하지 않았던 것도 코드를 쓰게될 가능성이 높음 -> 어떻게 이런 PoC성 코드가 프로덕션에 영향을 주지 않게 잘 고립시킬지 생각이 필요
- Abstraction: We build abstractions to keep developers from making bad choices. libraries...frameworks...그렇구나 추상화라는건 개발자가 혼자서 뭔가를 멋대로 하는 것을 방지하는 방법이 되기도 하는구나.(꼭 그것만이 목적은 아니겠지) -> 마찬가지로, Agent들에게도 올바른 abstraction이 주어져야 한다. dont give them bad choices. 다 알아서 하게 두는게 아니라, 애초에 나쁜 선택지를 주지 않는 것. 망할 수가 없게 하는 것.

---

Practices change, principles matter
-> separating mechanism from principle

현재 우리가 하는 방식(소프트웨어 개발, 테스팅 등)을 이해하지 못하면, 그걸 개선하지도 못할 것.

---

새로운 문제들

- context management
- token economics
- model drift

---

how can we maintain intellectual control over the codebase as it grows?
-> 어떻게 전체적인 이해를 유지하면서 코드를 추가할 수 있을까. 중요한 문제지. 어느순간 이 코드의 전체적인 구조가 내 머릿속에 없다면 큰 문제가 될테니까.
-> AI가 오히려 이를 도와줄 수 있다고 생각한대. 거대한 시스템에 대한 이해를 제고하는데 도움을 준다고 함.

how can we deepen our understanding of the things that we have built?

---

지금 당장 할 수 있는 것 -> choose to be helpful.

아직 내가 아는 것을 이해하지 못한 사람에게 도움이 되어라. 이해할 수 있게 도와라.

Help the other people around you.

---

If you care about software quality, or software design, 그런걸 신경쓰는 사람이라면, advocate for it.

---

As front-line software engineers, in this tipping point moment, you are at the heart of deciding what software engineering is going to be.

You have more agency than you think. Use that agency to create the future for your organization. for your team, and for you.
