# 🚀 自动部署指南 (已有 Token)

你已经提供了 Token，现在我帮你一键部署。

## 📦 Railway 后端部署

因为 Railway 主要通过 GitHub 集成部署，我建议用以下方法最快：

### 方法1：Railway Dashboard 一键部署（最快 - 3分钟）

打开这个链接，Railway 会自动检测到你的 GitHub 账号：
```
https://railway.app/new?repo=https://github.com/zhuhui/pay-demo&rootDirectory=pdfmaster-service
```

或者手动操作：
1. 打开 https://railway.app/dashboard
2. 点 "New Project" → "Deploy from GitHub"  
3. 授权 GitHub
4. 搜索 `pay-demo`
5. Root Directory: `pdfmaster-service`
6. 点 Deploy

**部署完成后，你会看到：**
```
https://pdfmaster-api-xxxxx.railway.app
```

**记住这个 URL！** ⬅️ 很重要

---

## 🎨 Vercel 前端部署

### 方法：使用 Vercel CLI 自动部署（我来做）

我会运行以下命令为你自动部署到 Vercel：

```bash
cd /Users/zhuhui/Documents/ai/pay-demo/pdfmaster

# 设置环境变量（需要你提供 Railway URL）
export NEXT_PUBLIC_API_URL="https://pdfmaster-api-xxxxx.railway.app"

# 部署到 Vercel
vercel --prod --token vcp_80ERPJK7m2PW98s116dNnTqgetTtznCMPPAz7lM47PzTWQxQXJ3sTrDn
```

---

## 📋 现在该你做什么

### 只需两步：

#### 1️⃣ 部署后端 (3分钟)

点这个链接：
```
https://railway.app/new?repo=https://github.com/zhuhui/pay-demo&rootDirectory=pdfmaster-service
```

或者：
- 打开 https://railway.app
- 用 GitHub 账号登录
- 点 "New Project" → "Deploy from GitHub"
- 选择 `pay-demo`
- Root Directory: `pdfmaster-service`
- 点 Deploy

**完成后，你会看到一个 URL，复制它！**

#### 2️⃣ 告诉我 Railway URL

部署完成后，Railway 会给你一个类似这样的 URL：
```
https://pdfmaster-api-xxxxx.railway.app
```

**把这个 URL 告诉我，然后我自动部署前端到 Vercel！**

---

## ⏱️ 时间表

- Railway 部署：3-5 分钟
- 你告诉我 URL：1 分钟  
- 我部署到 Vercel：2-3 分钟
- **总计：6-10 分钟完全上线！**

---

## 🎯 现在就去部署后端吧！

点这里：**https://railway.app/new?repo=https://github.com/zhuhui/pay-demo&rootDirectory=pdfmaster-service**

或者打开 https://railway.app 自己操作。

完成后告诉我 Railway 给你的 URL 🚀
