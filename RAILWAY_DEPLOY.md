# Memory Gallery - Railway部署指南

## 最简单的部署方式（国内快速访问）

Railway是一个现代化的云平台，完全免费，支持Node.js后端和数据库。

### 步骤1：创建Railway账户

1. 访问 https://railway.app
2. 点击 "Start Project"
3. 用GitHub账户登录（推荐）或邮箱注册

### 步骤2：创建新项目

1. 点击 "Create a New Project"
2. 选择 "Deploy from GitHub"
3. 连接您的GitHub账户
4. 选择 `memory-gallery` 仓库

### 步骤3：配置环境变量

Railway会自动检测到Node.js项目。在部署前，配置以下环境变量：

1. 点击项目 → "Variables"
2. 添加以下变量：

```
NODE_ENV=production
JWT_SECRET=my-secret-key-12345
OWNER_NAME=Your Name
OWNER_OPEN_ID=user-123
DATABASE_URL=postgresql://user:password@localhost/memory_gallery
```

### 步骤4：添加PostgreSQL数据库

1. 在项目中点击 "Add"
2. 选择 "Add Service" → "PostgreSQL"
3. Railway会自动配置 `DATABASE_URL`

### 步骤5：配置启动命令

1. 点击项目 → "Settings"
2. 找到 "Start Command"
3. 输入：`pnpm start`

### 步骤6：部署

1. 点击 "Deploy"
2. 等待部署完成（通常2-5分钟）
3. 获得URL，例如：`https://memory-gallery-production.up.railway.app`

### 步骤7：访问您的应用

部署成功后，访问生成的URL，就能使用Memory Gallery了！

---

## 优势

- ✅ 完全免费
- ✅ 国内访问快
- ✅ 支持Node.js后端
- ✅ 内置PostgreSQL数据库
- ✅ 自动HTTPS
- ✅ 一键部署

---

## 常见问题

**Q: 部署失败？**
A: 检查构建日志，确保所有依赖都已安装

**Q: 数据库连接错误？**
A: 确保 `DATABASE_URL` 环境变量正确配置

**Q: 国内访问慢？**
A: Railway在国内访问速度不错，如果仍然慢，可以配置CDN

---

## 获取帮助

- [Railway文档](https://docs.railway.app)
- [Railway社区](https://railway.app/support)
