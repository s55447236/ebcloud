# 英博云平台

英博云平台是一个现代化的云计算管理平台，提供 GPU 集群管理、存储管理等功能。

## 功能特点

- 集群管理：创建和管理 GPU 计算集群
- 存储管理：块存储、共享存储和文件存储管理
- 开发机管理：管理开发测试环境
- 镜像管理：容器镜像管理
- 账户管理：用户认证和访问控制
- 计费管理：资源使用计费和账单管理

## 技术栈

- 前端：HTML5, CSS3, JavaScript (ES6+)
- UI 框架：Bootstrap 5
- 图标：Font Awesome
- 图表：Chart.js
- 路由：原生 JavaScript SPA 路由

## 快速开始

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/ingbro-cloud-platform.git
```

2. 进入项目目录：

```bash
cd ingbro-cloud-platform
```

3. 使用 Web 服务器（如 Live Server）启动项目。

## 项目结构

```
ingbro-cloud-platform/
├── index.html          # 入口文件
├── app.js             # 主应用程序文件
├── styles.css         # 全局样式
├── js/                # JavaScript模块
│   ├── cluster.js     # 集群管理模块
│   └── ...
├── images/           # 图片资源
└── pages/           # HTML页面
    ├── dashboard.html
    ├── cluster.html
    └── ...
```

## 开发指南

1. 添加新页面：

   - 在 `pages/` 目录下创建新的 HTML 文件
   - 在 `app.js` 的路由配置中添加新页面
   - 在侧边栏菜单中添加新页面链接

2. 添加新功能：
   - 在 `js/` 目录下创建新的 JavaScript 模块
   - 在相应的 HTML 页面中引入新模块
   - 在 `app.js` 中注册新模块的初始化函数

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
