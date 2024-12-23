package org.example.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.example.common.Result;
import org.example.entity.User;
import org.example.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = "用户管理")
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @ApiOperation("微信小程序登录")
    @GetMapping("/wx/login")
    public Result<User> wxLogin(@ApiParam("微信登录code") @RequestParam String code) {
        return Result.success(userService.wxLogin(code));
    }

    @ApiOperation("创建用户")
    @PostMapping
    public Result<User> createUser(@ApiParam("用户信息") @RequestBody User user) {
        return Result.success(userService.createUser(user));
    }

    @ApiOperation("更新用户信息")
    @PutMapping("/{id}")
    public Result<User> updateUser(
            @ApiParam("用户ID") @PathVariable Long id,
            @ApiParam("用户信息") @RequestBody User user) {
        user.setId(id);
        return Result.success(userService.updateUser(user));
    }

    @ApiOperation("获取用户信息")
    @GetMapping("/{id}")
    public Result<User> getUser(@ApiParam("用户ID") @PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @ApiOperation("获取用户列表")
    @GetMapping("/list")
    public Result<List<User>> listUsers() {
        return Result.success(userService.list());
    }

    @ApiOperation("删除用户")
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteUser(@ApiParam("用户ID") @PathVariable Long id) {
        return Result.success(userService.removeById(id));
    }

    @ApiOperation("根据手机号查询用户")
    @GetMapping("/phone/{phone}")
    public Result<User> getUserByPhone(@ApiParam("手机号") @PathVariable String phone) {
        return Result.success(userService.getUserByPhone(phone));
    }
} 