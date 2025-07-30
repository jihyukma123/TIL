# SSD의 수명..?

백엔드 강의 듣다가,

비동기 처리의 예시 중에서 OS가 파일에서 발생하는 write를 바로바로 동기적으로 disk에 저장하는게 아니라 disk write가 너무 많이 발생하지 않게 하기 위해서 cache에 먼저 저장하고 일정량이 모였을 때 한 번에 disk에 쓴다고 한다.

자주 write가 발생하면 SSD 수명에 안좋다고 함...

## claude와의 대화

### 내 질문

(SSD 관점에서 보면, 동일한 위치에 write를 많이 수행하면 죽는다고 함 해당 부분이. 이건 또 신기하네)

이거 맞아? 결국 우리가 봤을때는 write라는게 개념적이지만, 컴퓨터 관점에서 보면 언젠간 물리적인 write가 발생해야하잖아 해당 page에 ssd안에 있는 그래서 많이 사용하면 언젠간 닳아서 골로간다는건가?

### 클로드 답변

네, 정확히 맞습니다! SSD는 **물리적으로 마모되는 저장장치**입니다.

## **SSD의 물리적 구조**

### **NAND Flash Memory**

```

SSD 내부
┌─────────────────────────────────┐
│ NAND Flash Cell들 │
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │Cell1│ │Cell2│ │Cell3│ ... │
│ └─────┘ └─────┘ └─────┘ │
└─────────────────────────────────┘

```

각 Cell은 **전자를 가두는 물리적 구조**입니다.

### **Write 작업의 물리적 과정**

```

1. 전자 주입 (Program) - 높은 전압 인가
   ┌─────────────┐
   │ ████████ │ ← 전자들이 들어감
   └─────────────┘

2. 전자 제거 (Erase) - 더 높은 전압 인가
   ┌─────────────┐
   │ │ ← 전자들이 빠져나감
   └─────────────┘

```

## **왜 마모될까?**

### **물리적 손상**

```python
# 개념적으로는 이렇게 보이지만
with open('file.txt', 'w') as f:
    for i in range(100000):
        f.write(f"data {i}\n")  # 같은 파일에 계속 쓰기
```

**실제 SSD 내부에서는:**

```
같은 Cell에 반복적인 전압 인가
        ↓
절연체(Oxide layer) 손상
        ↓
전자가 새어나감 (Electron leakage)
        ↓
데이터 저장 불가 → Cell 죽음 💀
```

## **SSD의 수명 측정**

### **P/E Cycles (Program/Erase Cycles)**

```
- SLC NAND: ~100,000 P/E cycles
- MLC NAND: ~10,000 P/E cycles
- TLC NAND: ~3,000 P/E cycles
- QLC NAND: ~1,000 P/E cycles
```

### **실제 예시**

```python
# 이 코드가 위험한 이유
log_file = open('app.log', 'w')
while True:
    log_file.write(f"{time.now()}: event\n")
    log_file.flush()  # 같은 위치에 계속 쓰기!
    # → 해당 NAND Cell만 계속 마모
```

## **SSD가 어떻게 대응하나? - Wear Leveling**

### **동적 분산**

```
OS 관점: file.txt (같은 위치)
         ↓
SSD 내부: 실제로는 다른 물리적 위치에 분산 저장

Write #1: Physical Block 100
Write #2: Physical Block 250
Write #3: Physical Block 050
...
```

### **FTL (Flash Translation Layer)**

```
논리 주소 → 물리 주소 매핑

논리 주소 1000 → 물리 블록 A (1회차)
논리 주소 1000 → 물리 블록 B (2회차)
논리 주소 1000 → 물리 블록 C (3회차)
```

## **그럼에도 결국 닳는다**

### **Write Amplification**

```python
# 4KB 파일 수정
with open('small.txt', 'w') as f:
    f.write('hi')  # 4KB

# SSD 내부에서는
# 1. 전체 Block (예: 256KB) 읽기
# 2. 4KB 수정
# 3. 전체 Block 다시 쓰기
# → 4KB 쓰려고 256KB 실제 write!
```

### **실제 수명**

```
일반 사용자: 5-10년
서버 환경 (heavy write): 2-3년
데이터베이스 서버: 1-2년
```

**핵심**: 네, 맞습니다. SSD는 **물리적으로 마모되는 부품**이고, write 작업은 결국 **전자적 구조의 물리적 변화**를 일으켜서 수명을 소모합니다. 그래서 SSD 제조사들이 Wear Leveling 같은 기술로 수명을 연장하려고 노력하는 거죠!
