# Memory Gallery - 中国大陆部署指南

本指南帮助您在中国大陆快速部署和运行Memory Gallery应用。

## 目录
1. [前置要求](#前置要求)
2. [Gitee仓库创建](#gitee仓库创建)
3. [本地部署](#本地部署)
4. [云服务部署](#云服务部署)
5. [常见问题](#常见问题)

---

## 前置要求

### 必需的软件
- **Node.js** 22.13.0+ (下载: https://nodejs.org/zh-cn/)
- **pnpm** 10.4.1+ (安装: `npm install -g pnpm`)
- **MySQL** 5.7+ 或 **TiDB** (云数据库)
- **Git** (下载: https://git-scm.com/download/win)

### 国内镜像源配置（加快下载速度）
```bash
# 配置npm镜像
npm config set registry https://registry.npmmirror.com

# 配置pnpm镜像
pnpm config set registry https://registry.npmmirror.com
```

---

## Gitee仓库创建

### 步骤1：在Gitee上创建新仓库

1. 访问 https://gitee.com (国内访问速度快)
2. 登录或注册账户
3. 点击"新建仓库"
4. 填写以下信息：
   - **仓库名称**: memory-gallery
   - **仓库描述**: 回忆记录与分享应用
   - **是否开源**: 选择"开源"或"私有"
   - **初始化仓库**: 勾选"使用README初始化仓库"

5. 点击"创建"

### 步骤2：上传项目代码

```bash
# 克隆本项目
git clone <本项目地址>
cd memory-gallery

# 添加Gitee远程仓库
git remote add gitee https://gitee.com/<你的用户名>/memory-gallery.git

# 推送代码到Gitee
git branch -M main
git push -u gitee main
```

---

## 本地部署

### 步骤1：安装依赖

```bash
# 进入项目目录
cd memory-gallery

# 安装依赖
pnpm install
```

### 步骤2：配置环境变量

创建 `.env.local` 文件（在项目根目录）：

```env
# 数据库配置（使用本地MySQL或云数据库）
DATABASE_URL=mysql://用户名:密码@localhost:3306/memory_gallery?ssl={"rejectUnauthorized":false}

# OAuth配置（如果使用Manus OAuth，需要替换为自己的OAuth服务）
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.example.com
VITE_OAUTH_PORTAL_URL=https://login.example.com

# 其他配置
JWT_SECRET=your_jwt_secret_key_here
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

### 步骤3：初始化数据库

```bash
# 生成数据库迁移
pnpm drizzle-kit generate

# 应用迁移（应用会自动创建表）
pnpm dev
```

### 步骤4：启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000 查看应用

---

## 云服务部署

### 选项1：阿里云部署（推荐）

#### 1.1 创建ECS实例

1. 登录 https://www.aliyun.com/
2. 进入ECS控制台
3. 创建实例：
   - **操作系统**: Ubuntu 22.04 LTS
   - **实例规格**: 2核4GB（最低配置）
   - **公网IP**: 分配弹性IP

#### 1.2 连接到服务器

```bash
# 使用SSH连接
ssh -i your_key.pem ubuntu@your_server_ip
```

#### 1.3 安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# 安装pnpm
npm install -g pnpm

# 安装MySQL客户端
sudo apt install -y mysql-client

# 安装Git
sudo apt install -y git
```

#### 1.4 部署应用

```bash
# 克隆项目
git clone https://gitee.com/your_username/memory-gallery.git
cd memory-gallery

# 安装依赖
pnpm install

# 配置环境变量
nano .env.production

# 构建应用
pnpm build

# 启动应用（使用PM2进程管理）
npm install -g pm2
pm2 start "pnpm start" --name "memory-gallery"
pm2 startup
pm2 save
```

#### 1.5 配置Nginx反向代理

```bash
# 安装Nginx
sudo apt install -y nginx

# 编辑Nginx配置
sudo nano /etc/nginx/sites-available/default
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

重启Nginx：

```bash
sudo systemctl restart nginx
```

#### 1.6 配置SSL证书（HTTPS）

```bash
# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请免费SSL证书
sudo certbot --nginx -d your_domain.com

# 自动续期
sudo systemctl enable certbot.timer
```

### 选项2：腾讯云部署

步骤类似于阿里云，主要区别：
1. 访问 https://cloud.tencent.com/
2. 创建CVM实例（腾讯云的ECS）
3. 其余步骤相同

### 选项3：华为云部署

步骤类似于阿里云，主要区别：
1. 访问 https://www.huaweicloud.com/
2. 创建ECS实例
3. 其余步骤相同

---

## 数据库配置

### 使用阿里云RDS MySQL

1. 在阿里云控制台创建RDS MySQL实例
2. 获取数据库连接地址
3. 在 `.env.production` 中配置：

```env
DATABASE_URL=mysql://username:password@rm-xxx.mysql.rds.aliyuncs.com:3306/memory_gallery?ssl={"rejectUnauthorized":false}
```

### 使用TiDB Cloud

1. 访问 https://tidbcloud.com/
2. 创建TiDB Serverless集群
3. 获取连接字符串
4. 在 `.env.production` 中配置：

```env
DATABASE_URL=mysql://username:password@gateway.tidbcloud.com:4000/memory_gallery?ssl={"rejectUnauthorized":false}
```

---

## 常见问题

### Q1: 部署后访问速度很慢

**解决方案：**
- 使用国内CDN加速（如阿里云CDN、腾讯云CDN）
- 确保数据库和应用在同一地区
- 优化图片和视频大小

### Q2: 数据库连接超时

**解决方案：**
- 检查数据库连接字符串是否正确
- 确保安全组规则允许应用连接
- 增加连接超时时间

### Q3: 上传文件失败

**解决方案：**
- 检查S3存储配置
- 确保有足够的存储空间
- 检查文件大小限制

### Q4: 无法访问应用

**解决方案：**
- 检查防火墙规则
- 确保应用正在运行：`pm2 status`
- 检查Nginx配置
- 查看应用日志：`pm2 logs memory-gallery`

---

## 维护和更新

### 查看应用日志

```bash
pm2 logs memory-gallery
```

### 重启应用

```bash
pm2 restart memory-gallery
```

### 停止应用

```bash
pm2 stop memory-gallery
```

### 更新应用

```bash
cd memory-gallery
git pull origin main
pnpm install
pnpm build
pm2 restart memory-gallery
```

---

## 支持和反馈

如有问题，请：
1. 查看本指南的常见问题部分
2. 在Gitee仓库提交Issue
3. 联系技术支持

---

## 许可证

MIT License

---

**祝您使用愉快！** 🎉
