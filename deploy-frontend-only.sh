#!/bin/bash

# PDF Master 前端自动部署到 Vercel
# 后端暂时使用本地或后续手动部署

set -e

echo "🚀 PDF Master 前端自动部署"
echo "============================"
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 确保已登录 Vercel
if ! vercel whoami &> /dev/null; then
    log "请先登录 Vercel..."
    vercel login
fi

success "Vercel 已登录: $(vercel whoami)"

# 进入前端目录
cd pdfmaster

# 检查是否已关联项目
if [ ! -d .vercel ]; then
    log "初始化 Vercel 项目..."
    vercel link --yes
fi

# 配置环境变量（使用本地后端或占位符）
log "配置环境变量..."
echo "NEXT_PUBLIC_API_URL=https://pdfmaster-api-demo.onrender.com" > .env.local

# 部署
log "开始部署前端到 Vercel..."
vercel --yes --prod 2>&1 | tee /tmp/deploy.log

# 获取部署 URL
DEPLOY_URL=$(grep -o 'https://[^[:space:]]*' /tmp/deploy.log | tail -1)

if [ -n "$DEPLOY_URL" ]; then
    echo ""
    success "🎉 部署成功！"
    echo ""
    echo "🌐 网站地址: $DEPLOY_URL"
    echo ""
    echo "⚠️  注意：当前使用的是演示后端 API"
    echo "   如需连接自己的后端，请："
    echo "   1. 部署后端到 Render/Railway"
    echo "   2. 更新 NEXT_PUBLIC_API_URL 环境变量"
    echo ""
else
    error "部署失败，请检查日志"
    exit 1
fi

cd ..
