# TIL

주제별로 공부한 내용을 묶어서 정리하자

## React Native

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

**리액트 네이티브 구조 관련 공부**

- 0125: [공식문서 Architecture Overview - 1](https://reactnative.dev/architecture/overview)
- 0126: 공식문서 Architecture Overview - 2
