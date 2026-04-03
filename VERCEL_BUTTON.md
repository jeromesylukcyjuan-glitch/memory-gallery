# Memory Gallery - Vercel一键部署

## 最简单的部署方式

点击下面的按钮，一键部署到Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jeromesylukcyjuan-glitch/memory-gallery&env=DATABASE_URL,JWT_SECRET,OWNER_NAME,OWNER_OPEN_ID&envDescription=Database%20connection%20and%20configuration%20variables&envLink=https://github.com/jeromesylukcyjuan-glitch/memory-gallery/blob/main/VERCEL_DEPLOY_GUIDE.md)

---

## 部署步骤

1. **点击上面的"Deploy with Vercel"按钮**
2. **用GitHub账户登录**
3. **填写环境变量**：
   - `DATABASE_URL`: 您的数据库连接字符串
   - `JWT_SECRET`: 随机密钥（例如：your-secret-key-12345）
   - `OWNER_NAME`: 您的名字
   - `OWNER_OPEN_ID`: 您的ID
4. **点击"Deploy"**
5. **等待部署完成**（2-5分钟）

---

## 获取数据库连接字符串

### 使用TiDB Cloud（推荐，免费）

1. 访问 https://tidbcloud.com
2. 注册账户
3. 创建Serverless集群
4. 获取连接字符串（格式：`mysql://user:password@host:4000/database?ssl={"rejectUnauthorized":false}`)
5. 复制到 `DATABASE_URL` 环境变量

---

## 部署成功后

您会获得一个Vercel URL，例如：
```
https://memory-gallery-xxx.vercel.app
```

在国内访问这个URL，就能使用Memory Gallery了！🎉

---

## 常见问题

**Q: 部署失败？**
A: 检查环境变量是否正确填写

**Q: 国内访问慢？**
A: 使用TiDB Cloud作为数据库，国内访问速度快

**Q: 如何更新代码？**
A: 推送到GitHub，Vercel会自动重新部署

---

**需要帮助？** 查看 `VERCEL_DEPLOY_GUIDE.md` 获取详细说明。
