package org.example.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("todo")
public class Todo {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Integer priority;  // 0: 低, 1: 中, 2: 高
    private Integer status;    // 0: 待完成, 1: 进行中, 2: 已完成
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 