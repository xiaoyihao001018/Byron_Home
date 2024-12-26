package org.example.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.common.R;
import org.example.entity.User;
import org.example.service.UserService;
import org.example.utils.JwtUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@Slf4j
@Api(tags = "用户管理")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @ApiOperation("微信登录")
    @PostMapping("/wx-login")
    public R<Map<String, Object>> wxLogin(@RequestBody Map<String, String> params) {
        String code = params.get("code");
        if (code == null || code.isEmpty()) {
            return R.error("登录失败：code不能为空");
        }

        try {
            // 调用微信登录服务
            User user = userService.wxLogin(code);
            if (user == null) {
                return R.error("登录��败");
            }

            // 生成token
            String token = jwtUtils.generateToken(user.getId());

            // 返回token和用户信息
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);

            return R.ok(result);
        } catch (Exception e) {
            log.error("微信登录失败", e);
            return R.error("登录失败：" + e.getMessage());
        }
    }

    @ApiOperation("验证token")
    @GetMapping("/check-token")
    public R<Void> checkToken() {
        // token 的验证在拦截器中完成，如果能到达这个接口，说明 token 是有效的
        return R.ok();
    }

    @ApiOperation("创建用户")
    @PostMapping("/create")
    public R<User> createUser(@RequestBody User user) {
        return R.ok(userService.createUser(user));
    }

    @ApiOperation("更新用户信息")
    @PostMapping("/update")
    public R<User> updateUser(@RequestBody User user) {
        return R.ok(userService.updateUser(user));
    }

    @ApiOperation("根据手机号查询用户")
    @GetMapping("/getByPhone")
    public R<User> getUserByPhone(@RequestParam String phone) {
        return R.ok(userService.getUserByPhone(phone));
    }
} 