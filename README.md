# PDF Master - 完整架构

## 🏗️ 项目结构

```
pay-demo/
├── pdfmaster/                    # Next.js 前端 (ToC)
│   ├── app/
│   ├── components/
│   ├── .env.local               # API 地址配置
│   └── package.json
│
└── pdfmaster-service/           # Python 后端 (ToB API)
    ├── main.py                  # FastAPI 主应用
    ├── requirements.txt         # Python 依赖
    ├── Dockerfile              # Docker 配置
    ├── docker-compose.yml      # 本地开发
    └── railway.json            # Railway 部署配置
```

## 🚀 快速开始

### 1. 启动后端服务

```bash
cd pdfmaster-service

# 方式 A: Docker (推荐)
docker-compose up -d

# 方式 B: 本地 Python
pip install -r requirements.txt
python main.py
```

后端运行在: http://localhost:8000
API 文档: http://localhost:8000/docs

### 2. 启动前端

```bash
cd pdfmaster
npm install
npm run dev
```

前端运行在: http://localhost:3000

## 📡 API 接口

### PDF 处理

```
POST /api/v1/pdf/merge      # 合并 PDF
POST /api/v1/pdf/split      # 拆分 PDF (TODO)
POST /api/v1/pdf/info       # 获取 PDF 信息
```

### 系统

```
GET /                       # 服务信息
GET /health                 # 健康检查
```

## 💰 商业化方案

### ToC (前端)
- 免费工具吸引用户
- 展示 API 能力
- 开发者文档

### ToB (API)
- 免费层: 100次/月
- Pro层: $19/月 或 $0.01/次
- 企业层: 定制

## 🛠️ 技术栈

### 后端 (Python)
- FastAPI - 高性能 API 框架
- pypdf - PDF 处理
- pdfplumber - 表格提取
- Pillow - 图片处理
- boto3 - 云存储

### 前端 (Next.js)
- React 19
- Tailwind CSS
- TypeScript

## 📝 TODO

- [ ] 部署后端到 Railway
- [ ] 配置 Cloudflare R2 存储
- [ ] 实现 API Key 认证
- [ ] 实现 PDF 拆分功能
- [ ] 实现表格提取功能
- [ ] 编写 API 文档
- [ ] 添加使用统计
- [ ] 添加更多工具 (图片/视频)

## 🔗 部署

### Railway (推荐)

```bash
cd pdfmaster-service
railway login
railway init
railway up
```

### 环境变量

后端需要:
```
TEMP_DIR=/tmp/pdfmaster
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=pdfmaster
```

前端需要:
```
NEXT_PUBLIC_API_URL=https://your-service.railway.app
```
