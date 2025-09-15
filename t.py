async def fa():
    return 1


result = fa()

print(result)  # <coroutine object fa at 0x104c58ca0>
# RuntimeWarning: coroutine 'fa' was never awaited

# await나, asyncio와 같은 비동기 실행 메커니즘을 활용해서 실행하지 않으면, 함수의 실행 결과는 코루틴 객체임.


# coroutine, asyncio 의 동작원리를 이해하기..

# https://stackoverflow.com/questions/49005651/how-does-asyncio-actually-work
# Generator를 이해해야 한다.
