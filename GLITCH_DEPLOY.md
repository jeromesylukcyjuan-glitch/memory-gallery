# Memory Gallery - Glitch一键部署指南

## 最简单的部署方式（国内快速访问）

### 步骤1：访问Glitch

打开 https://glitch.com

### 步骤2：创建新项目

1. 点击 "New Project"
2. 选择 "Clone from Git Repo"
3. 输入仓库URL：
   ```
   https://github.com/jeromesylukcyjuan-glitch/memory-gallery.git
   ```
4. 点击 "Create"

### 步骤3：配置环境变量

1. 点击左侧菜单的 ".env"
2. 添加以下环境变量：
   ```
   NODE_ENV=production
   DATABASE_URL=mysql://root:password@localhost:3306/memory_gallery
   JWT_SECRET=my-secret-key-12345
   OWNER_NAME=Your Name
   OWNER_OPEN_ID=user-123
   VITE_APP_ID=app-id
   VITE_APP_TITLE=Memory Gallery
   ```

### 步骤4：安装依赖

在Glitch的终端中运行：
```bash
pnpm install
```

### 步骤5：启动应用

```bash
pnpm dev
```

### 步骤6：获取URL

Glitch会自动生成一个URL，例如：
```
https://memory-gallery-xyz.glitch.me
```

**在国内访问这个URL，就能使用Memory Gallery了！** 🎉

---

## 常见问题

**Q: 部署失败？**
A: 检查.env文件中的环境变量是否正确

**Q: 如何更新代码？**
A: 在Glitch编辑器中直接编辑，自动保存并重新启动

**Q: 国内访问慢？**
A: Glitch在国内访问速度不错，如果仍然慢，可以使用TiDB Cloud作为数据库

---

## 获取帮助

- [Glitch文档](https://glitch.com/help)
- [Glitch社区](https://support.glitch.com)
