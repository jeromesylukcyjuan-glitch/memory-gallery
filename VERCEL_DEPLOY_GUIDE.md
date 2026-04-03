# Memory Gallery - Vercel一键部署指南

## 最快的部署方式（手机也可以）

### 步骤1：准备工作

1. **创建GitHub账户**（如果还没有）
   - 访问 https://github.com/signup
   - 用邮箱注册

2. **创建GitHub仓库**
   - 访问 https://github.com/new
   - Repository name: `memory-gallery`
   - 选择 "Public"
   - 点击 "Create repository"

### 步骤2：上传代码到GitHub

**方式A：使用GitHub网页界面（推荐，手机也可以）**

1. 打开您的仓库：https://github.com/jeromesylukcyjuan-glitch/memory-gallery
2. 点击 "Add file" → "Upload files"
3. 拖拽或选择项目文件上传
4. 点击 "Commit changes"

**方式B：使用命令行（需要电脑）**

```bash
git clone https://github.com/jeromesylukcyjuan-glitch/memory-gallery.git
cd memory-gallery
# 复制Memory Gallery源代码到这个目录
git add -A
git commit -m "Initial commit: Memory Gallery"
git push
```

### 步骤3：在Vercel部署

1. **访问Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign Up"
   - 选择 "Continue with GitHub"
   - 授权Vercel访问您的GitHub

2. **导入项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"
   - 搜索并选择 "memory-gallery"
   - 点击 "Import"

3. **配置项目**
   - Framework: 选择 "Other" 或 "Vite"
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

4. **配置环境变量**
   - 点击 "Environment Variables"
   - 添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 环境 |
| `DATABASE_URL` | `mysql://...` | 数据库连接 |
| `JWT_SECRET` | `your-secret-key` | JWT密钥 |
| `OWNER_NAME` | `Your Name` | 所有者名称 |
| `OWNER_OPEN_ID` | `your-id` | 所有者ID |

5. **部署**
   - 点击 "Deploy"
   - 等待部署完成（2-5分钟）
   - 获得部署URL

### 步骤4：配置数据库

**使用TiDB Cloud（推荐，免费）**

1. 访问 https://tidbcloud.com
2. 注册账户
3. 创建Serverless集群
4. 获取连接字符串
5. 在Vercel中配置 `DATABASE_URL`

---

## 常见问题

**Q: 部署失败？**
A: 检查环境变量是否正确

**Q: 国内访问慢？**
A: 使用TiDB Cloud作为数据库

**Q: 如何更新代码？**
A: 推送到GitHub，Vercel会自动重新部署

---

## 部署成功后

访问您的Vercel URL，就能在国内快速使用Memory Gallery了！🎉

---

## 获取帮助

- [Vercel文档](https://vercel.com/docs)
- [TiDB Cloud文档](https://docs.tidbcloud.com)
