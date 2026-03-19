#!/bin/bash
set -e

echo "========================================="
echo "  VideoHub 视频分享平台 - 一键部署脚本"
echo "========================================="
echo ""

# --- Step 1: Check Docker ---
if ! command -v docker &> /dev/null; then
    echo "[1/4] 正在安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "Docker 安装完成。如果这是第一次安装，请重新登录后再运行此脚本。"
    echo "运行: exit 然后重新 SSH 登录，再执行 bash deploy.sh"
    exit 0
else
    echo "[1/4] Docker 已安装 ✓"
fi

# --- Step 2: Get server IP ---
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "")

if [ -z "$SERVER_IP" ]; then
    read -p "请输入你的服务器公网 IP 地址: " SERVER_IP
else
    echo "[2/4] 检测到服务器 IP: $SERVER_IP"
    read -p "确认使用此 IP？(回车确认，或输入其他 IP): " INPUT_IP
    if [ -n "$INPUT_IP" ]; then
        SERVER_IP="$INPUT_IP"
    fi
fi

# --- Step 3: Generate .env.production ---
echo "[3/4] 生成环境配置..."

AUTH_SECRET=$(openssl rand -base64 32)

cat > .env.production <<EOF
AUTH_SECRET=${AUTH_SECRET}
NEXT_PUBLIC_SOCKET_URL=http://${SERVER_IP}
CORS_ORIGIN=http://${SERVER_IP}
EOF

echo "配置文件已生成 ✓"

# --- Step 4: Build and start ---
echo "[4/4] 构建并启动服务..."

# Use .env.production for docker compose
cp .env.production .env

docker compose up -d --build

echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""
echo "访问地址: http://${SERVER_IP}"
echo ""
echo "常用命令:"
echo "  查看日志:   docker compose logs -f"
echo "  重启服务:   docker compose restart"
echo "  停止服务:   docker compose down"
echo "  查看状态:   docker compose ps"
echo ""
