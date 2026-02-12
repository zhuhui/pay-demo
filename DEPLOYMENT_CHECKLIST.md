# 🚀 PDF Master 云端部署检查清单

## 部署架构
```
GitHub (代码) → Railway (后端) → API (http://api-xxx.railway.app)
          ↓
       Vercel (前端) → Web (https://pdfmaster-xxx.vercel.app)
```

---

## ✅ 部署检查清单

### 1️⃣ 准备工作 (已完成 ✓)

- [x] 代码已推送到 GitHub
- [x] 项目包含 `railway.json` 配置
- [x] 项目包含 `vercel.json` 配置
- [x] 后端有 `Dockerfile` 
- [x] 部署指南已生成

### 2️⃣ Railway 后端部署

**预计时间**: 10-15 分钟

#### 步骤 1: 访问 Railway
- [ ] 打开 https://railway.app
- [ ] 用 GitHub 账号登录
- [ ] 授权 Railway 访问你的 GitHub

#### 步骤 2: 创建新项目
- [ ] 点击 "New Project"
- [ ] 选择 "Deploy from GitHub"
- [ ] 搜索并选择 "pay-demo" 仓库

#### 步骤 3: 配置后端服务
- [ ] Railway 自动检测 `railway.json`
- [ ] 确认 Root Directory 为 `pdfmaster-service`
- [ ] 确认 Dockerfile 路径为 `./Dockerfile`

#### 步骤 4: 等待部署
- [ ] 查看部署日志
- [ ] 等待 "Deployment Status: Success"
- [ ] 记录 Railway URL（格式：`https://pdfmaster-api-xxxx.railway.app`）

#### 步骤 5: 验证后端
```bash
# 在浏览器打开或用 curl 测试
curl https://pdfmaster-api-xxxx.railway.app/health
# 应该返回: {"status":"healthy","timestamp":"..."}
```

**记录后端 URL** 📝
```
Railway 后端 URL: https://pdfmaster-api-____________.railway.app
```

---

### 3️⃣ Vercel 前端部署

**预计时间**: 5-10 分钟

#### 步骤 1: 访问 Vercel
- [ ] 打开 https://vercel.com
- [ ] 用 GitHub 账号登录
- [ ] 授权 Vercel 访问你的 GitHub

#### 步骤 2: 创建新项目
- [ ] 点击 "Add New..." > "Project"
- [ ] 搜索并选择 "pay-demo" 仓库
- [ ] 点击 "Import"

#### 步骤 3: 配置项目
- [ ] Root Directory: 选择 `pdfmaster`
- [ ] Framework: 确认为 "Next.js"
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`

#### 步骤 4: 配置环境变量
- [ ] 点击 "Environment Variables"
- [ ] 添加新变量：
  - **Name**: `NEXT_PUBLIC_API_URL`
  - **Value**: 你的 Railway URL（如 `https://pdfmaster-api-xxxx.railway.app`）
- [ ] 点击 "Add"

#### 步骤 5: 部署
- [ ] 点击 "Deploy"
- [ ] 等待构建完成
- [ ] 部署完成后获得 Vercel URL

**记录前端 URL** 📝
```
Vercel 前端 URL: https://pdfmaster-____________.vercel.app
```

---

### 4️⃣ 测试部署

#### 前端访问测试
- [ ] 打开 Vercel 前端 URL
- [ ] 确认页面加载正常
- [ ] 看到 "PDF Master" 主页

#### 后端 API 测试
- [ ] 访问后端健康检查：`/health`
- [ ] 访问服务信息：`/`
- [ ] 确认返回 JSON 响应

#### 功能测试
- [ ] PDF 合并：上传两个 PDF 文件测试
- [ ] 图片压缩：上传图片测试
- [ ] 图片缩放：测试缩放功能
- [ ] 图片转换：测试格式转换

#### 跨域测试
- [ ] 在浏览器开发者工具查看网络请求
- [ ] 确认没有 CORS 错误
- [ ] 查看响应头中的 `Access-Control-Allow-Origin`

---

## 🔗 部署链接

完成部署后，填入以下信息：

| 服务 | URL | 备注 |
|------|-----|------|
| **前端** | `https://pdfmaster-__.vercel.app` | 用户访问的网站 |
| **后端** | `https://pdfmaster-api-__.railway.app` | API 服务器 |
| **API 文档** | `https://pdfmaster-api-__.railway.app/docs` | FastAPI 自动生成的文档 |
| **健康检查** | `https://pdfmaster-api-__.railway.app/health` | 服务状态检查 |

---

## 💡 有用的命令

### 查看 Railway 日志
```bash
# 使用 Railway CLI
railway login
railway logs
```

### 本地测试后端
```bash
cd pdfmaster-service
docker build -t pdfmaster-api .
docker run -p 8000:8000 pdfmaster-api
```

### 本地测试前端
```bash
cd pdfmaster
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

---

## ⚠️ 常见问题排查

### 问题 1: Railway 部署失败
**症状**: 部署失败，显示构建错误
**解决方案**:
1. 检查 Railway 的 "Logs" 选项卡查看详细错误
2. 确保 `requirements.txt` 中所有依赖都可以正常安装
3. 检查 Python 版本是否正确（应为 3.11+）
4. 尝试重新部署：点击 "Redeploy"

### 问题 2: Vercel 无法连接后端
**症状**: 前端报错，无法上传文件或调用 API
**解决方案**:
1. 检查 `NEXT_PUBLIC_API_URL` 环境变量是否正确
2. 访问后端的 `/health` 端点确认后端在线
3. 打开浏览器 DevTools，查看 Network 标签中的请求错误
4. 检查 CORS 配置是否正确

### 问题 3: 文件上传失败
**症状**: 上传文件时显示错误
**解决方案**:
1. 检查文件大小是否超过限制（Railway 免费套餐通常 100MB）
2. 查看后端日志中的详细错误
3. 尝试上传更小的文件进行测试
4. 检查磁盘空间是否充足

### 问题 4: 部署过程太慢
**症状**: 部署停留在某个步骤不动
**解决方案**:
1. 这是正常的，第一次部署通常需要 5-15 分钟
2. 检查进度日志是否有错误
3. 如果确实卡住，可以点击 "Cancel" 后重新部署
4. 后续部署会更快（缓存优化）

---

## 🎯 下一步行动

部署完成后的建议：

1. **立即**:
   - [ ] 测试所有功能是否正常工作
   - [ ] 分享你的部署 URL 给朋友测试
   - [ ] 记录后端 API 的健康状态

2. **本周**:
   - [ ] 配置自定义域名（可选）
   - [ ] 实现 API Key 认证（保护后端）
   - [ ] 配置 Cloudflare R2 存储（可选）

3. **本月**:
   - [ ] 完成 PDF 拆分功能
   - [ ] 添加表格提取功能
   - [ ] 编写 API 文档
   - [ ] 添加使用统计跟踪

4. **持续**:
   - [ ] 监控服务性能和日志
   - [ ] 收集用户反馈
   - [ ] 持续改进和优化

---

## 📞 获取帮助

如果部署遇到问题：

1. **检查官方文档**:
   - Railway: https://docs.railway.app
   - Vercel: https://vercel.com/docs
   - FastAPI: https://fastapi.tiangolo.com

2. **查看部署日志**:
   - Railway: 项目 → 服务 → Logs
   - Vercel: 项目 → Deployments → 点击部署 → Logs

3. **常见错误搜索**:
   - 在 Railway/Vercel 文档中搜索你看到的错误信息

---

**祝部署顺利！🎉**
