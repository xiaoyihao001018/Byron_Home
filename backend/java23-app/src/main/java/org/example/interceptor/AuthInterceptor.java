package org.example.interceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.utils.JwtUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtils jwtUtils;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 如果是OPTIONS请求，直接放行
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        // 获取token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 验证token
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            return false;
        }

        // 验证token是否过期
        if (jwtUtils.isTokenExpired(token)) {
            response.setStatus(401);
            return false;
        }

        // 获取用户ID
        Long userId = jwtUtils.getUserIdFromToken(token);
        if (userId == null) {
            response.setStatus(401);
            return false;
        }

        // 将用户ID存入request中，后续接口可以使用
        request.setAttribute("userId", userId);
        return true;
    }
} 