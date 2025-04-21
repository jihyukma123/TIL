# @asynccontextmanager

코드 상에 보면 `@asynccontextmanager`를 사용하는 부분이 앱 진입접에 존재한다.

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI 애플리케이션 라이프사이클 관리
    """
    # 안에서 특정 로직 실행..


app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan,
)
```

`@asynccontextmanager`가 뭐하는 친구인지 알아보기 위해서 우선 context 개념부터 공부해야될 것 같음.

# context? why use context and what is context

context가 뭔지, 그리고 무슨 문제를 해결하기 위해서 등장한 개념인지 좀 알아봤음.

파이썬 context에 대해서 검색하면 거의 모든 자료가 단순히 context에 대한 내용이 아니라 `context manager`에 대한 내용이라서 이에 대해서 먼저 유튭 영상 하나 봤음.( [
What Exactly are "Context Managers" in Python?](https://www.youtube.com/watch?v=IQ20WLlEHbU) )

```python
# 어떤 자원에 접근해서 사용하기 위한 아래와 같은 코드를 보자
file = open('test.txt', 'r')
content = file.read()
file.close()
```

위 코드에서 potentially 잘못될만한 부분이 뭐가 있을까?

만약에 `file.close()`에 코드 실행이 도달하기 전에 뭔가 잘못된다면?? file이 닫히지 않아서 야기되는 온갖 문제들이 발생할 수 있는 상황이 됨.

그래서?? what if we didnt have to worry about manually closing the file??

조금 더 elegant하고 safe하기 처리하는 버전의 코드를 보자.

```python
with open('test.txt', 'r') as file:
    content = file.read()
    print(content) # You are awesome.

print(file.closed) # True

# Context Manager기준으로 보면
# file.__enter__(file) 이 실행되고,
# file.__exit__(file) 이 실행되는거임.

```

`with` 키워드를 사용해서 처리하면, 이 블록 안에서 파일이 open 되어서 필요한 처리가 되고 블록의 실행이 완료되면 자동으로 close처리가 됨.

이게 어떻게 가능하냐??

`with` 문은

(1) sets up the context
(2) Does the work(in the block)
(3) Performs clean up

`Context Manager`는 리소스를 관리하는 기능을 가지고 있는 특별한 파이썬 객체임.

```python
# 두 개의 핵심 메서드가 있음. enter/exit
# enter
# exit
class ContextManager:
    # enter - handles the setup
    def __enter__(self):
        print("Entering context")
        return "some resource"

    # exit - handles the cleanup
    def __exit__(self, exc_type, exc_value, traceback):
        print("Exiting context")

# with 블록에 진입하면 cm.__enter__(cm)이 실행되어서 gives access to some resource, 완료되면(뭔가 잘못되더라도) the cm.__exit__(cm)을 호출해서 cleanup 처리
with ContextManager() as cm:
    print(f"Using {cm}")
```

# 이 모든게 어떤 문제를 해결하려고 하는건가??

문제의 본질: `자원을 안전하게 다루고 싶다.`

자원이라고 하면??

- 파일, DB커넥션, 스레드, 메모리 등등
- 명시적으로 열고 닫는게 필요함
- 제대로 닫지 않았을 때 문제가 생길 수 있음
  - 메모리 누수, 파일 잠김, DB연결 폭주

제대로 닫지 않았을 때 생길 수 있는 문제를 처리하기 위해서는 사람이 `try/finally` 문법을 써서 처리해도 되지만, 수동으로 매번 처리해야된다는 문제점과 또 human error 발생 가능성이 존재한다는 문제점이 있음.

그래서 해결해야 하는 문제는, 무슨 일이 생기건 간에 리소스를 필요하지 않은 시점에 무조건 정리되도록 해주는 구조가 필요하다. 인걸로 해석된다. (알아서 좀 처리되도록?)

human error나 기타 다른 이슈들로 인해서 문제가 생기지 않도록 구조적으로 정리되도록 해주는 그 어떤 메커니즘이 필요했음.

그래서 `with`, `context manager` 등 개념들을 활용해서 이 문제를 파이썬 언어단에서 처리되도록 하는 기능이 존재한다.

# context manager vs async context manager

아직 개념이 제대로 서지 않아서 context manager말고 async context manager를 별도로 써야하는 이유에 대해서 이해가 잘 안됐음.

왜 `@asynccontextmanager`로 decorate해서 처리해야되는건지???

context manager는
