# TIL

## 2024년 공부 목표

목표가 없이 공부하니까, 중구난방으로 공부를 하게 되는 경향이 있다. 목표를 정하고 쪼개서 개별 목표를 성취하는 형태로 변경해야 할 듯. 올해는 수동적인 공부(ex) 해야될거 같아서, 어디서 많이 들은 키워드라서 등등 이유도 정확하게 모르고 애매하게 하는 공부) 말고 능동적인 공부를 하자. 원하는 목표가 무엇인지 인지하고, 그 목표를 이루기 위해서 필요하다고 생각되는 공부를 하자. 원인을 찾아보고 이해하는 공부를 하자!

### 대목표: 상용 React Native 앱을 운영하는 회사에서 RN개발자에게 요구되는 다양한 업무를 빠르고 안정감있게 수행할 수 있는 개발자가 되자.

**세부 목표**

1.React & React Native framework가 동작하는 방식 및 제공되는 API 이해

- 왜? 프로덕트를 개발하는데 있어 적절한 API를 활용하여 크고 작은 문제를 해결하고 결과를 일정 내에 산출하기 위해서.
- `얻고자 하는 결과`: React 및 React Native의 구조 및 다양한 API의 동작원리를 이해하고, 적재적소에 활용해서 주어진 기능을 빠르고 안정적으로 개발할 줄 아는 능력.

2. React Native에서의 Animation

- 왜? 올해는 프로덕트를 더 인터랙티브하게 만들어보고 싶음. 프로덕트가 제공하는 기능적인 측면에서 효용이 큰 것과 별개로, 프로덕트가 주는 느낌? 사용성이 나이스한 것도 사람들에게 가치를 제공한다고 생각 (대표적인 예시가 애플 아닐까?)
- `얻고자 하는 결과`: 모바일 앱 환경에서 다양한 인터랙션이 주는 효과에 대한 이해, React Native에서 애니메이션이 동작하는 방식 및 한계에 대한 이해, Android/iOS 플랫폼별 애니메이션의 느낌 특징 및 기기가 가지는 한계에 대한 이해

3. JavaScript & TypeScript

- 왜? 자연스럽게 JavaScript의 여러 good practice를 코드 작성에 녹여내고 싶음. 그리고 async 관련 로직에 대해서 솔직히 말하면 아직도 잘 모르겠음. 그리고 ES6에 대해서도 조금 더 원론적인 이해가 필요하다고 느낌. ES6에 어떤 특징적인 기능들이 존재하는지, 왜 이런 기능들이 추가되었는지를 이해해야 더 적절히 사용할 수 있지 않을까? TypeScript는 정적 타이핑이 프로그래밍 시 제공해주는 장점을 이해하고, 개인적으로 만드는 프로젝트의 안정성을 키우기 위해서 공부.
- `얻고자 하는 결과`: JavaScript의 여러 기능의 동작 원리를 이해하면서 코드를 작성하고 TypeScript를 활용해서 Type Safety가 보장되고 로직에 대한 이해를 증가시키는 코드를 작성할 줄 아는 프로그래머가 되는 것.

4. FP, OOP 등 좋은 코드와 구조

- 왜? 언어를 잘 이해하고, React를 잘 사용하는 것과는 별개로 코드를 잘 짜기위해서, 어떤 코드가 `좋은 코드`인지 이해하고 내 코드에 자연스럽게 녹여내고, 현재 프로덕트의 코드를 더 확장하기 편리하고 읽기 쉬운 코드로 조금씩 개선하기 위해서
- `얻고자 하는 결과`: 가독성이 좋고, 코드 그 자체로 목적이 명확하게 드러나며 다양한 변경사항에 최소한으로 필요한만큼은 열려있는 코드를 설계하고 작성하는 능력. 휴먼에러를 최소화하고 구조적으로 안정적일 수 있는 코드를 작성하는 능력.

5. 문제를 해결하는 방법

- 왜? 문제를 해결하는 다양한 방법 및 접근법들에 대한 이해가 필요하다고 느낌. 지금은 문제를 그냥 일단 해결하는 형태로 접근하는데, 보다 더 구조적이고 효율적으로 문제를 해결하는 습관이 필요
- `얻고자 하는 결과`: 문제를 마주했을 때, 문제를 명확하게 정의하고 문제의 성격에 맞다고 판단되는 접근법을 활용해서 문제를 구조적으로 해결하는 습관 장착.

6. 일을 잘하는 방법에 대한 고민

- 왜? 개발을 잘하는 것과 별개로, 어떤 사람이 일을 `잘` 하는 사람인지에 대한 고민이 최근에 많이 됨. 혼자 고민하는 것도 좋지만 책도 읽어보고 다양한 사람들의 이야기를 읽고 들어보자.
- `얻고자 하는 결과`: 2024년 12월 31일에는 2023년 12월 31일과 비교해서 더 일을 잘하는 노하우를 가지고 더 넒게 볼 줄 아는 사람이 되는 것. 소통이라는 것을 더 이해하고 잘 해내는 Co-Worker가 되는 것.

## 1. React & React Native 공부 기록

**공부가 필요한 키워드들**

- React Concurrent Features
- [fiber](https://github.com/acdlite/react-fiber-architecture#what-is-a-fiber)
- React host components, React Composite Components
- 'tick' of the UI Thread
- Mount Phase가 UI Thread에서만 이루어지는 이유?? (Swift랑 비슷한가?.. SwiftUI는 모든 View를 변경시키는 작업을 메인스레드에서 처리하도록 되어있음)
- `React Element Tree`와 `React Shadow Tree`는 thread safety를 위해서 immutable함. -> thread safety랑 두 tree가 immutable한게 무슨 연관성이 있는가?
- C++ 컴포넌트가 무엇인지? components in C++
- Prevent race라고 할때 race는 thread 관련된 것인지?
- no more jni for Yoga? (android 관련)
- C++ “const correctness” feature (thread safety관련해서..)
- Render 단계는 Interruptible하다..?
- `useNativeDriver` and thread
- Object.is()

**공부 기록**

React Native

- 0125: [공식문서 Architecture Overview - 1](https://reactnative.dev/architecture/overview)
- 0126: 공식문서 Architecture Overview - 2
- 0202: `react-native-reanimated` basics
- 0206: [공식문서 Performance Overview](https://reactnative.dev/docs/performance)

React

- 0127: useMemo
- 0128: useCallback
- 0129: useRef

커리어

- 0201: 정말 중요한 하루.
