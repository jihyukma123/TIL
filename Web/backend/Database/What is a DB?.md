# 설계에 대해서...

설계는 컴퓨터에서 하기 보다는.... `design`이니까 실제로 그림을 그려보는 것이 도움이 된다..!

[Database Design Course](https://www.youtube.com/watch?v=ztHopE5Wnpc)

# DB란?

설계를 하려면 뭔지 알아야겠지??

`data` 저장소.

그러면 `data`는 뭔데??

정의를 좀 포괄적으로, 크게 생각해보라고 함. 무엇이든지 될 수 있다고...내가 저장하고자 하는 그 무언가.

그래서 사실 저장하고자 하는 그 무언가가 정말 무엇이든지 될 수 있기 때문에 DB도 사실 그만큼 범위가 참 넓다고 볼 수 있음.

근데 그러면 spreadsheet랑 다른게 뭐야??

spreadsheet에 비해서 더 데이터를 관리할 수 있는 기능이 많이 제공됨..ㅎㅎ 접근 제어 등..

# RDB..? Relational Database?

Relation is connection between data.

Entity - anything we store data about(Person)
Attribute - what we store(name, age,...etc)

Table의

- row는 entity instance라고 볼 수 있고,
- column은 entity attribute의 값 집합

# DBMS? RDBMS?

Database Management System이 뭐야??

RDB에 데이터를 저장만 하냐? 아니지. 정보를 사용을 해야되는데 사용하기 위해서 전반적으로 CRUD 작업을 하는 것을 Query라고 통칭함.

RDB에 저장된 정보를 잘, 편하게 사용하기 위해서는 Management System을 사용하게 됨.

DBMS는..

- allows us run queries to access data in the rdb.
- allows us to change the data is presented.(view mechanism - change the surface appearance of our data)
  - 사용자가 필요한 데이터를 기반으로 View를 생성해서 사용할 수 있도록 기능을 제공함.(id, username, password, email 중에서 username, password만 보고싶은 경우와, email만 보고싶은 경우에 각각 서로 다른 View를 생성해서 볼 수 있음. hence, view mechanism.)
- 접근/조작제어

RDBMS는...

- Transaction을 처리할 수 있게 해준다.(all or nothing)

MySQL, SQL Server, Postgresql 등등 기술들이 바로 RDBMS.

사실상 DB 관련해서 보게 되는 큰 이름들이 RDBMS기술이다..

RDB와 RDBMS는 사실상 한몸이지만, 개념적으로는..

- RDB는 데이터 저장소,
- RDBMS는 저장된 데이터를 조작할 수 있게 해주는 시스템

한 가지 중요한 RDBMS 기능은, 데이터를 표시하는 계층에 data consistency를 제공한다는 점.
