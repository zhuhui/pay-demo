#!/bin/bash

# PDF Master 本地生产环境部署脚本
# 不依赖 Docker，直接运行服务

set -e

echo "🚀 PDF Master Local Production Deployment"
echo "=========================================="
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}[1/4]${NC} 安装后端依赖..."
cd pdfmaster-service
pip3 install -q -r requirements.txt
cd ..

echo -e "${YELLOW}[2/4]${NC} 安装前端依赖..."
cd pdfmaster
npm install -q
cd ..

echo -e "${YELLOW}[3/4]${NC} 构建前端..."
cd pdfmaster
npm run build
cd ..

echo -e "${YELLOW}[4/4]${NC} 启动服务..."

# 创建启动脚本
cat > start-production.sh << 'EOF'
#!/bin/bash
echo "Starting PDF Master Production Servers..."
echo ""

# 创建日志目录
mkdir -p logs

# 启动后端
echo "Starting Backend on http://localhost:8000"
cd pdfmaster-service
python3 main.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端（使用 npx serve）
echo "Starting Frontend on http://localhost:3000"
cd pdfmaster/dist
npx serve -l 3000 -s > ../../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

echo ""
echo "✅ Services started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Logs:"
echo "   Backend:  logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "🛑 Stop servers: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# 保存 PID
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待中断
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
echo "Press Ctrl+C to stop"
wait
EOF

chmod +x start-production.sh

echo ""
echo -e "${GREEN}✅ Build completed!${NC}"
echo ""
echo "启动生产环境："
echo "  ./start-production.sh"
echo ""
