#!/bin/bash

# PDF Master 全自动云端部署脚本
# 此脚本将自动安装 CLI 工具并部署到生产环境

set -e

echo "🚀 PDF Master 自动云端部署"
echo "============================"
echo ""

# 颜色
RED='\033[0;31m'
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

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查是否已安装 CLI
check_cli() {
    log "检查 CLI 工具..."
    
    if ! command -v vercel &> /dev/null; then
        log "安装 Vercel CLI..."
        npm install -g vercel@latest
    fi
    
    if ! command -v railway &> /dev/null; then
        log "安装 Railway CLI..."
        npm install -g @railway/cli@latest
    fi
    
    success "CLI 工具已就绪"
}

# 登录到云平台
login_cloud() {
    log "检查云端登录状态..."
    
    # 检查 Vercel 登录
    if ! vercel whoami &> /dev/null; then
        log "请登录 Vercel..."
        vercel login
    else
        success "Vercel 已登录: $(vercel whoami)"
    fi
    
    # 检查 Railway 登录
    if ! railway whoami &> /dev/null; then
        log "请登录 Railway..."
        railway login
    else
        success "Railway 已登录: $(railway whoami)"
    fi
}

# 部署后端到 Railway
deploy_backend() {
    log ""
    log "=========================================="
    log "部署后端到 Railway"
    log "=========================================="
    
    cd pdfmaster-service
    
    # 检查是否已关联项目
    if [ ! -f .railway/config.json ]; then
        log "初始化 Railway 项目..."
        railway init --name pdfmaster-api
    fi
    
    # 部署
    log "开始部署后端..."
    railway up --detach
    
    # 获取 URL
    BACKEND_URL=$(railway domain)
    if [ -z "$BACKEND_URL" ]; then
        error "无法获取后端 URL"
        exit 1
    fi
    
    success "后端部署成功: $BACKEND_URL"
    
    cd ..
    echo "$BACKEND_URL" > .backend.url
}

# 部署前端到 Vercel
deploy_frontend() {
    log ""
    log "=========================================="
    log "部署前端到 Vercel"
    log "=========================================="
    
    cd pdfmaster
    
    # 更新环境变量
    if [ -f ../.backend.url ]; then
        BACKEND_URL=$(cat ../.backend.url)
        log "更新 API URL: $BACKEND_URL"
        echo "NEXT_PUBLIC_API_URL=$BACKEND_URL" > .env.local
    fi
    
    # 检查是否已关联项目
    if [ ! -d .vercel ]; then
        log "初始化 Vercel 项目..."
        vercel link --yes
    fi
    
    # 部署
    log "开始部署前端..."
    vercel --yes --prod
    
    # 获取 URL
    FRONTEND_URL=$(vercel ls --meta | grep -o 'https://[^[:space:]]*' | head -1)
    
    success "前端部署成功: $FRONTEND_URL"
    
    cd ..
    echo "$FRONTEND_URL" > .frontend.url
}

# 显示部署结果
show_results() {
    log ""
    log "=========================================="
    log "🎉 部署完成！"
    log "=========================================="
    
    if [ -f .backend.url ]; then
        echo ""
        echo "🔌 后端 API: $(cat .backend.url)"
        echo "   健康检查: $(cat .backend.url)/health"
        echo "   API 文档: $(cat .backend.url)/docs"
    fi
    
    if [ -f .frontend.url ]; then
        echo ""
        echo "🌐 前端网站: $(cat .frontend.url)"
    fi
    
    echo ""
    echo "管理面板:"
    echo "   Railway: https://railway.app/dashboard"
    echo "   Vercel:  https://vercel.com/dashboard"
    echo ""
}

# 主流程
main() {
    check_cli
    login_cloud
    deploy_backend
    deploy_frontend
    show_results
}

# 运行
main
