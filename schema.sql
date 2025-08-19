-- 基础用户认证表结构
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引优化
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created ON users(created_at);
