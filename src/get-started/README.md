---
title: 快速开始
icon: signs-post
category: 
 - 快速开始
 - 开发
---

**如果你是点歌系统用户，请前往[用户指南](/guide/)**

# 快速开始

本指南将帮助您快速安装和运行Voice of SZSY项目。

## 系统要求

在开始之前，请确保您的系统满足以下要求：

- Node.js >= 22
- pnpm >= 8
- PostgreSQL 数据库（推荐）或其他兼容的数据库
- (可选) Vercel Config 存储

## 安装步骤

### 1. 克隆项目&安装依赖

```bash
git clone https://github.com/ljk743121/Sound-of-experiment.git
cd Sound-of-experiment
pnpm install
```

### 2. 配置环境变量

创建 `.env` 文件并配置必要的环境变量：

```bash
# 数据库
DATABASE_URL=
# jwt加密密钥（通过auth:genKey脚本生成）
ENC_KID=
ENC_PRIVATE_KEY=
ENC_PUBLIC_KEY=
SIGN_KID=
SIGN_PRIVATE_KEY=
SIGN_PUBLIC_KEY=
# vercel edge config (vercel 自动生成)
EDGE_CONFIG=
EDGE_CONFIG_ID=
EDGE_CONFIG_TOKEN=
# hash配置，自动生成
NUXT_SESSION_PASSWORD=
# 自定义音乐源(可选)
WY_URL=
TX_URL=
#开放使用，生产环境不用填写
DATABASE_URL_DEV=
DB_ENV=
```

### 3. 生成安全密钥
运行以下命令生成jwt令牌所需的密钥对，并复制到环境变量中：

```bash
pnpm run auth:genKey
```

### 4. 数据库设置
推送数据库架构：

```bash
pnpm run db:push
```

### 5. 创建管理员账户
首先需要手动创建一个用户（可以通过注册页面或数据库直接插入），然后运行：

```bash
pnpm run user:admin
```

输入用户ID后，将授予用户所有权限

### 6. 启动开发服务器

```bash
pnpm run dev
```

默认情况下，应用将在 http://localhost:3000 上运行。


## 生产部署

### 构建生产版本：

```bash
pnpm run build
```

### 预览生产构建：

```bash
pnpm run preview
```

### 可用的脚本
| 命令 | 描述 |
| --- | --- |
| pnpm run dev | 启动开发服务器 |
| pnpm run build | 构建生产版本 |
| pnpm run postinstall | 生成nuxt准备文件 |
| pnpm run db:push | 推送数据库架构更改 |
| pnpm run auth:genKey | 生成认证密钥对 |
| pnpm run user:admin | 设置管理员 |
| pnpm run user:robot | 获取robot令牌 |
| pnpm run husky:prepare | 配置husky |
| pnpm run lint:lint-staged | 检查已暂存的文件 |
| pnpm run lint:format | 格式化已暂存文件 |

更多详细的开发参考，请参阅[开发参考](/development/)。   