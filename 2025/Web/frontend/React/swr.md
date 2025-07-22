# useSWR??

새로 투입된 프로젝트에서 `useSWR` 훅을 사용하는데 외부 라이브러리라서 한 번 알아보고자 한다.

왜쓰는걸까? 뭘 위해서 사용되는 기술인지??

# SWR

Stale-while-revalidate의 약자로, HTTP 캐싱 전략 중 하나.

fe에서 server state에 대해서 우선 캐싱된 데이터(stale data)를 보여주고, server에 fetch request를 보내서 revalidate를 해서 최신 데이터를 가져오는 방식.

In the background, SWR sends a request to get the latest data. Once it arrives, the UI is automatically updated.

즉 백그라운드에서 요청을 보내고, 응답이 오면 UI를 자동으로 업데이트해서 최신 데이터가 UI에 반영된다.

# 기본 문법

```javascript
function Profile() {
  // key string과, 데이터 fetching 함수를 인자로 받는 식으로 구현되어 있음.
  // fetcher can be any asynchronous function which returns the data
  const { data, error, isLoading } = useSWR("/api/user", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return <div>hello {data.name}!</div>;
}
```

# mutate

`mutate`라는 함수는 수동으로 client-side cache를 업데이트할 수 있게 해준다.

bound mutate와 global mutate가 있다.

bound mutate는 특정 key에 대한 mutate를 의미하고, global mutate는 모든 key에 대한 mutate를 의미한다.

Global `mutate`: You can import a global mutate function that can update any piece of data in the SWR cache, regardless of which component is using it. This is useful for things like the logout example, where an action in one component needs to affect data used in another.

하지만 주의해야될 점. key만 전달해서 업데이트 하고 싶은 경우에는 해당 key를 사용하는 SWR 훅이 mount되어 있는 상태여야 한다. 그렇지 않으면 will not trigger update or revalidation.

```javascript
// 공식문서에서 추천하는 global mutate 사용 방식은 useSWRConfig 훅을 사용하는 것
import { useSWRConfig } from "swr";

function App() {
  const { mutate } = useSWRConfig();
  mutate(key, data, options);
}
```

## Why Use mutate?

1. **Optimistic UI Updates**: This is the most common and powerful use case. Imagine a user adds a comment to a post. Instead of making them wait for the server to confirm the comment was added, you can use mutate to immediately add the comment to the UI. This makes the app feel incredibly fast. In the background, SWR will still send the request to the server and then re-fetch the latest data to ensure everything is consistent.

2. **Manual Revalidation**: Sometimes, you know that data has changed on the server, and you want to force a refresh. For example, after a user logs out, you might want to mutate the user data to trigger a re-fetch and update the UI to a logged-out state.

3. **Updating Data Without a Re-fetch**: You can also use mutate to update the local cache with new data without triggering a re-fetch. This is useful when you've already received the updated data from another source (like a WebSocket event) and you just need to update the UI.

## mutate가 UI를 network에서 decoupling해서 interactive하고 responsive한 UX를 제공할 수 있게 해준다는데...

Gemini가 알려줬는데 이 부분이 이해가 안돼서 좀 더 물어봄

전통적인 구조에서는,

사용자가 서버에 뭔가 데이터 업데이트 요청을 하면, 서버의 응답을 기다려서 UI에 반영된다.

서버 상태에 기반하는 UI가 네트워크 의존성이 높음. UX가 네트워크 속도와 강하게 결합되어 있어서 네트워크가 느리면 바로 답답함을 유발한다.

`mutate`를 사용해서 이 UI와 network간의 강결합을 느슨하게 만들 수 있음.

Optimistic 업데이트를 활용하는 것.

데이터 변경되는 순간 바로 `mutate`를 호출해서 UI를 업데이트한다.
이렇게 하면 서버 응답을 기다리지 않고도 UI가 즉시 반영되므로 사용자 경험이 훨씬 더 매끄럽고 빠르게 느껴진다.
이후에 SWR은 백그라운드에서 서버에 요청을 보내서 처리하고, 응답이 오면 revalidate를 통해 최신 데이터를 가져와서 UI를 다시 업데이트한다.
혹시나 에러가 발생하면?? 롤백하는 방식

UI가 더이상 네트워크에 의존적이지 않게 되므로 다음 이점들이 따라옴.

- 유저 체감 퍼포먼스 향상
- 앱이 네트워크 이슈에 대한 내성이 더 강해짐.

It's like.. SWR says, "Go ahead and update, and we'll sort out the details with the server in the background." This creates a much more pleasant and productive user experience.

# mutate를 통해서 cache를 무효화하면 어떤 일이 발생하는거야??

mutate 함수를 호출하면 SWR은 해당 key에 대한 캐시를 무효화하고, 백그라운드에서 새로운 데이터를 가져오기 위해 서버에 요청을 보낸다. 이 과정에서 UI는 즉시 업데이트되어 사용자에게 최신 상태를 보여준다.

key만 넘겨준 경우 - 데이터 다시 가져와서 업데이트
key와 새로운 데이터를 넘겨준 경우 - 캐시를 새로운 데이터로 업데이트하고, UI를 즉시 반영한다.(세 번째 인자는 revalidate 옵션으로, true로 설정하면 백그라운드에서 새로운 데이터를 가져온다.) -> 여기서 true로 설정하면 optimistic UI업데이트 형식으로 처리가 가능하고, false로 설정하면 캐시를 업데이트하고 UI를 즉시 반영하지만, 백그라운드에서 새로운 데이터를 가져오지 않는다.

즉 데이터를 아예 날려버리고 재호출이 필요없는 경우(로그아웃 같이..) 싶으면 그냥 mutate(key, null/undefined, false) 같이 호출하면 됨.

# 근데 그래서 일단 왜 쓴다고..?

> 근데그러면 결국 가장 간단하게 요약해서 SWR 왜쓴ㄴ거야?

✦ SWR을 사용하는 가장 큰 이유는 더 빠르고 부드러운 사용자 경험(UX)을 만들기 위해서입니다.

SWR은 "일단 캐시된(오래된) 데이터를 먼저 보여주고, 그 사이에 최신 데이터를 가져오는" 방식을 사용합니다. 덕분에 사용자는 로딩을 기다릴
필요 없이 화면을 바로 볼 수 있고, 데이터는 알아서 최신 상태로 업데이트되므로 앱이 항상 빠르고 반응성 좋게 느껴집니다.

> useEffect 로는 그게 힘든가?

✦ 네, useEffect만으로 SWR과 같은 경험을 만드는 것은 상당히 복잡하고 어렵습니다. useEffect는 기본적인 데이터 fetching은 가능하지만, SWR이
제공하는 핵심적인 기능들을 직접 다 구현해야 하기 때문입니다.

useEffect로 데이터를 가져올 때의 한계점들은 다음과 같습니다.

1.  캐싱 기능 부재: useEffect는 기본적으로 캐싱 기능이 없습니다. 컴포넌트가 다시 렌더링될 때마다 새로운 요청을 보내게 되어 불필요한
    네트워크 요청이 많아지고, 이는 성능 저하로 이어집니다.

2.  복잡한 상태 관리: 로딩 상태(isLoading), 데이터(data), 에러 상태(error) 등을 모두 useState로 직접 관리해야 합니다. 코드가 길어지고
    복잡해지며, 여러 컴포넌트에서 동일한 데이터를 사용할 경우 상태 관리가 더욱 어려워집니다.

3.  자동 업데이트 부재: SWR처럼 화면에 다시 포커스하거나, 네트워크가 재연결되었을 때 자동으로 데이터를 갱신하는 기능이 없습니다. 이런
    기능을 구현하려면 브라우저 이벤트를 직접 감지하고 처리하는 복잡한 로직을 추가해야 합니다.

4.  Optimistic UI 구현의 어려움: mutate와 같은 Optimistic UI를 useEffect만으로 구현하려면, 임시 상태와 실제 서버 상태를 동기화하고,
    실패했을 때 롤백하는 로직까지 모두 직접 만들어야 합니다. 이는 매우 복잡하고 버그가 발생하기 쉽습니다.

간단히 비유하자면,

- `useEffect` 사용: 자동차 부품(엔진, 바퀴, 핸들 등)을 하나하나 사서 직접 조립해서 자동차를 만드는 것과 같습니다. 가능은 하지만, 많은
  시간과 노력이 필요하고 전문가가 아니면 제대로 만들기 어렵습니다.
- SWR 사용: 잘 만들어진 완성차를 사서 바로 운전하는 것과 같습니다. 이미 전문가들이 최적의 성능과 편의 기능을 다 만들어 놓았기 때문에,
  우리는 그저 편하게 사용하기만 하면 됩니다.

결론적으로, useEffect는 React의 기본적인 기능이지만, SWR은 데이터 fetching에 특화되어 캐싱, 자동 재검증, 상태 관리, Optimistic UI 등
고도화된 기능을 제공함으로써 개발자가 훨씬 적은 코드로 더 나은 사용자 경험을 쉽게 만들 수 있도록 도와주는 강력한 라이브러리입니다.

그렇다고 합니다....

전통적인 외부 시스템과 동기화하기 위해서 사용하는 방법인 useEffect는 그 자체만으로는 fetching로직을 다구현하기 쉽지 않음. 아니 불가능이라고 봐야지 useState를 활용해서 처리를 매번해야하고, isError, isLoading같은걸.. 그리고 또 코드도 뭔가 깔끔하지 않음. 그리고 캐싱이나 revalidate, rollback 같은 기능도 직접 다 구현해야하고,

그래서 이런 외부 시스템의 데이터를 불러와서 관리하기 쉽게 해주는게 SWR

# tanstack query하고 좀 비슷한 것 같은데 차이가..?

> tanstack query는 자신을 async state manager 라고 강조하는데, 그러면 SWR은 조금 더 data fetching 에 특화된거야? state management의 느낌은 좀 없는건가??

✦ 네, 정확히 보셨습니다. 그 미묘한 표현의 차이가 두 라이브러리의 핵심 철학과 기능적 깊이의 차이를 잘 보여줍니다.

결론부터 말씀드리면, SWR도 비동기 상태 관리자(Async State Manager)가 맞습니다. 하지만 TanStack Query가 '상태 관리' 측면을 훨씬 더
강조하고 관련 기능을 깊이 있게 제공하는 반면, SWR은 '데이터 가져오기(Data Fetching)'의 경험을 최대한 간결하고 부드럽게 만드는 데 더
집중합니다.

TanStack Query: "비동기 상태 관리자"

TanStack Query가 스스로를 '비동기 상태 관리자'라고 부르는 이유는 다음과 같습니다.

1.  서버 상태(Server State)의 명확한 정의: TanStack Query는 클라이언트 상태(Client State)와 서버 상태(Server State)를 명확히 구분합니다.
    그리고 '서버에서 비롯된, 비동기적으로 가져오는 모든 데이터'를 '서버 상태'로 정의하고, 이 상태를 관리하는 데 모든 기능이 집중되어
    있습니다.

2.  강력한 캐시 관리: 단순히 데이터를 가져오는 것을 넘어, 캐시된 데이터를 '어떻게', '얼마나 오래' 관리할지에 대한 매우 세밀한 제어권을
    줍니다.

    - staleTime: 데이터가 '오래되었다(stale)'고 간주되기까지의 시간. 이 시간 동안에는 네트워크 요청을 다시 보내지 않습니다.
    - cacheTime: 데이터가 캐시에서 완전히 제거되기까지의 시간. 컴포넌트가 언마운트되어도 이 시간 동안 캐시에 남아있습니다.
    - 이 두 가지 옵션을 통해 "데이터는 캐시에 남겨두되, 화면에 보일 땐 다시 최신 데이터를 가져와" 같은 복잡한 시나리오를 쉽게 구현할
      수 있습니다.

3.  정교한 쿼리 키(Query Keys): SWR의 키가 주로 URL 문자열인 반면, TanStack Query는 배열 형태의 정교한 쿼리 키를 사용합니다. ['todos', {
    status: 'done', page: 2 }] 와 같은 구조적인 키를 통해, 서로 의존성을 갖는 복잡한 쿼리들을 훨씬 체계적으로 관리하고
    무효화(invalidate)할 수 있습니다.

4.  Devtools: TanStack Query의 가장 큰 장점 중 하나로, 현재 캐시된 모든 쿼리의 상태, 데이터, 마지막 업데이트 시간 등을 시각적으로
    보여주는 강력한 개발자 도구를 제공합니다. 이는 '상태 관리'를 직접 눈으로 보며 디버깅할 수 있게 해줍니다.

SWR: "데이터 페칭에 특화"

SWR도 내부적으로는 캐시를 통해 상태를 관리하지만, 그 철학은 '간결함'과 '자동화'에 더 가깝습니다.

1.  'Stale-While-Revalidate' 철학의 강조: 이름에서부터 알 수 있듯이, '오래된 데이터를 먼저 보여주고 뒤에서 갱신한다'는 UX 패턴 자체에
    집중합니다. 사용자가 가장 빠르게 화면을 볼 수 있게 하는 것에 최우선 순위를 둡니다.

2.  간결한 API와 자동화: staleTime, cacheTime 같은 세부적인 설정을 직접 하기보다는, 화면 포커스 시, 네트워크 재연결 시, 정해진 주기마다
    자동으로 데이터를 갱신해주는 기능들이 기본적으로 활성화되어 있습니다. 개발자가 신경 쓸 부분을 최소화하고 '알아서 잘' 동작하게 만드는
    데 초점을 맞춥니다.

3.  `mutate`의 역할: SWR의 mutate는 강력하지만, 주로 UI를 즉시 업데이트(Optimistic UI)하거나 특정 데이터의 재검증을 유발하는 '액션'의
    성격이 강합니다. TanStack Query의 invalidateQueries처럼 복잡한 조건으로 여러 쿼리를 한 번에 관리하는 것보다는 직관적인 데이터 조작에
    가깝습니다.

결론: 관점의 차이

- SWR은 "어떻게 하면 데이터를 가장 빠르고 부드럽게 가져와서 보여줄까?"라는 '경험'의 관점에서 출발합니다. 그래서 API가 더 간결하고
  자동화된 기능이 많습니다.
- TanStack Query는 "서버에서 온 데이터를 클라이언트에서 어떻게 '상태'로서 체계적으로 관리하고 제어할까?"라는 '아키텍처'의 관점에서
  출발합니다. 그래서 더 많은 설정 옵션과 강력한 관리 도구를 제공합니다.

따라서 "SWR은 State Management의 느낌이 좀 없는 건가?"라는 질문에는 "TanStack Query에 비해 덜 강조될 뿐, SWR의 핵심 역시 캐시를 통한
비동기 상태 관리"라고 답할 수 있습니다. SWR은 그 상태 관리를 개발자가 크게 의식하지 않도록 자동화하여 '훌륭한 데이터 페칭 경험'으로
포장한 것이고, TanStack Query는 그 '상태 관리' 자체를 개발자가 더 적극적으로 제어할 수 있도록 많은 도구를 제공하는 것입니다.
