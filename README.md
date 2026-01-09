<div align="center">

# 搬瓦工 VPS 管理看板

现代化的搬瓦工 VPS 管理看板，采用 Nuxt 3 + TypeScript + TailwindCSS 构建，提供简洁、美观的界面监控和管理您的 VPS。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

[特性](#-特性) • [快速开始](#-快速开始) • [Docker 部署](#docker-部署) • [开发命令](#-开发命令) • [技术栈](#️-技术栈)

</div>

## ✨ 特性

- 🎨 **Vercel 极简风格** - 简洁、现代、专业的界面设计
- 🔐 **安全认证** - Session + Cookie 认证机制，密钥安全存储
- 📊 **实时监控** - VPS 状态、流量使用、资源监控（10秒自动刷新）
- 🎯 **核心功能** - 启动/停止/重启 VPS，流量监控
- 📱 **响应式设计** - 完美适配桌面端、平板和移动端
- 🌓 **深色模式** - 自适应深色/浅色主题
- 🐳 **Docker 部署** - 一键部署，开箱即用

<!--
## 📸 截图预览

如果您有项目截图，可以在这里展示：

![主看板](screenshots/dashboard.png)
![流量监控](screenshots/traffic.png)
-->

## 🚀 快速开始

### 环境要求

- Node.js 20+
- Yarn（推荐）或 npm
- Docker（可选，用于容器化部署）

### 本地开发

1. **安装依赖**

```bash
yarn install
```

2. **配置环境变量**

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 搬瓦工 API 配置（从 https://kiwivm.64clouds.com 获取）
NUXT_BWG_VEID=your_veid_here
NUXT_BWG_API_KEY=your_api_key_here

# 认证配置（自定义用户名和密码）
NUXT_AUTH_USERNAME=admin
NUXT_AUTH_PASSWORD=your_strong_password_at_least_16_chars

# Session 密钥（使用 openssl rand -base64 32 生成）
NUXT_SESSION_PASSWORD=your_random_session_secret_at_least_32_chars
```

> **获取 API 密钥**: 登录 [KiwiVM 控制面板](https://kiwivm.64clouds.com)，在侧边栏找到 **"VEID"** 和 **"API Key"**
>
> **生成 Session 密钥**:
> ```bash
> openssl rand -base64 32
> ```

3. **启动开发服务器**

```bash
yarn dev
```

访问 http://localhost:3000

### Docker 部署

#### 方式一：使用 Docker Compose（推荐）

1. **创建配置文件**

```bash
mkdir -p bandwagon-dashboard
cd bandwagon-dashboard
```

2. **创建 `.env` 文件**

```env
NUXT_BWG_VEID=your_veid_here
NUXT_BWG_API_KEY=your_api_key_here
NUXT_AUTH_USERNAME=admin
NUXT_AUTH_PASSWORD=your_strong_password
NUXT_SESSION_PASSWORD=your_random_session_secret
```

3. **创建 `docker-compose.yml`**

```yaml
services:
  bandwagon-dashboard:
    image: dhslegle/bandwagon-dashboard:latest
    container_name: bandwagon-dashboard
    restart: always
    ports:
      - '3000:3000'
    env_file:
      - .env
```

4. **启动服务**

```bash
docker-compose up -d
```

#### 方式二：直接使用 Docker

```bash
docker run -d \
  --name bandwagon-dashboard \
  --restart always \
  -p 3000:3000 \
  -e NUXT_BWG_VEID=your_veid_here \
  -e NUXT_BWG_API_KEY=your_api_key_here \
  -e NUXT_AUTH_USERNAME=admin \
  -e NUXT_AUTH_PASSWORD=your_strong_password \
  -e NUXT_SESSION_PASSWORD=your_random_session_secret \
  dhslegle/bandwagon-dashboard:latest
```

访问 `http://localhost:3000` 即可使用看板。

> **生产环境建议**: 使用 Nginx/Caddy 反向代理并配置 HTTPS

## 🔒 安全特性

- ✅ **API 密钥保护** - 密钥存储在服务器端，永不暴露给前端
- ✅ **Session 认证** - 基于 nuxt-auth-utils 的安全会话管理
- ✅ **HTTPS 强制** - 生产环境强制使用 HTTPS
- ✅ **安全头** - X-Frame-Options、CSP 等安全响应头
- ✅ **非 root 运行** - Docker 容器使用非 root 用户运行

## 🛠️ 技术栈

- **框架**: Nuxt 3 (Vue 3 + Vite)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **图标**: @nuxt/icon (Heroicons)
- **认证**: nuxt-auth-utils
- **工具**: VueUse、Day.js
- **部署**: Docker

## 📝 开发命令

```bash
# 安装依赖
yarn install

# 开发服务器 (http://localhost:3000)
yarn dev

# 生产构建
yarn build

# 预览生产构建
yarn preview

# 代码质量检查
yarn lint              # ESLint 检查
yarn lint:fix          # ESLint 自动修复
yarn typecheck         # TypeScript 类型检查
yarn format            # Prettier 格式化代码
yarn format:check      # 检查代码格式
yarn check-all         # 完整检查流程（格式 → 类型 → Lint → 格式化）

# Docker 构建（多架构）
yarn build-docker      # 需要设置 $DOCKER_USERNAME 环境变量
```

## 🎯 核心功能

### 1. VPS 状态监控

- 内存使用率
- 磁盘使用率
- 一键启动/停止/重启控制

### 2. 流量监控

- 月度流量使用进度条
- 流量重置倒计时
- 已用/总量详细显示
- IPv4/IPv6 地址列表
- 一键复制 IP

### 3. 网络 I/O

- 网络 I/O 数据的柱状图
- 支持鼠标悬停查看具体数据
- 支持切换不同的时间范围：
  - 1 天
  - 1 周
  - 1 月
  - 1 年

## 📂 项目结构

```
bandwagon-host-dashboard/
├── app/                    # 前端应用代码
│   ├── components/         # Vue 组件
│   ├── composables/        # Vue Composables
│   ├── layouts/            # 布局组件
│   ├── middleware/         # 客户端路由中间件
│   ├── pages/              # 页面路由
│   └── types/              # TypeScript 类型定义
├── server/                 # 后端 API 代码
│   ├── api/                # API 端点
│   ├── middleware/         # 服务器端中间件
│   └── utils/              # 工具函数（含 API 客户端）
├── public/                 # 静态资源
├── nuxt.config.ts          # Nuxt 配置
├── tailwind.config.ts      # TailwindCSS 配置
└── docker-compose.yml      # Docker Compose 配置
```

## 🌐 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

在提交 PR 前，请确保：

1. 代码通过 `yarn check-all` 检查
2. 遵循项目现有的代码风格
3. 添加必要的测试和文档

## 🐛 问题反馈

如果您在使用过程中遇到问题，请通过以下方式反馈：

- [提交 Issue](../../issues)
- 详细描述问题复现步骤
- 附上相关日志和截图

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源协议。

## 🔗 相关链接

- [搬瓦工官网](https://bandwagonhost.com/)
- [KiwiVM 控制面板](https://kiwivm.64clouds.com/)
- [搬瓦工 API 文档](https://api.64clouds.com/)
- [Nuxt 3 文档](https://nuxt.com/)

---

<div align="center">

**搬瓦工 VPS 管理看板 © 2026**

如果这个项目对您有帮助，欢迎 ⭐ Star 支持！

</div>
