# ⚡ 快速部署指南 (5分钟快速上手)

## 🎯 目标
在 5 分钟内将 PDF Master 部署到云端

## 📋 准备

你需要：
- [ ] GitHub 账号（已有，代码已推送）
- [ ] Railway 账号（免费，https://railway.app）
- [ ] Vercel 账号（免费，https://vercel.com）

---

## 🚀 快速步骤

### 第1步：部署后端到 Railway (3分钟)

1. **打开** https://railway.app
2. **登录** 用 GitHub 账号
3. **点击** "New Project" → "Deploy from GitHub"
4. **选择** `pay-demo` 仓库
5. **确认** Root Directory = `pdfmaster-service`
6. **点击** "Deploy"
7. **等待** 部署完成（约 2-3 分钟）
8. **记录** Railway 给你的 URL，例如：
   ```
   https://pdfmaster-api-abc123.railway.app
   ```

✅ **检查**: 打开 `https://pdfmaster-api-abc123.railway.app/health` 
应该返回 `{"status":"healthy"}`

---

### 第2步：部署前端到 Vercel (2分钟)

1. **打开** https://vercel.com
2. **登录** 用 GitHub 账号
3. **点击** "Add New..." → "Project"
4. **选择** `pay-demo` 仓库
5. **Root Directory**: 选择 `pdfmaster`
6. **环境变量** (重要!):
   - 名字: `NEXT_PUBLIC_API_URL`
   - 值: 填入你上面记录的 Railway URL（如 `https://pdfmaster-api-abc123.railway.app`）
   - 点击 "Add"
7. **点击** "Deploy"
8. **等待** 部署完成（约 1-2 分钟）
9. **记录** Vercel 给你的 URL，例如：
   ```
   https://pdfmaster-xyz789.vercel.app
   ```

✅ **检查**: 打开 `https://pdfmaster-xyz789.vercel.app`
应该看到 PDF Master 主页

---

## 🎉 完成！

你的应用已部署到云端！

| 项目 | URL |
|------|-----|
| **前端(网站)** | `https://pdfmaster-xyz789.vercel.app` |
| **后端(API)** | `https://pdfmaster-api-abc123.railway.app` |
| **API文档** | `https://pdfmaster-api-abc123.railway.app/docs` |

---

## 🧪 测试

### 测试 1: 打开网站
```
打开: https://pdfmaster-xyz789.vercel.app
应该看到: PDF Master 主页
```

### 测试 2: 测试 PDF 合并
1. 打开网站
2. 点击 "Merge PDF" 工具
3. 上传 2 个 PDF 文件
4. 点击 "Merge"
5. 下载合并后的 PDF

### 测试 3: 测试图片压缩
1. 打开网站
2. 点击 "Compress Image" 工具
3. 上传一张图片
4. 点击 "Compress"
5. 下载压缩后的图片

---

## 🆘 常见问题

### Q: 网站打开了但无法上传文件？
**A**: 环境变量配置错误
- 检查 Vercel 项目设置 → Environment Variables
- 确保 `NEXT_PUBLIC_API_URL` 指向正确的 Railway URL

### Q: Railway 显示部署失败？
**A**: 查看日志找出原因
- 点击 Railway 的 "Logs" 查看详细错误信息
- 常见原因：dependencies 安装失败，重新部署试试

### Q: 部署太慢？
**A**: 正常情况，第一次需要 5-15 分钟
- 等待即可，后续更新会快很多

---

## 📝 完成清单

- [ ] Railway 后端已部署
- [ ] Vercel 前端已部署
- [ ] 环境变量已配置
- [ ] 网站可以正常访问
- [ ] 至少测试了一个功能

---

## 💬 分享成果

部署完成后，你可以：

1. **分享给朋友**:
   > "我的 PDF 工具已上线！https://pdfmaster-xyz789.vercel.app"

2. **发到社交媒体**:
   - 截图你的应用
   - 分享你的部署链接

3. **保存为书签**:
   - 前端: `https://pdfmaster-xyz789.vercel.app`
   - API: `https://pdfmaster-api-abc123.railway.app`

---

## 🚀 下一步

部署完成后想进一步优化？

- [ ] 配置自定义域名
- [ ] 添加 API 认证
- [ ] 配置云存储 (Cloudflare R2)
- [ ] 查看详细部署指南: `DEPLOYMENT_VERCEL_RAILWAY.md`
- [ ] 查看完整检查清单: `DEPLOYMENT_CHECKLIST.md`

---

**祝部署愉快! 🎉**

有任何问题，查看完整指南或官方文档。
