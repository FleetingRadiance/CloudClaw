# 构建阶段
FROM node:22-alpine AS build-stage

WORKDIR /app

# 设置环境变量，忽略类型检查错误
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV VITE_IS_DOCKER=true

# 使用国内 npm 镜像加速
# strict-ssl false：构建环境（公司代理/防火墙）下 npmmirror 证书链无法验证，
# 需在所有 npm 命令之前关闭严格 SSL 校验。
RUN npm config set registry https://registry.npmmirror.com \
  && npm config set strict-ssl false

# 升级 npm 修复 Node 22 自带 npm 的 "Exit handler never called" bug
RUN npm install -g npm@latest

# 注入前端 commit hash（构建上下文为 frontend/，无 .git，故通过构建参数传入）
ARG COMMIT_ID_ARG=unknown
ENV VITE_FRONTEND_COMMIT=${COMMIT_ID_ARG}

# 复制依赖文件
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY packages/xlsx-0.20.2.tgz ./packages/xlsx-0.20.2.tgz

# 安装依赖
# 1) allow-remote=all：构建机 lockfile 中部分包 resolved 指向 mirrors.tencent.com，
#    与 registry（npmmirror）主机不一致，npm 会视为 "remote" 并默认拒绝（EALLOWREMOTE）。
#    开启 allow-remote=all 允许按 lockfile 记录的主机拉取。
# 2) allow-scripts=true：npm 11 默认拦截安装脚本，会阻断 esbuild/vue-demi
#    的 postinstall，导致运行时异常，这里显式放行。
# 3) 使用 npm install 而非 npm ci：package.json 新增了 sass-embedded 依赖，
#    npm ci 要求 lockfile 与 package.json 严格同步否则报错，
#    npm install 会自动安装新增依赖并更新 lockfile。
RUN npm config set strict-ssl false \
  && npm config set allow-remote all \
  && npm config set allow-scripts true \
  # lockfile 中部分包（含 esbuild 平台二进制 @esbuild/linux-x64）的 resolved
  # 地址锁定为 mirrors.tencent.com；若构建机访问不到该镜像，npm 会"静默跳过"
  # 这一 optional 依赖，导致后续 vite build 报 "@esbuild/linux-x64 could not be found"。
  # 统一改写为 Dockerfile 设定的 npmmirror，保证所有包都从可达镜像拉取。
  && sed -i 's#https://mirrors.tencent.com/npm/#https://registry.npmmirror.com/#g' package-lock.json \
  && npm install
# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine AS production-stage

# 复制构建产物到nginx服务目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制nginx配置模板文件
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 复制启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 设置默认环境变量（MB）
ENV MAX_FILE_SIZE_MB=50

# 暴露端口
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"] 