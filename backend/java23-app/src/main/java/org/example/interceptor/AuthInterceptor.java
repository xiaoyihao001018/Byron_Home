package org.example.interceptor;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.example.utils.JwtUtils;
import org.example.utils.UserContext;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

        // 从请求头中获取token
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            return false;
        }

        try {
            // ���证token
            if (!jwtUtils.validateToken(token)) {
                response.setStatus(401);
                return false;
            }

            // 获取用户ID
            Long userId = jwtUtils.getUserIdFromToken(token);
            
            // 将用户ID存储到request中，方便后续使用
            request.setAttribute("userId", userId);
            
            // 设置用户ID到UserContext中
            UserContext.setCurrentUserId(userId);
            
            return true;
        } catch (Exception e) {
            response.setStatus(401);
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        // 清理UserContext
        UserContext.clear();
    }
} 