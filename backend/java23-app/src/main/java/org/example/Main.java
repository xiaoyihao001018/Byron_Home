package org.example;

import org.example.utils.DatabaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.SQLException;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        try {
            testDatabaseConnection();
        } catch (Exception e) {
            logger.error("程序执行出错", e);
            System.out.println("程序执行出错：" + e.getMessage());
        }
    }

    private static void testDatabaseConnection() {
        try (Connection connection = DatabaseConfig.getConnection()) {
            if (connection != null) {
                logger.info("数据库连接成功！");
                System.out.println("数据库连接成功！");
            }
        } catch (SQLException e) {
            logger.error("数据库连接失败", e);
            System.out.println("数据库连接失败：" + e.getMessage());
        } finally {
            DatabaseConfig.closeDataSource();
        }
    }
}