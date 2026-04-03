# Memory Gallery - 回忆相册

一个精美的视频与图片回忆网站，帮助您保存和整理生活中的珍贵时刻。

![Memory Gallery](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-22.13.0+-green)

## ✨ 功能特性

### 📸 媒体管理
- ✅ 支持图片和视频上传
- ✅ 拖拽上传和批量上传
- ✅ 自动上传到云存储
- ✅ 支持大文件上传（最大500MB）

### 🎨 浏览展示
- ✅ 时间轴展示所有回忆
- ✅ 按日期倒序排列
- ✅ 网格/瀑布流布局
- ✅ 点击查看大图和播放视频
- ✅ 上一张/下一张/返回导航

### 📁 相册管理
- ✅ 创建多个相册分类
- ✅ 每个相册包含多张照片和视频
- ✅ 快速查找和组织

### 🔍 搜索筛选
- ✅ 关键词搜索
- ✅ 日期范围筛选
- ✅ 按相册筛选
- ✅ 实时搜索结果

### ✨ AI自动标注
- ✅ 自动生成图片/视频描述
- ✅ 自动生成标题
- ✅ 自动生成标签
- ✅ 智能内容理解

### 🎨 设计风格
- ✅ 手绘草图美学风格
- ✅ 温暖的奶油色纸张背景
- ✅ 深炭色有机线条
- ✅ 俏皮排列的不完美几何形状
- ✅ 马克笔风格脚本排版

---

## 🚀 快速开始

### 前置要求
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 5.7+ 或 TiDB

### 本地开发

```bash
# 1. 克隆项目
git clone https://gitee.com/your_username/memory-gallery.git
cd memory-gallery

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp ENV_TEMPLATE.md .env.local
# 编辑 .env.local，填入数据库连接信息

# 4. 启动开发服务器
pnpm dev

# 5. 打开浏览器
# 访问 http://localhost:3000
```

### 生产部署

详见 [中国大陆部署指南](./DEPLOY_CHINA.md)

---

## 📖 文档

- [快速开始指南](./QUICK_START.md) - 5分钟快速上手
- [中国大陆部署指南](./DEPLOY_CHINA.md) - 详细的部署步骤
- [环境变量配置](./ENV_TEMPLATE.md) - 环境变量说明

---

## 🏗️ 项目结构

```
memory-gallery/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # UI组件
│   │   ├── lib/           # 工具库
│   │   └── App.tsx        # 主应用
│   └── index.html         # HTML入口
├── server/                 # 后端应用
│   ├── routers.ts         # tRPC路由
│   ├── db.ts              # 数据库查询
│   ├── ai.ts              # AI标注服务
│   └── upload.ts          # 文件上传
├── drizzle/               # 数据库Schema
│   └── schema.ts          # 数据表定义
├── shared/                # 共享代码
└── package.json           # 项目配置
```

---

## 🛠️ 技术栈

### 前端
- **React 19** - UI框架
- **Tailwind CSS 4** - 样式库
- **tRPC** - 类型安全的API
- **Wouter** - 路由管理
- **shadcn/ui** - UI组件库

### 后端
- **Express 4** - Web框架
- **tRPC 11** - RPC框架
- **Drizzle ORM** - 数据库ORM
- **MySQL/TiDB** - 数据库

### 部署
- **Vite** - 前端构建工具
- **esbuild** - 后端构建工具
- **Node.js** - 运行环境

---

## 📊 数据库Schema

### memories 表（回忆）
- id: 主键
- userId: 用户ID
- albumId: 相册ID
- title: 标题
- description: 描述
- fileUrl: 文件URL
- fileKey: 文件密钥
- fileType: 文件类型（image/video）
- mimeType: MIME类型
- memoryDate: 回忆日期
- aiGenerated: AI生成状态
- createdAt: 创建时间
- updatedAt: 更新时间

### albums 表（相册）
- id: 主键
- userId: 用户ID
- name: 相册名称
- description: 相册描述
- coverImageUrl: 封面图片URL
- createdAt: 创建时间
- updatedAt: 更新时间

### tags 表（标签）
- id: 主键
- memoryId: 回忆ID
- tag: 标签内容
- createdAt: 创建时间

---

## 🔐 安全特性

- ✅ OAuth用户认证
- ✅ JWT会话管理
- ✅ SQL注入防护
- ✅ CORS跨域保护
- ✅ 环境变量加密存储
- ✅ SSL/TLS加密传输

---

## 📱 浏览器兼容性

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| IE | 任意 | ❌ |

---

## 🎯 使用场景

- 👨‍👩‍👧‍👦 家庭相册 - 保存家庭珍贵时刻
- 💑 情侣回忆 - 记录两人的美好时光
- 🎓 学生生活 - 记录校园生活
- 🏖️ 旅行日记 - 记录旅行见闻
- 📸 摄影作品 - 展示摄影作品
- 👶 成长记录 - 记录孩子成长过程

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

---

## 📝 更新日志

### v1.0.0 (2026-04-03)
- ✨ 初始版本发布
- 📸 支持图片和视频上传
- 🎨 时间轴展示
- 📁 相册管理
- 🔍 搜索筛选
- ✨ AI自动标注
- 🎨 手绘草图美学设计

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 🙏 致谢

感谢以下开源项目的支持：
- React
- Tailwind CSS
- tRPC
- Drizzle ORM
- shadcn/ui

---

## 📞 联系方式

- 📧 Email: support@example.com
- 💬 Gitee Issues: [提交Issue](https://gitee.com/your_username/memory-gallery/issues)
- 📱 微信: your_wechat_id

---

## 🌟 Star History

如果这个项目对您有帮助，请给个Star⭐

```
★ ★ ★ ★ ★ ★ ★ ★ ★ ★
```

---

**开始创建您的回忆吧！** 🎉

Made with ❤️ by Memory Gallery Team
