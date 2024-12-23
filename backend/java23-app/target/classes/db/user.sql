CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50),
    `password` VARCHAR(255),
    `email` VARCHAR(100),
    `phone` VARCHAR(20),
    
    -- 微信相关字段
    `openid` VARCHAR(50) UNIQUE,
    `session_key` VARCHAR(255),
    `nickname` VARCHAR(50),
    `avatar_url` VARCHAR(255),
    `gender` TINYINT,
    `country` VARCHAR(50),
    `province` VARCHAR(50),
    `city` VARCHAR(50),
    
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_openid` (`openid`),
    INDEX `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 