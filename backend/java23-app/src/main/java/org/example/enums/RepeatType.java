package org.example.enums;

public enum RepeatType {
    NONE("不重复"),
    YEARLY("每年"),
    MONTHLY("每月");
    
    private final String desc;
    
    RepeatType(String desc) {
        this.desc = desc;
    }
    
    public String getDesc() {
        return desc;
    }
} 