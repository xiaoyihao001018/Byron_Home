package org.example.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "wx")
public class WxConfig {
    private MiniappConfig miniapp;

    @Data
    public static class MiniappConfig {
        private String appid;
        private String secret;
    }
} 