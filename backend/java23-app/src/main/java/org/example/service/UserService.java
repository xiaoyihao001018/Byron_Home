package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.User;
import java.util.Map;

public interface UserService extends IService<User> {
    /**
     * 微信登录
     * @param code 微信登录code
     * @return 登录结果，包含用户信息和token
     */
    Map<String, Object> wxLogin(String code);
    
    /**
     * 创建用户
     * @param user 用户信息
     * @return 创建的用户
     */
    User createUser(User user);
    
    /**
     * 更新用户信息
     * @param user 用户信息
     * @return 更新后的用户
     */
    User updateUser(User user);
    
    /**
     * 根据手机号查询用户
     * @param phone 手机号
     * @return 用户信息
     */
    User getUserByPhone(String phone);
} 