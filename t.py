import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 1. 설정
num_rows = 30000
categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty']
regions = ['Seoul', 'Gyeonggi', 'Busan', 'Daegu', 'Incheon']
payments = ['Credit Card', 'Bank Transfer', 'Samsung Pay', 'Cash']

# 2. 데이터 생성
np.random.seed(42) # 결과 재현을 위해 시드 고정

data = {
    'Order_ID': [f'ORD-2026-{i:05d}' for i in range(1, num_rows + 1)],
    'Date': [datetime(2025, 1, 1) + timedelta(days=np.random.randint(0, 365)) for _ in range(num_rows)],
    'Customer_ID': [f'CUST-{np.random.randint(1000, 2000)}' for _ in range(num_rows)],
    'Product_Category': [np.random.choice(categories) for _ in range(num_rows)],
    'Region': [np.random.choice(regions) for _ in range(num_rows)],
    'Payment_Method': [np.random.choice(payments) for _ in range(num_rows)],
    'Unit_Price': np.random.randint(10, 1000, size=num_rows) * 1000,
    'Quantity': np.random.randint(1, 11, size=num_rows),
    'Discount_Rate': np.random.uniform(0, 0.2, size=num_rows).round(2)
}

df = pd.DataFrame(data)

# 3. 계산된 컬럼 추가
df['Total_Price'] = df['Unit_Price'] * df['Quantity']
df['Final_Price'] = (df['Total_Price'] * (1 - df['Discount_Rate'])).astype(int)

# 4. 엑셀 파일로 저장
import os
desktop_path = os.path.expanduser('~/Desktop')
file_name = '30000_row_test_data.xlsx'
file_path = os.path.join(desktop_path, file_name)
df.to_excel(file_path, index=False)

print(f"✅ {num_rows}행의 데이터가 '{file_path}'에 저장되었습니다.")