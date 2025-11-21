#!/bin/bash
# Script khởi động MySQL

MYSQL_DIR="/home/runner/mysql"
MYSQL_DATA="$MYSQL_DIR/data"
MYSQL_SOCKET="/tmp/mysql.sock"
MYSQL_PID="/tmp/mysql.pid"
MYSQL_LOG="$MYSQL_DIR/logs/error.log"

# Tạo thư mục nếu chưa có
mkdir -p "$MYSQL_DIR/logs"

# Kiểm tra xem MySQL đã chạy chưa
if [ -f "$MYSQL_PID" ]; then
    PID=$(cat "$MYSQL_PID")
    if ps -p $PID > /dev/null; then
        echo "MySQL đang chạy với PID: $PID"
        exit 0
    fi
fi

# Khởi động MySQL
echo "Đang khởi động MySQL server..."
mysqld \
    --datadir="$MYSQL_DATA" \
    --socket="$MYSQL_SOCKET" \
    --pid-file="$MYSQL_PID" \
    --port=3306 \
    --bind-address=127.0.0.1 \
    --log-error="$MYSQL_LOG" \
    --skip-networking=0 \
    &

# Chờ MySQL khởi động
sleep 5

# Kiểm tra kết nối
if mysql -u root --socket="$MYSQL_SOCKET" -e "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ MySQL đã khởi động thành công!"
    
    # Import schema nếu database chưa tồn tại
    if ! mysql -u root --socket="$MYSQL_SOCKET" -e "USE techzone;" > /dev/null 2>&1; then
        echo "Đang tạo database và import schema..."
        mysql -u root --socket="$MYSQL_SOCKET" < "$(dirname "$0")/database/schema.sql"
        echo "Đang import seed data..."
        mysql -u root --socket="$MYSQL_SOCKET" < "$(dirname "$0")/database/seed.sql"
        echo "✓ Hoàn tất setup database!"
    fi
else
    echo "✗ Không thể kết nối MySQL. Kiểm tra log tại: $MYSQL_LOG"
    exit 1
fi
