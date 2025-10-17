#!/bin/bash
# filepath: /Users/jeff/bin/scrum_creator.sh

# 스크럼 메시지 파일 경로
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRUM_FILE="$SCRIPT_DIR/scrum_message.md"

# 초기 파일이 없으면 생성
if [ ! -f "$SCRUM_FILE" ]; then
    cat > "$SCRUM_FILE" << 'EOF'
**프로토타입**

- N/A

**어제**

- N/A

**오늘**

- N/A

**블로커/공유:**

- N/A
EOF
fi

echo "======================================"
echo "📋 데일리 스크럼 생성기"
echo "======================================"
echo ""

# 현재 저장된 스크럼 메시지 출력
echo "======================================"
echo "📄 현재 저장된 스크럼 메시지:"
echo "======================================"
cat "$SCRUM_FILE"
echo ""
echo "======================================"

# 어제 섹션 읽기 (자동으로 이전 "오늘" 내용을 가져옴)
YESTERDAY_SECTION=$(sed -n '/^\*\*오늘\*\*/,/^\*\*블로커\/공유:\*\*/p' "$SCRUM_FILE" | sed '1d;$d' | sed 's/^[[:space:]]*//')

# 1. 오늘 할 일
echo "오늘 할 일을 입력해주세요 (빈 줄 입력시 종료):"
TODAY_LIST=()
while true; do
    read -p "- " item
    if [ -z "$item" ]; then
        break
    fi
    TODAY_LIST+=("$item")
done
echo ""

# 오늘 항목이 없으면 N/A
if [ ${#TODAY_LIST[@]} -eq 0 ]; then
    TODAY_TEXT="- N/A"
else
    TODAY_TEXT=""
    for item in "${TODAY_LIST[@]}"; do
        TODAY_TEXT+="- $item"$'\n'
    done
    TODAY_TEXT="${TODAY_TEXT%$'\n'}"
fi

# 2. 블로커/공유
echo "블로커/공유 사항을 입력해주세요 (빈 줄 입력시 종료):"
BLOCKER_LIST=()
while true; do
    read -p "- " item
    if [ -z "$item" ]; then
        break
    fi
    BLOCKER_LIST+=("$item")
done
echo ""

# 블로커 항목이 없으면 N/A
if [ ${#BLOCKER_LIST[@]} -eq 0 ]; then
    BLOCKER_TEXT="- N/A"
else
    BLOCKER_TEXT=""
    for item in "${BLOCKER_LIST[@]}"; do
        BLOCKER_TEXT+="- $item"$'\n'
    done
    BLOCKER_TEXT="${BLOCKER_TEXT%$'\n'}"
fi

# Markdown 파일 업데이트
cat > "$SCRUM_FILE" << EOF
**프로토타입**

- N/A

**어제**

$YESTERDAY_SECTION

**오늘**

$TODAY_TEXT

**블로커/공유:**

$BLOCKER_TEXT
EOF

# 최종 스크럼 텍스트 생성 (클립보드용)
SCRUM_TEXT="프로토타입
- N/A
어제
$(echo "$YESTERDAY_SECTION" | sed 's/^//')
오늘
$(echo "$TODAY_TEXT" | sed 's/^//')
블로커/공유:
$(echo "$BLOCKER_TEXT" | sed 's/^//')"

# 클립보드에 복사
echo "$SCRUM_TEXT" | pbcopy

# 화면에 출력
echo "======================================"
echo "✅ 생성된 스크럼 메시지:"
echo "======================================"
echo "$SCRUM_TEXT"
echo ""
echo "======================================"
echo "📋 클립보드에 복사되었습니다!"
echo "💾 $SCRUM_FILE 파일이 업데이트되었습니다."
echo "======================================"

# VS Code로 파일 열기
code "$SCRUM_FILE"

echo ""
echo "📝 VS Code에서 파일을 열었습니다."