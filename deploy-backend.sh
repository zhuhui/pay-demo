#!/bin/bash

# PDF Master 后端部署脚本（适用于 Render.com）
# 使用方法：
# 1. 访问 https://dashboard.render.com/
# 2. 创建 New Web Service
# 3. 选择 Build from Git repository
# 4. 选择本项目
# 5. 配置：
#    - Root Directory: ./pdfmaster-service
#    - Runtime: Docker
#    - Dockerfile: ./Dockerfile
#    - Port: 8000

set -e

echo "🚀 PDF Master Backend Deployment Script"
echo "========================================="
echo ""
echo "Backend Directory: ./pdfmaster-service"
echo "Runtime: Docker"
echo "Port: 8000"
echo ""
echo "部署步骤："
echo "1. 访问 https://dashboard.render.com/"
echo "2. 点击 'New +' → 'Web Service'"
echo "3. 选择 'Build and deploy from a Git repository'"
echo "4. 选择本项目的 GitHub 仓库"
echo "5. 配置："
echo "   - Name: pdfmaster-api"
echo "   - Root Directory: ./pdfmaster-service"
echo "   - Runtime: Docker"
echo "   - Port: 8000"
echo ""
echo "部署完成后，会获得类似 https://pdfmaster-api.onrender.com 的 URL"
echo ""
