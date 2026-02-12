# PDF Master 部署指南 (Vercel + Railway)

## 部署架构
- **前端**: Vercel (Next.js)
- **后端**: Railway (FastAPI)
- **预期成本**: 完全免费（使用免费套餐）

---

## 第一步：准备 Git 仓库

### 1.1 提交本地改动
```bash
cd /Users/zhuhui/Documents/ai/pay-demo

# 查看当前改动
git status

# 添加所有改动
git add .

# 提交改动
git commit -m "chore: update next.config for production"
```

### 1.2 确保代码已推送到 GitHub
```bash
git push origin main
```

> **重要**: 确保你的代码已推送到 GitHub，部署时需要连接 GitHub 仓库

---

## 第二步：部署后端到 Railway

### 2.1 访问 Railway
1. 打开 https://railway.app
2. 用 GitHub 账号登录（推荐）
3. 点击 "New Project"

### 2.2 选择部署方式
选择 "Deploy from GitHub"，连接你的仓库

### 2.3 配置后端服务

#### 选项 A：使用 railway.json 自动部署（推荐）
1. Railway 会自动检测 `railway.json` 配置
2. 选择 `pdfmaster-service` 目录
3. 点击 "Deploy"

#### 选项 B：手动配置
1. 新建 Web Service
2. 配置如下：
   - **Build Command**: （留空）
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Dockerfile**: 选择 `pdfmaster-service/Dockerfile`
   - **Root Directory**: `pdfmaster-service`

### 2.4 设置环境变量
在 Railway 的 Variables 页面添加：

```
PORT=8000
PYTHON_VERSION=3.11
```

可选（用于云存储）:
```
R2_ACCESS_KEY_ID=（你的 Cloudflare R2 Key）
R2_SECRET_ACCESS_KEY=（你的 Cloudflare R2 Secret）
R2_BUCKET_NAME=pdfmaster
TEMP_DIR=/tmp/pdfmaster
```

### 2.5 获取后端 URL
部署完成后，Railway 会生成一个 URL，格式如：
```
https://pdfmaster-api-xxxx.railway.app
```

记下这个 URL，后续需要配置到前端

---

## 第三步：部署前端到 Vercel

### 3.1 访问 Vercel
1. 打开 https://vercel.com
2. 用 GitHub 账号登录
3. 点击 "Add New..." > "Project"

### 3.2 导入项目
1. 选择你的 GitHub 仓库
2. 点击 "Import"

### 3.3 配置项目

在 "Configure Project" 页面：

1. **Root Directory**: 选择 `pdfmaster`
2. **Framework**: 自动检测为 "Next.js"
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### 3.4 设置环境变量

点击 "Environment Variables" 添加：

```
NEXT_PUBLIC_API_URL=https://pdfmaster-api-xxxx.railway.app
```

将 `xxxx` 替换为你的 Railway 后端 URL

### 3.5 部署
点击 "Deploy" 按钮，Vercel 会自动构建和部署

部署完成后会获得 Vercel URL：
```
https://pdfmaster-xxxxx.vercel.app
```

---

## 第四步：测试部署

### 4.1 访问前端
打开你的 Vercel URL，应该能看到 PDF Master 主页

### 4.2 测试后端 API
```bash
# 访问后端健康检查
curl https://pdfmaster-api-xxxx.railway.app/health

# 返回应该是：
# {"status":"healthy","timestamp":"2024-02-12T..."}
```

### 4.3 测试 PDF 合并功能
在前端上上传 PDF 文件进行合并测试

---

## 常见问题

### Q1: 后端部署失败
**解决方案**:
- 检查 Railway 日志：点击服务 > "Logs" 查看详细错误
- 确保 `requirements.txt` 中所有依赖都正确
- 检查 Dockerfile 中的 Python 版本

### Q2: 前端无法连接后端
**解决方案**:
- 检查 `NEXT_PUBLIC_API_URL` 环境变量是否正确
- 确保后端已完全部署并能访问
- 在浏览器控制台查看网络请求错误

### Q3: 文件上传失败
**解决方案**:
- Railway 免费套餐有文件大小限制（通常 100MB）
- 确保 TEMP_DIR 权限正确
- 检查磁盘空间是否足够

### Q4: 部署太慢/超时
**解决方案**:
- 第一次构建会比较慢，耐心等待 5-10 分钟
- Railway 免费套餐资源有限，构建时间会较长
- 后续更新会更快

---

## 进阶配置

### 添加自定义域名

#### Vercel 自定义域名
1. 进入 Vercel 项目设置
2. 点击 "Domains"
3. 输入你的域名
4. 按照说明更新 DNS 记录

#### Railway 自定义域名
1. 进入 Railway 服务设置
2. 点击 "Public Networking"
3. 添加自定义域名
4. 配置 CNAME 记录

### 配置 CORS
如果需要从其他域名调用 API，修改后端 `main.py`：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # 指定允许的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 生产环境优化

1. **后端**:
   - 添加 API 认证 (API Key)
   - 配置云存储 (Cloudflare R2)
   - 实施速率限制

2. **前端**:
   - 启用图片优化
   - 配置缓存策略
   - 添加分析和监控

---

## 监控和日志

### Railway 监控
- 访问 Railway 仪表板查看服务状态
- 点击服务 > "Metrics" 查看性能指标
- 点击服务 > "Logs" 查看应用日志

### Vercel 监控
- 访问 Vercel 仪表板
- 点击项目 > "Analytics" 查看访问统计
- 点击项目 > "Deployments" 查看部署历史

---

## 后续步骤

部署完成后，建议：

1. ✅ 测试所有功能（PDF 合并、压缩、图片处理等）
2. ✅ 配置自定义域名（可选）
3. ✅ 添加 API 认证保护后端接口
4. ✅ 配置云存储用于临时文件管理
5. ✅ 设置监控和告警
6. ✅ 编写 API 文档供开发者使用

---

## 快速参考

| 项目 | 值 |
|------|-----|
| 前端框架 | Next.js 16.1.6 |
| 后端框架 | FastAPI 0.104.1 |
| 数据库 | 无（无状态） |
| 认证 | 无（待实现） |
| 存储 | 临时本地 /tmp（可配置 R2） |
| 成本 | ₽0（免费套餐） |

---

## 支持

遇到问题？
- Railway 文档: https://docs.railway.app
- Vercel 文档: https://vercel.com/docs
- FastAPI 文档: https://fastapi.tiangolo.com
- Next.js 文档: https://nextjs.org/docs
