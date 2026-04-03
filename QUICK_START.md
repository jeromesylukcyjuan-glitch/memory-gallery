# Memory Gallery - 快速开始指南

## 5分钟快速部署

### 1. 克隆项目

```bash
git clone https://gitee.com/your_username/memory-gallery.git
cd memory-gallery
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
DATABASE_URL=mysql://root:password@localhost:3306/memory_gallery
JWT_SECRET=your_secret_key
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_id
```

### 4. 启动应用

```bash
pnpm dev
```

访问 http://localhost:3000

---

## 功能说明

### 📸 上传回忆
- 支持图片和视频上传
- 支持拖拽上传和批量上传
- 自动上传到云存储

### 🎨 浏览回忆
- 时间轴展示
- 按日期分组
- 网格布局展示

### 📁 管理相册
- 创建多个相册
- 组织回忆内容
- 快速查找

### 🔍 搜索和筛选
- 关键词搜索
- 日期范围筛选
- 按相册筛选

### ✨ AI自动标注
- 自动生成标题
- 自动生成描述
- 自动生成标签

---

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| ← | 上一张 |
| → | 下一张 |
| Esc | 关闭详情 |

---

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 常见问题

**Q: 如何修改回忆的日期？**
A: 在详情页面点击日期可以编辑。

**Q: 如何删除回忆？**
A: 在详情页面点击删除按钮。

**Q: 如何导出回忆？**
A: 目前支持直接下载图片/视频。

---

## 获取帮助

- 📖 [完整部署指南](./DEPLOY_CHINA.md)
- 🐛 [提交Issue](https://gitee.com/your_username/memory-gallery/issues)
- 💬 [讨论](https://gitee.com/your_username/memory-gallery/discussions)

---

**开始创建您的回忆吧！** 🎉
