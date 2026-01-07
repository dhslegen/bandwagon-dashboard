# 搬瓦工 VPS 管理看板

现代化的搬瓦工 VPS 管理看板，采用 Nuxt 3 + TypeScript + TailwindCSS 构建，提供简洁、美观的界面监控和管理您的 VPS。

## ✨ 特性

- 🎨 **Vercel 极简风格** - 简洁、现代、专业的界面设计
- 🔐 **安全认证** - Session + Cookie 认证机制，密钥安全存储
- 📊 **实时监控** - VPS 状态、流量使用、资源监控（10秒自动刷新）
- 🎯 **核心功能** - 启动/停止/重启 VPS，流量监控
- 📱 **响应式设计** - 完美适配桌面端、平板和移动端
- 🌓 **深色模式** - 自适应深色/浅色主题
- 🐳 **Docker 部署** - 一键部署，开箱即用

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
# 搬瓦工 API 配置
NUXT_BWG_VEID=your_veid_here
NUXT_BWG_API_KEY=your_api_key_here

# 认证配置
NUXT_AUTH_USERNAME=admin
NUXT_AUTH_PASSWORD=your_strong_password_at_least_16_chars

# Session 密钥（使用 openssl rand -base64 32 生成）
NUXT_SESSION_PASSWORD=your_random_session_secret_at_least_32_chars
```

3. **启动开发服务器**

```bash
yarn dev
```

访问 http://localhost:3000

### Docker 部署

1. **构建镜像**

```bash
docker build -t bandwagon-dashboard .
```

2. **运行容器**

```bash
docker run -d \
  --name bandwagon-dashboard \
  -p 3000:3000 \
  --env-file .env \
  bandwagon-dashboard
```

或使用 Docker Compose：

```bash
docker-compose up -d
```

3. **访问应用**

访问 http://localhost:3000 或 http://your-server-ip:3000



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
# 开发
yarn dev

# 构建
yarn build

# 预览生产构建
yarn preview

# 类型检查
yarn typecheck

# 代码检查
yarn lint

# 自动修复代码问题
yarn lint:fix

# 一键格式化所有代码
yarn format

# 检查格式（不修改文件）
yarn format:check
```

更多格式化配置和使用说明，请参考 [FORMATTING.md](./FORMATTING.md)。

## 🎯 核心功能

### 1. VPS 状态监控

- 实时显示 VPS 运行状态
- 主机名、位置、套餐信息
- 一键启动/停止/重启控制

### 2. 流量监控

- 月度流量使用进度条
- 流量重置倒计时
- 已用/总量详细显示

### 3. 资源监控

- 内存使用率
- 磁盘使用率
- Swap 使用率

### 4. IP 管理

- IPv4 地址列表
- 一键复制 IP

## 🌐 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📄 开源协议

MIT License

---

**搬瓦工 VPS 管理看板 © 2026**
