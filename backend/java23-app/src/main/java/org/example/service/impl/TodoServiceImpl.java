package org.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.Todo;
import org.example.exception.BusinessException;
import org.example.mapper.TodoMapper;
import org.example.service.TodoService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class TodoServiceImpl extends ServiceImpl<TodoMapper, Todo> implements TodoService {

    @Override
    @Transactional
    public Todo createTodo(Todo todo, Long userId) {
        todo.setUserId(userId);
        todo.setCreatedAt(LocalDateTime.now());
        todo.setUpdatedAt(LocalDateTime.now());
        
        if (todo.getStatus() == null) {
            todo.setStatus(0);
        }
        if (todo.getPriority() == null) {
            todo.setPriority(0);
        }
        
        save(todo);
        return todo;
    }

    @Override
    @Transactional
    public Todo updateTodo(Todo todo, Long userId) {
        // 验证权限
        Todo existing = getById(todo.getId());
        if (existing == null || !existing.getUserId().equals(userId)) {
            throw new BusinessException("无权修改此待办事项");
        }
        
        todo.setUserId(userId);
        todo.setUpdatedAt(LocalDateTime.now());
        updateById(todo);
        return todo;
    }

    @Override
    @Transactional
    public void deleteTodo(Long id, Long userId) {
        remove(new LambdaQueryWrapper<Todo>()
            .eq(Todo::getId, id)
            .eq(Todo::getUserId, userId));
    }

    @Override
    public List<Todo> getUserTodos(Long userId) {
        return list(new LambdaQueryWrapper<Todo>()
            .eq(Todo::getUserId, userId)
            .orderByDesc(Todo::getCreatedAt));
    }

    @Override
    @Transactional
    public Todo updateTodoStatus(Long id, Long userId, Integer status) {
        Todo todo = getById(id);
        if (todo == null || !todo.getUserId().equals(userId)) {
            throw new BusinessException("无权修改此待办事项");
        }
        
        todo.setStatus(status);
        todo.setUpdatedAt(LocalDateTime.now());
        updateById(todo);
        return todo;
    }

    @Override
    @Transactional
    public Todo updateTodoPriority(Long id, Long userId, Integer priority) {
        Todo todo = getById(id);
        if (todo == null || !todo.getUserId().equals(userId)) {
            throw new BusinessException("无权修改此待办事项");
        }
        
        todo.setPriority(priority);
        todo.setUpdatedAt(LocalDateTime.now());
        updateById(todo);
        return todo;
    }
} 