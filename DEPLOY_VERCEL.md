# Memory Gallery - Vercel部署指南

本指南帮助您将Memory Gallery快速部署到Vercel，在国内可以快速访问。

## 目录
1. [前置要求](#前置要求)
2. [Vercel账户创建](#vercel账户创建)
3. [项目上传到GitHub](#项目上传到github)
4. [部署到Vercel](#部署到vercel)
5. [配置数据库](#配置数据库)
6. [自定义域名](#自定义域名)
7. [常见问题](#常见问题)

---

## 前置要求

- GitHub账户（或Gitee账户）
- Vercel账户（免费）
- 项目源代码

---

## Vercel账户创建

### 步骤1：访问Vercel官网

1. 打开 https://vercel.com
2. 点击"Sign Up"注册账户
3. 选择"Continue with GitHub"（推荐）或其他登录方式
4. 授权Vercel访问您的GitHub账户

### 步骤2：完成注册

1. 填写团队名称（可选）
2. 选择"Hobby"免费计划
3. 完成邮箱验证

---

## 项目上传到GitHub

### 步骤1：在GitHub上创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: memory-gallery
   - **Description**: Memory Gallery - 回忆记录与分享应用
   - **Public**: 选择"Public"（便于部署）
3. 点击"Create repository"

### 步骤2：上传项目代码

```bash
# 进入项目目录
cd /path/to/memory-gallery

# 初始化Git仓库（如果还没有）
git init

# 添加GitHub远程仓库
git remote add origin https://github.com/your_username/memory-gallery.git

# 添加所有文件
git add -A

# 提交代码
git commit -m "Initial commit: Memory Gallery - 回忆相册应用"

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤3：验证上传

访问 https://github.com/your_username/memory-gallery 确认代码已上传。

---

## 部署到Vercel

### 步骤1：连接GitHub仓库

1. 登录 https://vercel.com/dashboard
2. 点击"Add New..." -> "Project"
3. 选择"Import Git Repository"
4. 搜索并选择 "memory-gallery" 仓库
5. 点击"Import"

### 步骤2：配置项目设置

在"Configure Project"页面：

1. **Framework Preset**: 选择 "Other" 或 "Vite"
2. **Build Command**: 保持默认 `pnpm build`
3. **Output Directory**: 保持默认 `dist`
4. **Install Command**: 保持默认 `pnpm install`

### 步骤3：配置环境变量

点击"Environment Variables"，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `mysql://user:password@host/db` | 数据库连接字符串 |
| `JWT_SECRET` | `your_random_secret_key` | JWT签名密钥 |
| `OWNER_NAME` | `Your Name` | 所有者名称 |
| `OWNER_OPEN_ID` | `your_open_id` | 所有者ID |
| `NODE_ENV` | `production` | 环境变量 |

**重要**: 确保 `DATABASE_URL` 指向可从Vercel访问的数据库。

### 步骤4：开始部署

1. 点击"Deploy"按钮
2. 等待部署完成（通常需要2-5分钟）
3. 部署成功后，您会看到一个URL，例如：`https://memory-gallery-xxx.vercel.app`

---

## 配置数据库

### 选项1：使用TiDB Cloud（推荐）

TiDB Cloud在国内访问速度快，且有免费层级。

#### 1.1 创建TiDB Cloud账户

1. 访问 https://tidbcloud.com
2. 点击"Sign Up"注册账户
3. 完成邮箱验证

#### 1.2 创建Serverless集群

1. 登录TiDB Cloud控制台
2. 点击"Create Cluster"
3. 选择"Serverless"
4. 选择地区（建议选择新加坡或东京）
5. 点击"Create"

#### 1.3 获取连接字符串

1. 在集群详情页面，点击"Connect"
2. 选择"MySQL Client"
3. 复制连接字符串，格式如下：

```
mysql://[username]:[password]@[host]:4000/[database]?ssl={"rejectUnauthorized":false}
```

#### 1.4 在Vercel中配置

1. 进入Vercel项目设置
2. 找到"Environment Variables"
3. 编辑 `DATABASE_URL`，粘贴TiDB连接字符串
4. 点击"Save"
5. 重新部署项目

### 选项2：使用阿里云RDS MySQL

#### 2.1 创建RDS实例

1. 登录 https://www.aliyun.com/
2. 进入RDS控制台
3. 创建MySQL实例
4. 配置安全组允许Vercel IP访问

#### 2.2 获取连接信息

1. 获取RDS实例的公网地址
2. 获取数据库用户名和密码
3. 创建数据库

#### 2.3 构建连接字符串

```
mysql://username:password@rm-xxx.mysql.rds.aliyuncs.com:3306/memory_gallery?ssl={"rejectUnauthorized":false}
```

---

## 自定义域名

### 步骤1：购买域名

- 在阿里云、腾讯云或其他域名注册商购买域名
- 例如：memory-gallery.com

### 步骤2：配置DNS

1. 进入Vercel项目设置
2. 点击"Domains"
3. 输入您的自定义域名
4. 按照Vercel的提示配置DNS记录

### 步骤3：验证域名

1. 等待DNS生效（通常需要24小时）
2. 访问您的自定义域名验证是否正常

---

## 常见问题

### Q1: 部署失败，显示"Build failed"

**解决方案：**
1. 检查环境变量是否正确配置
2. 查看部署日志找出具体错误
3. 确保 `DATABASE_URL` 正确且数据库可访问
4. 尝试重新部署

### Q2: 部署成功但应用无法访问

**解决方案：**
1. 检查Vercel URL是否正确
2. 等待DNS生效（如果使用自定义域名）
3. 检查浏览器缓存
4. 查看浏览器控制台的错误信息

### Q3: 数据库连接失败

**解决方案：**
1. 检查 `DATABASE_URL` 是否正确
2. 确保数据库允许Vercel IP访问
3. 检查数据库是否正在运行
4. 尝试在本地测试连接字符串

### Q4: 国内访问速度慢

**解决方案：**
1. 使用TiDB Cloud（国内访问速度快）
2. 启用Vercel的CDN加速
3. 优化图片和视频大小
4. 考虑使用国内CDN加速

### Q5: 如何更新部署的代码？

**解决方案：**
```bash
# 本地修改代码后
git add -A
git commit -m "Update: 描述更改"
git push origin main

# Vercel会自动检测到GitHub的更新并重新部署
```

### Q6: 如何回滚到之前的版本？

1. 进入Vercel项目的"Deployments"页面
2. 找到之前的部署版本
3. 点击"Promote to Production"

---

## 部署后的维护

### 查看部署日志

1. 进入Vercel项目
2. 点击"Deployments"
3. 选择要查看的部署
4. 点击"View Logs"

### 监控应用性能

1. 进入Vercel项目
2. 点击"Analytics"
3. 查看访问量、响应时间等指标

### 配置自动部署

Vercel默认在您推送代码到GitHub时自动部署。如果需要禁用：

1. 进入项目设置
2. 点击"Git"
3. 取消"Automatic Deployments"

---

## 成本估算

### Vercel免费层级

- 每月100GB带宽
- 无限部署
- 无限团队成员
- 足以支持中小型应用

### 数据库成本

- **TiDB Cloud**: 免费层级（5GB存储）
- **阿里云RDS**: 按量付费（约50元/月起）

---

## 下一步

部署成功后，您可以：

1. **配置自定义域名** - 使用您自己的域名
2. **启用HTTPS** - Vercel自动配置
3. **设置监控告警** - 监控应用状态
4. **优化性能** - 使用Vercel Analytics

---

## 获取帮助

- [Vercel文档](https://vercel.com/docs)
- [Vercel支持](https://vercel.com/support)
- [项目GitHub Issues](https://github.com/your_username/memory-gallery/issues)

---

**部署成功后，您就可以在国内快速访问Memory Gallery了！** 🎉
