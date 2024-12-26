package org.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.config.WxConfig;
import org.example.entity.User;
import org.example.mapper.UserMapper;
import org.example.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final WxConfig wxConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${jwt.secret:your-default-secret-key}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}") // 默认24小时
    private Long jwtExpiration;
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    private String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("openid", user.getOpenid());
        
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 获取微信openid
     */
    private String getOpenid(String code) {
        try {
            String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                wxConfig.getMiniapp().getAppid(),
                wxConfig.getMiniapp().getSecret(),
                code
            );
            
            // 设置请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<?> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
            );
            
            String responseBody = response.getBody();
            if (responseBody == null) {
                throw new RuntimeException("微信接口返回为空");
            }
            
            Map<String, String> result = objectMapper.readValue(responseBody, Map.class);
            
            if (result.containsKey("errcode") && !"0".equals(result.get("errcode"))) {
                throw new RuntimeException("微信接口返回错误: " + result.get("errmsg"));
            }
            
            return result.get("openid");
        } catch (Exception e) {
            log.error("获取openid失败", e);
            throw new RuntimeException("获取openid失败: " + e.getMessage());
        }
    }

    /**
     * 根据openid获取用户
     */
    private User getUserByOpenid(String openid) {
        return getOne(new LambdaQueryWrapper<User>()
            .eq(User::getOpenid, openid));
    }

    @Override
    public User wxLogin(String code) {
        try {
            // 调用微信接口获取openid
            String openid = getOpenid(code);
            if (openid == null || openid.isEmpty()) {
                throw new RuntimeException("获取openid失败");
            }

            // 根据openid查询用户
            User user = getUserByOpenid(openid);
            if (user == null) {
                // 如果用户不存在，创建新用户
                user = new User();
                user.setOpenid(openid);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                save(user);
            }

            return user;
        } catch (Exception e) {
            log.error("微信登录失败", e);
            throw new RuntimeException("微信登录失败: " + e.getMessage());
        }
    }

    @Override
    public User createUser(User user) {
        log.info("创建新用户");
        // 检查手机号是否已存在
        if (user.getPhone() != null) {
            User existingUser = getUserByPhone(user.getPhone());
            if (existingUser != null) {
                throw new RuntimeException("手机号已被使用");
            }
        }
        
        // 设置默认值
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        save(user);
        log.info("用户创建成功, userId: {}", user.getId());
        return user;
    }

    @Override
    public User updateUser(User user) {
        log.info("更新用户信息, userId: {}", user.getId());
        if (user.getId() == null) {
            throw new RuntimeException("用户ID不能为空");
        }
        
        // 检查用户是否存在
        User existingUser = getById(user.getId());
        if (existingUser == null) {
            throw new RuntimeException("用户不存在");
        }
        
        // 如果修改了手机号，检查新手机号是否已被使用
        if (user.getPhone() != null && !user.getPhone().equals(existingUser.getPhone())) {
            User phoneUser = getUserByPhone(user.getPhone());
            if (phoneUser != null) {
                throw new RuntimeException("手机号已被使用");
            }
        }
        
        // 更新时间
        user.setUpdatedAt(LocalDateTime.now());
        updateById(user);
        
        log.info("用户信息更新成功");
        return getById(user.getId());
    }

    @Override
    public User getUserByPhone(String phone) {
        log.info("根据手机号查询用户: {}", phone);
        User user = getOne(new LambdaQueryWrapper<User>()
            .eq(User::getPhone, phone));
        log.info("查询结果: {}", user != null ? "用户存在" : "用户不存在");
        return user;
    }
}