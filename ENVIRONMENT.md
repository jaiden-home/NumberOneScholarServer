# 环境配置说明

## 1. 系统要求

- Node.js 16.x 或更高版本
- npm 7.x 或更高版本
- MySQL 5.7 或更高版本（使用 RDS MySQL 基础系列倚天版）

## 2. 安装依赖

```bash
npm install
```

## 3. 环境变量配置

### 3.1 创建环境变量文件

复制 `.env.example` 文件并重命名为 `.env`，然后根据实际情况修改配置：

```bash
cp .env.example .env
```

### 3.2 配置参数说明

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| DB_HOST | 数据库主机地址 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_USER | 数据库用户名 | admin |
| DB_PASSWORD | 数据库密码 | password |
| DB_NAME | 数据库名称 | example_db |
| DB_POOL_SIZE | 数据库连接池大小 | 10 |
| DB_CONNECTION_TIMEOUT | 数据库连接超时时间（毫秒） | 30000 |
| LOG_LEVEL | 日志级别 | info |
| CORS_ORIGIN | CORS 允许的源 | * |

### 3.3 RDS MySQL 配置

使用 RDS MySQL 基础系列倚天版时，需要将 `DB_HOST` 设置为 RDS 实例的端点地址，例如：

```
DB_HOST=your-rds-instance-endpoint.rds.amazonaws.com
```

## 4. 数据库初始化

### 4.1 创建数据库

登录 MySQL 数据库，创建指定的数据库：

```sql
CREATE DATABASE example_db;
```

### 4.2 执行初始化脚本

使用以下命令执行数据库初始化脚本，创建用户表：

```bash
mysql -u admin -p example_db < data/mysql/init.sql
```

## 5. 启动项目

### 5.1 开发环境

使用 nodemon 启动项目，支持热重载：

```bash
npm run dev
```

### 5.2 生产环境

使用 node 直接启动项目：

```bash
npm start
```

## 6. 代码质量检查

### 6.1 ESLint 检查

```bash
npm run lint
```

### 6.2 代码格式化

```bash
npm run format
```

## 7. 健康检查

项目启动后，可以通过以下端点检查服务状态：

```
GET /health
```

响应示例：

```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-22T12:00:00.000Z",
  "requestId": "random-request-id"
}
```