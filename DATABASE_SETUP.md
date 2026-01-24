# 数据库服务设置指南

本文档提供了在 Number One Scholar 服务器项目中设置和运行数据库服务的详细说明。

## 问题描述

当启动服务器时，可能会遇到数据库服务不可用的情况，导致应用无法正常使用数据库功能。

## 解决方案

我们提供了两种方法来设置和运行数据库服务：

### 方法一：使用 Docker Compose（推荐）

Docker Compose 是一种简单、可靠的方法来运行 MySQL 服务，不需要在本地安装 MySQL。

#### 步骤 1：安装 Docker Desktop

1. 访问 [Docker 官方网站](https://www.docker.com/products/docker-desktop) 下载并安装 Docker Desktop。
2. 安装完成后，启动 Docker Desktop。

#### 步骤 2：启动 MySQL 服务

1. 在项目根目录下，运行以下命令：

   ```bash
   docker-compose up -d
   ```

2. 这将启动一个 MySQL 容器，配置如下：
   - 端口：3306
   - 用户名：admin
   - 密码：password
   - 数据库名：example_db
   - 自动初始化表结构（使用 `data/mysql/init.sql` 文件）

#### 步骤 3：验证数据库连接

1. 运行以下命令检查容器状态：

   ```bash
   docker-compose ps
   ```

2. 你应该看到一个名为 `numberone-scholar-mysql` 的容器正在运行。

### 方法二：使用本地 MySQL 服务

如果你已经在本地安装了 MySQL，可以使用以下步骤来设置数据库服务。

#### 步骤 1：启动 MySQL 服务

1. 对于 macOS 用户，使用 Homebrew 启动 MySQL 服务：

   ```bash
   brew services start mysql
   ```

2. 对于 Windows 用户，使用服务管理器启动 MySQL 服务。

3. 对于 Linux 用户，使用系统服务管理器启动 MySQL 服务：

   ```bash
   sudo systemctl start mysql
   ```

#### 步骤 2：创建数据库和用户

1. 连接到 MySQL 服务器：

   ```bash
   mysql -u root -p
   ```

2. 创建数据库和用户：

   ```sql
   CREATE DATABASE example_db;
   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON example_db.* TO 'admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### 步骤 3：初始化表结构

1. 运行以下命令初始化表结构：

   ```bash
   mysql -u admin -p example_db < data/mysql/init.sql
   ```

## 验证数据库连接

启动服务器后，你可以通过以下方式验证数据库连接：

1. 检查服务器日志，确认是否有 "Database connected successfully" 的消息。
2. 访问 `http://localhost:3000/health` 端点，检查响应中的 `databaseConnected` 字段是否为 `true`。
3. 访问 `http://localhost:3000/api/users` 端点，检查是否能够正常返回用户列表（可能为空列表）。

## 故障排除

### 数据库连接错误

如果遇到数据库连接错误，请检查以下几点：

1. MySQL 服务是否正在运行。
2. 数据库配置是否正确（用户名、密码、数据库名）。
3. 防火墙是否阻止了 MySQL 端口（3306）的访问。

### Docker 相关问题

如果使用 Docker Compose 遇到问题，请检查以下几点：

1. Docker Desktop 是否正在运行。
2. 是否有足够的系统资源分配给 Docker。
3. 容器是否有足够的权限访问挂载的卷。

## 总结

通过本指南，你应该能够成功设置和运行数据库服务，使 Number One Scholar 服务器能够正常使用数据库功能。

如果在设置过程中遇到任何问题，请参考相关文档或寻求技术支持。