#!/bin/bash

echo "🧪 PDF Master 架构验证测试"
echo "================================"
echo ""

# 测试 1: 后端健康检查
echo "✅ 测试 1: 后端健康检查"
curl -s http://localhost:8000/health | grep -q "healthy" && echo "   通过" || echo "   失败"
echo ""

# 测试 2: 前端页面
echo "✅ 测试 2: 前端页面"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" = "200" ]; then
    echo "   通过 (HTTP 200)"
else
    echo "   失败 (HTTP $response)"
fi
echo ""

# 测试 3: 工具页面
echo "✅ 测试 3: PDF 合并页面"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tools/merge-pdf)
if [ "$response" = "200" ]; then
    echo "   通过 (HTTP 200)"
else
    echo "   失败 (HTTP $response)"
fi
echo ""

echo "================================"
echo "📝 验证结果:"
echo "   后端地址: http://localhost:8000"
echo "   前端地址: http://localhost:3000"
echo "   合并页面: http://localhost:3000/tools/merge-pdf"
echo ""
echo "🎯 请手动测试:"
echo "   1. 打开浏览器访问 http://localhost:3000"
echo "   2. 点击 'Merge PDF' 工具"
echo "   3. 上传 2 个 PDF 文件"
echo "   4. 点击合并按钮"
echo "   5. 检查是否能下载文件"
echo ""
echo "⚠️  当前是测试模式，后端只返回第一个文件"
echo "   真实 PDF 合并需要安装 pypdf: pip install pypdf"
