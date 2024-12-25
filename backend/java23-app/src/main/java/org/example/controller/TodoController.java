package org.example.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.example.common.R;
import org.example.entity.Todo;
import org.example.service.TodoService;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Api(tags = "待办事项")
@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TodoController {
    
    private final TodoService todoService;
    
    @ApiOperation("创建待办事项")
    @PostMapping
    public R<Todo> createTodo(@RequestBody Todo todo, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(todoService.createTodo(todo, userId));
    }
    
    @ApiOperation("更新待办事项")
    @PutMapping
    public R<Todo> updateTodo(@RequestBody Todo todo, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(todoService.updateTodo(todo, userId));
    }
    
    @ApiOperation("删除待办事项")
    @DeleteMapping("/{id}")
    public R<Void> deleteTodo(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        todoService.deleteTodo(id, userId);
        return R.ok();
    }
    
    @ApiOperation("获取待办事项列表")
    @GetMapping("/list")
    public R<List<Todo>> getTodoList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(todoService.getUserTodos(userId));
    }
    
    @ApiOperation("更新待办事项状态")
    @PutMapping("/{id}/status/{status}")
    public R<Todo> updateTodoStatus(
            @PathVariable Long id,
            @PathVariable Integer status,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(todoService.updateTodoStatus(id, userId, status));
    }
    
    @ApiOperation("更新待办事项优先级")
    @PutMapping("/{id}/priority/{priority}")
    public R<Todo> updateTodoPriority(
            @PathVariable Long id,
            @PathVariable Integer priority,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(todoService.updateTodoPriority(id, userId, priority));
    }
} 