package org.example.enums;

public enum DateType {
    MEMORIAL("纪念日"),
    COUNTDOWN("倒数日"),
    PERIOD("生理期");
    
    private final String desc;
    
    DateType(String desc) {
        this.desc = desc;
    }
    
    public String getDesc() {
        return desc;
    }
} 