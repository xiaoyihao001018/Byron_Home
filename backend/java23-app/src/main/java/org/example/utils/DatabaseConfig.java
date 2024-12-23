package org.example.utils;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);
    private static HikariDataSource dataSource;

    static {
        try {
            initializeDataSource();
        } catch (IOException e) {
            logger.error("Failed to initialize database connection pool", e);
        }
    }

    private static void initializeDataSource() throws IOException {
        Properties props = new Properties();
        try (InputStream input = DatabaseConfig.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                throw new IOException("Unable to find application.properties");
            }
            props.load(input);
        }

        try {
            HikariConfig config = new HikariConfig();
            config.setDriverClassName(props.getProperty("db.driver").trim());
            config.setJdbcUrl(props.getProperty("db.url").trim());
            config.setUsername(props.getProperty("db.username").trim());
            config.setPassword(props.getProperty("db.password").trim());
            
            // 连接池配置
            config.setMaximumPoolSize(Integer.parseInt(props.getProperty("db.pool.maxPoolSize").trim()));
            config.setMinimumIdle(Integer.parseInt(props.getProperty("db.pool.minIdle").trim()));
            config.setConnectionTimeout(Long.parseLong(props.getProperty("db.pool.connectionTimeout").trim()));

            dataSource = new HikariDataSource(config);
            logger.info("Database connection pool initialized successfully");
        } catch (NumberFormatException e) {
            logger.error("Error parsing numeric configuration values", e);
            throw new IOException("Failed to parse numeric configuration values", e);
        } catch (Exception e) {
            logger.error("Error initializing database connection pool", e);
            throw new IOException("Failed to initialize database connection pool", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        if (dataSource == null) {
            throw new SQLException("DataSource not initialized");
        }
        return dataSource.getConnection();
    }

    public static void closeDataSource() {
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }
} 