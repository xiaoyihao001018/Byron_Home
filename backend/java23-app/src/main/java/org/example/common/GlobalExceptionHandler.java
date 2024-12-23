package org.example.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntimeException(RuntimeException e) {
        log.error("运行时异常: {}", e.getMessage());
        log.error("异常堆栈:", e);
        return Result.error(e.getMessage());
    }
    
    @ExceptionHandler(RestClientException.class)
    public Result<Void> handleRestClientException(RestClientException e) {
        log.error("调用外部接口异常: {}", e.getMessage());
        log.error("异常堆栈:", e);
        return Result.error("调用外部服务失败: " + e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常: {}", e.getMessage());
        log.error("异常类型: {}", e.getClass().getName());
        log.error("异常堆栈:", e);
        return Result.error("系统异常，请联系管理员");
    }
} 