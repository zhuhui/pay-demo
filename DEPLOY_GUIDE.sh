#!/bin/bash

# PDF Master 完整部署方案

echo "🚀 PDF Master 完整云端部署"
echo "============================"
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}✅ 前端已部署成功！${NC}"
echo ""
echo "🌐 前端地址: https://pdfmaster-kappa.vercel.app"
echo ""
echo "⚠️  现在需要部署后端："
echo ""
echo "方案 1: Render（推荐，免费）"
echo "---------------------------"
echo "1. 访问 https://dashboard.render.com/"
echo "2. 点击 'New +' → 'Web Service'"
echo "3. 连接 GitHub 仓库: zhuhui/pay-demo"
echo "4. 配置："
echo "   - Name: pdfmaster-api"
echo "   - Root Directory: ./pdfmaster-service"
echo "   - Runtime: Docker"
echo "   - Port: 8000"
echo "5. 点击 'Create Web Service'"
echo "6. 等待部署完成（约 3-5 分钟）"
echo "7. 获取 URL: https://pdfmaster-api.onrender.com"
echo ""
echo "方案 2: Railway（免费额度）"
echo "--------------------------"
echo "1. 访问 https://railway.app/"
echo "2. 点击 'New Project' → 'Deploy from GitHub repo'"
echo "3. 选择仓库并部署"
echo ""
echo "方案 3: Fly.io（免费额度）"
echo "-------------------------"
echo "1. 访问 https://fly.io/"
echo "2. 运行: fly launch"
echo "3. 选择 Dockerfile 部署"
echo ""
echo "完成后端部署后："
echo "1. 获取后端 URL（例如: https://xxx.onrender.com）"
echo "2. 在 Vercel 项目设置中添加环境变量："
echo "   NEXT_PUBLIC_API_URL=https://your-backend-url"
echo "3. 重新部署前端: vercel --prod"
echo ""
