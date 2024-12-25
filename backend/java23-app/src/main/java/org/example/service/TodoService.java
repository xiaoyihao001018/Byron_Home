package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.Todo;

import java.util.List;

public interface TodoService extends IService<Todo> {
    /**
     * 创建待办事项
     */
    Todo createTodo(Todo todo, Long userId);
    
    /**
     * 更新待办事项
     */
    Todo updateTodo(Todo todo, Long userId);
    
    /**
     * 删除待办事项
     */
    void deleteTodo(Long id, Long userId);
    
    /**
     * 获取用户的所有待办事项
     */
    List<Todo> getUserTodos(Long userId);
    
    /**
     * 更新待办事项状态
     */
    Todo updateTodoStatus(Long id, Long userId, Integer status);
    
    /**
     * 更新待办事项优先级
     */
    Todo updateTodoPriority(Long id, Long userId, Integer priority);
} 