package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.User;

public interface UserService extends IService<User> {
    /**
     * 微信登录
     */
    User wxLogin(String code);

    /**
     * 创建用户
     */
    User createUser(User user);

    /**
     * 更新用户信息
     */
    User updateUser(User user);

    /**
     * 根据手机号查询用户
     */
    User getUserByPhone(String phone);
} 