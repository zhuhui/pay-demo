#!/bin/bash

# PDF Master 一键自动部署脚本
# 支持：Docker 本地部署 / Render / Vercel / GitHub Pages

set -e

echo "🚀 PDF Master Auto Deployment"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 显示进度
show_progress() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

show_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 部署方式选择
echo "请选择部署方式："
echo "1) Docker 本地部署（推荐，最简单）"
echo "2) Render + Vercel（免费云服务）"
echo "3) GitHub Pages + Render（纯免费）"
echo "4) Fly.io（免费额度）"
echo ""
read -p "输入选项 (1-4): " DEPLOY_OPTION

case $DEPLOY_OPTION in
    1)
        show_progress "开始 Docker 本地部署..."
        
        # 检查 Docker
        if ! command_exists docker; then
            show_error "Docker 未安装，请先安装 Docker"
            echo "安装指南：https://docs.docker.com/get-docker/"
            exit 1
        fi
        
        if ! command_exists docker-compose; then
            show_error "Docker Compose 未安装"
            exit 1
        fi
        
        # 构建并启动
        show_progress "构建并启动服务..."
        docker-compose up --build -d
        
        show_success "部署完成！"
        echo ""
        echo "访问地址："
        echo "  前端: http://localhost:3000"
        echo "  后端: http://localhost:8000"
        echo "  API 文档: http://localhost:8000/docs"
        echo ""
        echo "停止服务: docker-compose down"
        echo "查看日志: docker-compose logs -f"
        ;;
        
    2)
        show_progress "开始 Render + Vercel 部署..."
        
        # 检查 git
        if ! command_exists git; then
            show_error "Git 未安装"
            exit 1
        fi
        
        # 提交代码
        show_progress "提交代码到 GitHub..."
        git add .
        git commit -m "Prepare for deployment" || true
        git push origin main
        
        show_success "代码已推送！"
        echo ""
        echo "接下来请完成以下步骤："
        echo ""
        echo "1. 部署后端到 Render:"
        echo "   - 访问: https://dashboard.render.com/"
        echo "   - 点击 'New +' → 'Web Service'"
        echo "   - 选择您的 GitHub 仓库"
        echo "   - 配置: Root Directory = ./pdfmaster-service"
        echo "   - Runtime = Docker, Port = 8000"
        echo ""
        echo "2. 获取后端 URL 后，更新前端配置:"
        echo "   echo 'NEXT_PUBLIC_API_URL=https://your-api.onrender.com' > pdfmaster/.env.local"
        echo ""
        echo "3. 部署前端到 Vercel:"
        echo "   - 访问: https://vercel.com/"
        echo "   - 导入 GitHub 仓库"
        echo "   - Root Directory = ./pdfmaster"
        echo ""
        ;;
        
    3)
        show_progress "开始 GitHub Pages + Render 部署..."
        
        # 构建前端静态文件
        show_progress "构建前端..."
        cd pdfmaster
        npm install
        npm run build
        cd ..
        
        # 创建 gh-pages 分支
        show_progress "创建部署分支..."
        git add pdfmaster/dist -f
        git commit -m "Deploy to GitHub Pages" || true
        
        # 使用 subtree 推送到 gh-pages
        git subtree push --prefix pdfmaster/dist origin gh-pages 2>/dev/null || {
            show_progress "创建 gh-pages 分支..."
            git push origin `git subtree split --prefix pdfmaster/dist main`:gh-pages --force
        }
        
        show_success "前端已部署到 GitHub Pages！"
        echo ""
        echo "访问地址: https://$(git remote get-url origin | sed 's/.*github.com\///' | sed 's/\.git$//' | sed 's/\//.github.io\//').github.io"
        echo ""
        echo "⚠️  注意：需要在 GitHub 仓库设置中启用 Pages"
        echo "   Settings → Pages → Source → gh-pages branch"
        echo ""
        echo "现在部署后端到 Render（参见选项 2）"
        ;;
        
    4)
        show_progress "开始 Fly.io 部署..."
        
        if ! command_exists fly; then
            show_progress "安装 Fly.io CLI..."
            curl -L https://fly.io/install.sh | sh
            export PATH="$HOME/.fly/bin:$PATH"
        fi
        
        # 登录
        show_progress "请登录 Fly.io..."
        fly auth login
        
        # 部署后端
        cd pdfmaster-service
        fly launch --name pdfmaster-api --port 8000 --no-deploy
        fly deploy
        cd ..
        
        show_success "后端部署完成！"
        echo "获取 URL: fly status"
        ;;
        
    *)
        show_error "无效选项"
        exit 1
        ;;
esc

show_success "部署脚本执行完毕！"
