# 목적

Codex App을 보면, 채팅창 하단에 '기본 권한', '자동 검토', '전체 권한'이라고 해서 샌드박스 모드를 설정하는 옵션을 선택하게 되어 있음. 

CLI도 마찬가지로 `/permissions` 명령어를 입력해서 이 부분을 control 할 수 있음.

대략적으로, 기본 권한으로 하면 특정 작업을 하기 전에 나한테 물어보고, 전체 권한을 주면 나한테 아무것도 안물어보고 모든 작업을 알아서 처리한다 정도로만 이해하고 있었는데, 본격적으로 교육을 진행하려면 이런 부분에 대한 이해가 필요할 듯 해서 알아보고자 함.

# Codex에서 보안 제어가 동작하는 방식

권한 통제는 2개의 나눠서 구성되어 있는 구조임.

- Sandbox: LLM이 생성한 명령어 실행 시, 기술적으로 어떤 것을 할 수 있는지에 대한 제어
- Approval: Codex가 어떤 작업을 실행하기 전에 승인을 요청해야되는지에 대한 제어

# Codex에서 Network Access가 동작하는 방식

`workspace-write`, 즉 기본 모드에서는 명시적으로 활성화하지 않는 경우 네트워크 접근 자체가 비활성화 되어 있음.

그리고 기본적으로 Codex에서의 웹 검색은 OpenAI 내부적으로 관리하는 Cached index의 결과를 반환함.

실시간 검색 결과를 가져오려면, --search 옵션을 사용하거나, config.toml에 `web_search="live"`라는 옵션을 줘야함.

# Approval 관련

approval_policy = "on-request"
-> codex가 보통 작업은 알아서 하되, 위험하거나 권한이 더 필요한 작업은 사용자에게 물어봄

`approvals_reviewer="auto_review"` 옵션 활성화 시, 
reviewer agent가 이전 단계에서 개입해서 판단을 해서, 위험도가 낮은 명령어는 알아서 처리함.

# .env file 읽는거 막기

안그래도 이거 때문에 매번 terminal 환경에서 export 로 변수 설정해서 썼는데..

아래와 같은 방식을 활용해서, 애초에 파일을 읽는 명령어 자체가 실행이 안되게 할 수 있다고 함. 다만 명령어는 macOS/Linux 기준이라서 다른 플랫폼에서는 무제한 깊이 패턴이 안먹힐 수 있으니 깊이를 명시하는걸 추천함.

```toml
default_permissions = "workspace"

[permissions.workspace.filesystem]
":project_roots" = { "." = "write", "**/*.env" = "none" }
glob_scan_max_depth = 3
```

glob은 파일 경로를 찾기 위한 와일드카드 패턴이고, *는 아무 이름, **는 여러 하위 폴더까지 포함해서 찾는 표현이야.

# OpenTelemetry

OpenTelemetry 연동해서 Codex 실행 결과 등을 볼 수 있음.

Codex가 구조화된 이벤트를 만들고, exporter 를 설정해서 지정한 로그/모니터링 시스템으로 보내도록 해서 결과를 외부 시스템에서 대시보드 등 형식으로 볼 수 있음.
