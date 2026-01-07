# 🚀 快速启动指南

## 第一步：配置环境变量

1. 复制环境变量模板：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入您的配置：

```env
# 搬瓦工 API 配置
NUXT_BWG_VEID=1347645                    # ← 替换为您的 VPS ID
NUXT_BWG_API_KEY=your_api_key_here       # ← 替换为您的 API Key

# 认证配置
NUXT_AUTH_USERNAME=admin                  # ← 设置登录用户名
NUXT_AUTH_PASSWORD=your_strong_password   # ← 设置登录密码（至少16位）

# Session 密钥（生成随机字符串）
NUXT_SESSION_PASSWORD=your_session_secret # ← 使用下面的命令生成
```

### 生成 Session 密钥

在终端运行以下命令生成随机密钥：

```bash
openssl rand -base64 32
```

将输出复制到 `NUXT_SESSION_PASSWORD`。

---

## 第二步：启动项目

### 方式 1：本地开发（推荐用于开发和测试）

```bash
# 1. 确保依赖已安装
yarn install

# 2. 启动开发服务器
yarn dev
```

访问：http://localhost:3000

---

### 方式 2：Docker 部署（推荐用于生产环境）

#### 使用 Docker Compose（最简单）

```bash
# 一键启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 使用 Docker 命令

```bash
# 1. 构建镜像
docker build -t bandwagon-dashboard .

# 2. 运行容器
docker run -d \
  --name bandwagon-dashboard \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  bandwagon-dashboard

# 查看日志
docker logs -f bandwagon-dashboard

# 停止容器
docker stop bandwagon-dashboard

# 删除容器
docker rm bandwagon-dashboard
```

访问：http://localhost:3000 或 http://your-server-ip:3000

---

## 第三步：登录使用

1. 打开浏览器访问 http://localhost:3000
2. 使用您在 `.env` 中配置的用户名和密码登录
3. 首次登录后，您将看到：
   - ✅ VPS 实时状态
   - ✅ 流量使用情况
   - ✅ 资源监控（CPU、内存、磁盘）
   - ✅ 一键控制按钮（启动/停止/重启）

---

## 📋 检查清单

在启动前，请确认：

- [ ] `.env` 文件已创建并填写所有必需配置
- [ ] `NUXT_BWG_VEID` 和 `NUXT_BWG_API_KEY` 已填入正确值
- [ ] `NUXT_AUTH_PASSWORD` 至少 16 位（安全要求）
- [ ] `NUXT_SESSION_PASSWORD` 已使用 `openssl rand -base64 32` 生成
- [ ] 如使用 Docker，端口 3000 未被占用

---

## ⚠️ 常见问题

### 1. API 请求失败

**错误**：`获取 VPS 信息失败`

**解决方案**：

- 检查 `.env` 中的 `NUXT_BWG_VEID` 和 `NUXT_BWG_API_KEY` 是否正确
- 确认搬瓦工 API 可访问（访问 https://api.64clouds.com/v1/getServiceInfo?veid=YOUR_VEID&api_key=YOUR_API_KEY）

### 2. 登录失败

**错误**：`用户名或密码错误`

**解决方案**：

- 检查 `.env` 中的 `NUXT_AUTH_USERNAME` 和 `NUXT_AUTH_PASSWORD`
- 确认输入的用户名和密码与配置一致
- 重启开发服务器使环境变量生效

### 3. Docker 容器无法启动

**错误**：`port is already allocated`

**解决方案**：

- 端口 3000 被占用，修改 `docker-compose.yml` 中的端口映射：
  ```yaml
  ports:
    - '3001:3000' # 改为 3001
  ```

### 4. TypeScript 类型错误

**错误**：`找不到模块 "~/types/bwg"`

**解决方案**：

- 运行 `yarn dev` 或 `nuxt prepare` 重新生成类型

---

## 🔧 开发命令

```bash
# 开发模式（热重载）
yarn dev

# 类型检查
yarn typecheck

# 构建生产版本
yarn build

# 预览生产构建
yarn preview
```

---

## 🐳 Docker 生产部署建议

### 1. 使用 HTTPS（强烈推荐）

在生产环境中，建议使用 Nginx 反向代理 + Let's Encrypt SSL：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. 设置自动重启

`docker-compose.yml` 已配置 `restart: unless-stopped`，服务器重启后容器会自动启动。

### 3. 健康检查

Docker Compose 已配置健康检查，可监控服务状态：

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' bandwagon-dashboard
```

---

## 📞 获取帮助

如遇到问题，请检查：

1. 环境变量配置是否正确
2. 搬瓦工 API 是否可访问
3. Docker 日志：`docker logs bandwagon-dashboard`
4. 浏览器控制台错误信息

---

**祝使用愉快！** 🎉
