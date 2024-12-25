package org.example.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("memorial_date")
public class MemorialDate {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private String title;
    
    private String type;  // MEMORIAL, COUNTDOWN, PERIOD
    
    private LocalDate date;
    
    private String repeatType;  // NONE, YEARLY, MONTHLY
    
    private Integer remindDays;
    
    private String color;
    
    private String icon;
    
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
    
    // 非数据库字段，用于前端显示
    @TableField(exist = false)
    private Integer daysLeft;  // 剩余天数或已过天数
    
    @TableField(exist = false)
    private String dateStr;  // 格式化后的日期字符串
} 