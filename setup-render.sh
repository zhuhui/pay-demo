#!/bin/bash

# 创建 Render 蓝图文件用于自动部署
# 用户需要在 Render Dashboard 中导入此项目

echo "Creating Render deployment blueprint..."

cat > render.yaml << 'EOF'
services:
  - type: web
    name: pdfmaster-api
    runtime: docker
    rootDir: pdfmaster-service
    plan: free
    dockerfilePath: ./Dockerfile
    envVars:
      - key: PORT
        value: 8000
      - key: PYTHON_VERSION
        value: 3.11
    healthCheckPath: /health
    autoDeploy: true
EOF

echo "✅ Render 配置文件已创建"
echo ""
echo "请按以下步骤完成后端部署："
echo ""
echo "1. 访问 https://dashboard.render.com/"
echo "2. 点击 'New +' → 'Blueprint'"
echo "3. 选择您的 GitHub 仓库"
echo "4. Render 会自动读取 render.yaml 并部署"
echo "5. 部署完成后，会提供类似 https://pdfmaster-api.onrender.com 的 URL"
echo ""
echo "获取到后端 URL 后，告诉我，我会更新前端配置！"
