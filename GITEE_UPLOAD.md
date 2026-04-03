# Memory Gallery - Gitee上传指南

本指南帮助您将Memory Gallery项目上传到Gitee（国内代码托管平台）。

## 步骤1：在Gitee上创建新仓库

### 1.1 访问Gitee官网
- 打开 https://gitee.com
- 如果没有账户，点击"注册"创建账户
- 登录您的Gitee账户

### 1.2 创建新仓库
1. 点击右上角"+"按钮
2. 选择"新建仓库"
3. 填写以下信息：

| 字段 | 值 |
|------|-----|
| 仓库名称 | memory-gallery |
| 仓库描述 | 回忆记录与分享应用 - 支持图片和视频上传、时间轴展示、AI自动标注 |
| 选择开源协议 | MIT License |
| 初始化仓库 | ✓ 使用README初始化仓库 |

4. 点击"创建"按钮

### 1.3 获取仓库地址
创建完成后，您会看到仓库页面。复制HTTPS克隆地址：
```
https://gitee.com/your_username/memory-gallery.git
```

---

## 步骤2：本地配置Git

### 2.1 配置Git用户信息
```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

### 2.2 生成SSH密钥（可选，但推荐）
```bash
ssh-keygen -t rsa -C "your_email@example.com"
# 按Enter接受默认位置
# 输入密码（可选）
```

### 2.3 添加SSH密钥到Gitee
1. 复制SSH公钥内容：
```bash
cat ~/.ssh/id_rsa.pub
```

2. 登录Gitee，进入"设置" -> "SSH公钥"
3. 点击"添加公钥"
4. 粘贴公钥内容，点击"确定"

---

## 步骤3：上传项目代码

### 3.1 初始化本地Git仓库
```bash
cd /path/to/memory-gallery

# 如果已经是Git仓库，跳过此步
git init
```

### 3.2 添加Gitee远程仓库
```bash
# 添加Gitee作为远程仓库（使用HTTPS）
git remote add gitee https://gitee.com/your_username/memory-gallery.git

# 或使用SSH（需要配置SSH密钥）
git remote add gitee git@gitee.com:your_username/memory-gallery.git
```

### 3.3 添加所有文件
```bash
git add -A
```

### 3.4 提交代码
```bash
git commit -m "Initial commit: Memory Gallery - 回忆相册应用"
```

### 3.5 推送到Gitee
```bash
# 推送到main分支
git push -u gitee main

# 如果分支名是master
git push -u gitee master
```

### 3.6 输入凭证
- 如果使用HTTPS：输入Gitee用户名和密码
- 如果使用SSH：无需输入（已通过密钥认证）

---

## 步骤4：验证上传

### 4.1 检查Gitee仓库
1. 打开 https://gitee.com/your_username/memory-gallery
2. 验证所有文件都已上传
3. 检查README.md是否显示正确

### 4.2 查看项目信息
- 仓库大小
- 文件数量
- 最后更新时间

---

## 常见问题

### Q1: 上传时出现"Authentication failed"错误

**解决方案：**
1. 检查用户名和密码是否正确
2. 如果使用SSH，确保SSH密钥已添加到Gitee
3. 尝试使用HTTPS而不是SSH

### Q2: 上传时出现"Permission denied"错误

**解决方案：**
1. 检查SSH密钥权限：`chmod 600 ~/.ssh/id_rsa`
2. 检查SSH公钥是否正确添加到Gitee
3. 尝试使用HTTPS方式上传

### Q3: 上传时出现"Repository not found"错误

**解决方案：**
1. 检查仓库地址是否正确
2. 确保Gitee仓库已创建
3. 检查用户名是否正确

### Q4: 如何更新已上传的代码？

```bash
# 修改代码后
git add -A
git commit -m "Update: 描述更改内容"
git push gitee main
```

### Q5: 如何删除已上传的仓库？

1. 进入Gitee仓库页面
2. 点击"管理" -> "基本设置"
3. 滚动到底部，点击"删除仓库"
4. 输入仓库名称确认删除

---

## 后续步骤

上传完成后，您可以：

1. **配置README** - 编辑README.md，添加项目说明
2. **设置Issues** - 启用Issues功能，接收用户反馈
3. **配置Wiki** - 添加项目文档
4. **设置Pages** - 部署项目文档网站
5. **添加协作者** - 邀请其他开发者

---

## 获取帮助

- [Gitee帮助文档](https://gitee.com/help)
- [Git官方文档](https://git-scm.com/doc)
- [Gitee社区](https://gitee.com/explore)

---

**上传成功后，您就可以在国内快速访问和部署Memory Gallery了！** 🎉
