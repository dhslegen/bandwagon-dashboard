# 多阶段构建 Dockerfile for Nuxt 3

# 阶段 1: 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制项目文件
COPY . .

# 生成类型定义
RUN npx nuxt prepare

# 构建应用
RUN yarn build

# 阶段 2: 生产阶段
FROM node:20-alpine

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001

# 从构建阶段复制构建产物
COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output

# 切换到非 root 用户
USER nuxt

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# 启动应用
CMD ["node", ".output/server/index.mjs"]
