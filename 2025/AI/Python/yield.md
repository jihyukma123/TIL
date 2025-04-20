# Python의 yield 키워드

yield 라는 키워드가 있는데 이해가 안돼서 뭐하는 앤지 찾아봄.

다음과 같은 코드를 생각해보자..

```python
def fetch_lines(filename):
    with open(filename, 'r') as file:
        lines = []
        for line in file:
            lines.append(line)

        return lines

my_lines = fetch_lines('text.txt')

print(my_lines)
```

읽어야 하는 라인이 몇 줄 되지 않으면 위 코드처럼 파일의 모든 줄을 한 번에 다 순차적으로 읽어서 메모리에 저장해두고 사용하면 됨.

근데 데이터가 몇 만줄이 되는 경우를 생각해보자. 이런 경우에 메모리에 요소가 몇 만개인 배열을 담아서 처리하면 어떤 문제가 있을까?

컴퓨터의 리소스 상황마다 다르겠지만 리소스가 충분치 않은 경우 메모리 관련 에러가 발생한다.

그러면 이 문제를 어떻게 해결할 수 있을까??

이러면 어떨까. 한 번에 한 줄을 읽어서 필요한 처리를 하고, 그 줄을 메모리에서 지우고 다음 줄로 넘어가는 식으로 처리하면????

이러면 기존 방식에 비해서 메모리 관련 문제가 개선될 수 있다.

근데 how..? this is where the `yield` keyword comes in

```python
def fetch_lines(filename):
    with open(filename, 'r') as file:
        for line in file:
            yield line

# yield keyword를 통해서 함수가 generator 함수가 되었음.
my_lines = fetch_lines('text.txt')

print(my_lines) # <generator object fetch_lines at 0x102c0e890>

# 그러면 이 제네레이터 객체에서 어떻게 데이터를 읽지??
print(next(my_lines)) # line 1
print(next(my_lines)) # line 2
print(next(my_lines)) # line 3
print(next(my_lines)) # line 4
```

yield를 사용하면, 포함된 함수가 generator가 되어서 해당 generator객체를 next() 함수에 전달해서 호출할 때마다 yield된 값이 반환된다.

이 궁금증을 자아냈던 다음 코드도 조금 더 이해가 되네

```python
class Database:
    def printName(self):
        print("database name")

    def close(self):
        print("closing db")


def get_db():
    db = Database()
    try:
        yield db # yield키워드를 통해서 generator 함수가 되고, 이 함수가 실행되면 생성되는건 generator 임
    finally:
      # generator가 라이프사이클이 종료될 때 호출
        print('finally 안에서 실행되는 코드')
        db.close()

db_generator = get_db()

db_instance = next(db_generator) # next 함수 사용해서 value를 꺼내줌. yield된 값이 반환되므로 db객체가 반환됨

print(db_generator) # <generator object get_db at 0x1041e7920>
print(db_instance) # <__main__.Database object at 0x1043739e0>

db_instance.printName() # database name

```
