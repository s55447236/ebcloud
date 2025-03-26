# 英博云平台

英博云平台是一个现代化的云资源管理平台，提供了丰富的云计算资源管理功能。

## 功能特点

- 集群管理：管理和监控计算集群
- 存储管理：
  - 块存储：管理块存储设备
  - 共享存储：支持多容器挂载访问的共享存储
  - 文件存储：文件系统级别的存储服务
- 镜像管理：容器镜像的管理和部署
- 开发机管理：云端开发环境管理
- 账户管理：
  - 访问控制：用户权限和角色管理
  - 计费中心：资源使用计费
  - 账单管理：费用账单查询

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- UI 框架：Bootstrap 5
- 图标：Font Awesome 5
- 图表：Chart.js

## 开发环境设置

1. 克隆仓库：

```bash
git clone [仓库地址]
```

2. 安装依赖：

```bash
# 如果使用npm
npm install

# 如果使用yarn
yarn install
```

3. 启动开发服务器：

```bash
# 使用任意HTTP服务器，例如：
python -m http.server 5500
```

4. 在浏览器中访问：

```
http://localhost:5500
```

## 项目结构

```
├── css/                    # 样式文件
├── js/                     # JavaScript文件
├── images/                 # 图片资源
├── index.html             # 主页面
├── layout.html            # 布局模板
├── dashboard.html         # 仪表盘页面
├── cluster.html           # 集群管理页面
├── storage/               # 存储管理相关页面
└── README.md             # 项目说明文档
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 版本历史

- 1.0.0
  - 初始版本
  - 基础功能实现

## 许可证

[MIT](LICENSE)
