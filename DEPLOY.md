# PDF Master 部署指南

## 🚀 快速部署（推荐）

### 1. 部署后端（Render）

**步骤：**
1. 访问 https://dashboard.render.com/
2. 点击 "New +" → "Web Service"
3. 选择 "Build and deploy from a Git repository"
4. 连接您的 GitHub 仓库
5. 配置：
   - **Name**: `pdfmaster-api`
   - **Root Directory**: `./pdfmaster-service`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Port**: `8000`
6. 点击 "Create Web Service"

**获取 URL：**
部署完成后，Render 会提供一个类似 `https://pdfmaster-api.onrender.com` 的 URL

### 2. 部署前端（Vercel）

**步骤：**
1. 访问 https://vercel.com/
2. 点击 "Add New..." → "Project"
3. 导入您的 GitHub 仓库
4. 配置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./pdfmaster`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. 环境变量：
   ```
   NEXT_PUBLIC_API_URL=https://pdfmaster-api.onrender.com
   ```
6. 点击 "Deploy"

**获取 URL：**
部署完成后，Vercel 会提供类似 `https://pdfmaster.vercel.app` 的 URL

---

## 📁 项目结构

```
pay-demo/
├── pdfmaster/              # 前端（Next.js）
│   ├── app/
│   ├── components/
│   └── .env.local         # API URL 配置
├── pdfmaster-service/      # 后端（Python FastAPI）
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── render.yaml            # Render 部署配置
└── README.md              # 本文件
```

---

## ⚙️ 环境变量

### 前端（.env.local）
```
NEXT_PUBLIC_API_URL=https://pdfmaster-api.onrender.com
```

### 后端（无需额外配置）
后端使用默认配置，自动监听 PORT 环境变量

---

## 🔧 备选部署方案

### 方案 A：Railway（付费但有免费额度）
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 部署后端
cd pdfmaster-service
railway init
railway up

# 获取 URL 后更新前端环境变量
```

### 方案 B：Fly.io（免费）
```bash
# 安装 Fly.io CLI
curl -L https://fly.io/install.sh | sh

# 登录
fly auth login

# 部署后端
cd pdfmaster-service
fly launch
fly deploy
```

### 方案 C：自建服务器
```bash
# 服务器上运行
cd pdfmaster-service
docker build -t pdfmaster-api .
docker run -p 8000:8000 pdfmaster-api
```

---

## ✅ 部署检查清单

- [ ] 后端成功部署到 Render
- [ ] 后端健康检查通过（访问 /health）
- [ ] 获取后端 URL
- [ ] 更新前端 .env.local 中的 API URL
- [ ] 前端成功部署到 Vercel
- [ ] 测试所有工具功能正常

---

## 🐛 常见问题

**Q: 前端无法连接后端？**
A: 检查 CORS 配置和后端 URL 是否正确

**Q: 文件上传失败？**
A: 检查后端文件大小限制和临时目录权限

**Q: 构建失败？**
A: 检查 Node.js 版本（需要 18+）和依赖安装

---

## 📞 需要帮助？

查看日志：
- Render: Dashboard → Logs
- Vercel: Project → Deployments → View Logs
