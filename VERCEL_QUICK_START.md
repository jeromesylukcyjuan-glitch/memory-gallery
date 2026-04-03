# Memory Gallery - Vercel快速部署（5分钟）

## 最快的部署方式

### 步骤1：准备GitHub账户

1. 访问 https://github.com
2. 注册或登录账户

### 步骤2：Fork或上传项目

**方式A：使用Vercel一键部署按钮（最快）**

如果项目已在GitHub上，直接访问：
```
https://vercel.com/new/clone?repository-url=https://github.com/your_username/memory-gallery
```

**方式B：手动上传**

```bash
# 创建新仓库并上传
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/your_username/memory-gallery.git
git push -u origin main
```

### 步骤3：在Vercel上部署

1. 访问 https://vercel.com
2. 点击"Sign Up with GitHub"
3. 授权Vercel
4. 点击"Import Project"
5. 选择 memory-gallery 仓库
6. 添加环境变量：
   - `DATABASE_URL`: 您的数据库连接字符串
   - `JWT_SECRET`: 随机密钥
   - `OWNER_NAME`: 您的名字
   - `OWNER_OPEN_ID`: 您的ID
7. 点击"Deploy"

### 步骤4：等待部署完成

部署通常需要2-5分钟。完成后您会获得一个URL，例如：
```
https://memory-gallery-xxx.vercel.app
```

### 步骤5：在国内访问

直接访问上面的URL，即可在国内快速使用Memory Gallery！

---

## 数据库快速配置

### 使用TiDB Cloud（推荐，最简单）

1. 访问 https://tidbcloud.com
2. 注册账户
3. 创建Serverless集群（免费）
4. 复制连接字符串
5. 在Vercel中配置 `DATABASE_URL`

---

## 常见问题

**Q: 部署失败？**
A: 检查环境变量是否正确，特别是 `DATABASE_URL`

**Q: 国内访问慢？**
A: 使用TiDB Cloud作为数据库，国内访问速度快

**Q: 如何更新代码？**
A: 推送到GitHub，Vercel会自动重新部署

---

**就这么简单！现在您可以在国内快速访问Memory Gallery了！** 🎉
