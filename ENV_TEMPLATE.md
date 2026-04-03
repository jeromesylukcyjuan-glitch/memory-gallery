# Memory Gallery 环境变量配置指南

## 环境变量说明

### 必需的环境变量

#### 1. 数据库配置 (DATABASE_URL)

**本地MySQL：**
```
DATABASE_URL=mysql://root:password@localhost:3306/memory_gallery
```

**TiDB Cloud：**
```
DATABASE_URL=mysql://username:password@gateway.tidbcloud.com:4000/database_name?ssl={"rejectUnauthorized":false}
```

**阿里云RDS：**
```
DATABASE_URL=mysql://username:password@rm-xxx.mysql.rds.aliyuncs.com:3306/memory_gallery?ssl={"rejectUnauthorized":false}
```

#### 2. JWT密钥 (JWT_SECRET)

用于签署会话令牌，必须是随机字符串，至少32个字符：

```
JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters
```

生成随机密钥的方法：
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 3. 所有者信息

```
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

### 可选的环境变量

#### OAuth配置

如果使用自定义OAuth服务（不使用Manus OAuth）：

```
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.example.com
VITE_OAUTH_PORTAL_URL=https://login.example.com
```

#### 应用配置

```
VITE_APP_TITLE=Memory Gallery
VITE_APP_LOGO=https://example.com/logo.png
```

#### 分析配置

```
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

#### S3存储配置

如果使用自定义S3存储：

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
```

#### LLM配置

如果使用自定义LLM服务：

```
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_URL=https://api.openai.com/v1
```

---

## 部署环境配置

### 开发环境 (.env.local)

```
NODE_ENV=development
DATABASE_URL=mysql://root:password@localhost:3306/memory_gallery
JWT_SECRET=dev_secret_key_123456789012345678901234
OWNER_NAME=Developer
OWNER_OPEN_ID=dev_open_id
DEBUG=memory-gallery:*
```

### 生产环境 (.env.production)

```
NODE_ENV=production
DATABASE_URL=mysql://username:password@rm-xxx.mysql.rds.aliyuncs.com:3306/memory_gallery?ssl={"rejectUnauthorized":false}
JWT_SECRET=prod_secret_key_generated_by_openssl
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
VITE_APP_TITLE=Memory Gallery
VITE_APP_LOGO=https://cdn.example.com/logo.png
```

---

## 如何设置环境变量

### 方法1：创建 .env.local 文件（开发环境）

```bash
# 在项目根目录创建 .env.local
cat > .env.local << EOF
DATABASE_URL=mysql://root:password@localhost:3306/memory_gallery
JWT_SECRET=your_jwt_secret_key_here
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
EOF
```

### 方法2：创建 .env.production 文件（生产环境）

```bash
# 在项目根目录创建 .env.production
cat > .env.production << EOF
NODE_ENV=production
DATABASE_URL=mysql://username:password@rm-xxx.mysql.rds.aliyuncs.com:3306/memory_gallery
JWT_SECRET=your_jwt_secret_key_here
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
EOF
```

### 方法3：设置系统环境变量（Linux/Mac）

```bash
export DATABASE_URL="mysql://root:password@localhost:3306/memory_gallery"
export JWT_SECRET="your_jwt_secret_key_here"
export OWNER_NAME="Your Name"
export OWNER_OPEN_ID="your_open_id"
```

### 方法4：设置系统环境变量（Windows）

```cmd
setx DATABASE_URL "mysql://root:password@localhost:3306/memory_gallery"
setx JWT_SECRET "your_jwt_secret_key_here"
setx OWNER_NAME "Your Name"
setx OWNER_OPEN_ID "your_open_id"
```

### 方法5：Docker环境变量

```bash
docker run -e DATABASE_URL="mysql://..." -e JWT_SECRET="..." memory-gallery
```

---

## 验证环境变量

启动应用后，检查日志确认环境变量已正确加载：

```bash
pnpm dev
```

查看是否有错误信息。如果环境变量缺失，应用会在启动时报错。

---

## 安全建议

1. **不要提交 .env 文件到Git** - 添加到 .gitignore
2. **使用强密钥** - JWT_SECRET 必须是随机生成的强密钥
3. **定期轮换密钥** - 定期更新 JWT_SECRET
4. **使用密钥管理服务** - 在生产环境使用 AWS Secrets Manager 或类似服务
5. **限制访问权限** - 确保只有授权人员可以访问环境变量

---

## 常见问题

**Q: 如何生成安全的JWT_SECRET？**
A: 使用 `openssl rand -base64 32` 或 `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

**Q: 可以在URL中包含特殊字符吗？**
A: 可以，但需要进行URL编码。例如：`mysql://user:p%40ssword@localhost/db`

**Q: 如何测试数据库连接？**
A: 使用 `mysql -h host -u user -p` 命令测试连接

**Q: 环境变量优先级是什么？**
A: 系统环境变量 > .env.production > .env.local > 默认值

---

## 获取帮助

如有问题，请参考：
- [完整部署指南](./DEPLOY_CHINA.md)
- [快速开始指南](./QUICK_START.md)
- 项目Issue页面
