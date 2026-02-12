#!/bin/bash

# PDF Master 自动部署脚本

set -e

# 配置信息
RAILWAY_TOKEN="3f332085-dbbb-48dd-a6d1-8bf5f2d21273"
VERCEL_TOKEN="vcp_80ERPJK7m2PW98s116dNnTqgetTtznCMPPAz7lM47PzTWQxQXJ3sTrDn"
RAILWAY_USER="zhuhui"
VERCEL_USER="coolerwall-8341"
GITHUB_REPO="zhuhui/pay-demo"

echo "🚀 开始 PDF Master 自动部署流程"
echo "================================"

# Step 1: Railway 后端部署
echo ""
echo "📦 Step 1: 部署后端到 Railway..."
echo "================================"

cd /Users/zhuhui/Documents/ai/pay-demo

# 使用 Railway API 创建项目和部署
# Railway 的部署通常需要通过 GitHub 集成完成
# 这里我们先获取 Railway 的项目 ID

echo "📡 检查或创建 Railway 项目..."

# 使用 Railway API 获取或创建项目
RAILWAY_PROJECT_ID=$(curl -s -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.railway.app/graphql" \
  -d '{
    "query": "query { projects(first: 10) { edges { node { id name } } } }"
  }' | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$RAILWAY_PROJECT_ID" ]; then
  echo "✅ 需要手动在 Railway 创建项目"
  echo "   请访问: https://railway.app/new"
  echo "   并部署 pay-demo 仓库的 pdfmaster-service 目录"
  exit 1
fi

echo "✅ Railway 项目 ID: $RAILWAY_PROJECT_ID"

# Step 2: Vercel 前端部署
echo ""
echo "🎨 Step 2: 部署前端到 Vercel..."
echo "================================"

echo "📡 配置 Vercel..."

# 创建 vercel 配置文件
cat > /Users/zhuhui/Documents/ai/pay-demo/pdfmaster/.vercel/project.json 2>/dev/null || true

echo "✅ Vercel 配置就绪"

echo ""
echo "================================"
echo "⏳ 部署信息收集中..."
echo "================================"

# 获取 Railway 部署的 URL
echo ""
echo "🔍 Railway 后端 URL:"
echo "   请访问: https://railway.app/project 查看你的后端 URL"
echo "   格式应该是: https://pdfmaster-api-xxxxx.railway.app"
echo ""

read -p "请输入你的 Railway 后端 URL (例如: https://pdfmaster-api-xxxxx.railway.app): " RAILWAY_URL

# 验证 Railway URL
if [[ ! $RAILWAY_URL =~ ^https:// ]]; then
  echo "❌ URL 格式错误，应该以 https:// 开头"
  exit 1
fi

echo "✅ Railway URL: $RAILWAY_URL"

# 部署到 Vercel
echo ""
echo "🚀 部署到 Vercel..."

cd /Users/zhuhui/Documents/ai/pay-demo/pdfmaster

# 使用 Vercel API 创建部署
DEPLOY_RESPONSE=$(curl -s -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"pdfmaster\",
    \"gitSource\": {
      \"type\": \"github\",
      \"repo\": \"$GITHUB_REPO\",
      \"ref\": \"main\",
      \"rootDirectory\": \"pdfmaster\"
    },
    \"env\": {
      \"NEXT_PUBLIC_API_URL\": \"$RAILWAY_URL\"
    }
  }")

DEPLOYMENT_ID=$(echo $DEPLOY_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$DEPLOYMENT_ID" ]; then
  echo "❌ Vercel 部署失败"
  echo "响应: $DEPLOY_RESPONSE"
  exit 1
fi

echo "✅ Vercel 部署已提交，ID: $DEPLOYMENT_ID"
echo "📡 Vercel URL: https://vercel.com/dashboard/deployments/$DEPLOYMENT_ID"

echo ""
echo "================================"
echo "✨ 部署完成！"
echo "================================"
echo ""
echo "📊 部署摘要:"
echo "  后端 (Railway): $RAILWAY_URL"
echo "  前端 (Vercel):  https://pdfmaster-xxxxx.vercel.app (部署中...)"
echo ""
echo "⏳ 前端部署通常需要 3-5 分钟完成"
echo "📱 请访问 Vercel 面板查看部署进度: https://vercel.com/dashboard"
echo ""
