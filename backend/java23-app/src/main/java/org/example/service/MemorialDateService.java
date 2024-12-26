package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.MemorialDate;

import java.util.List;

public interface MemorialDateService extends IService<MemorialDate> {
    /**
     * 创建纪念日
     */
    MemorialDate createDate(MemorialDate date, Long userId);
    
    /**
     * 更新纪念日
     */
    MemorialDate updateDate(MemorialDate date, Long userId);
    
    /**
     * 删除纪念日
     */
    void deleteDate(Long dateId, Long userId);
    
    /**
     * 获取用户的所有纪念日
     */
    List<MemorialDate> getUserDates(Long userId);
    
    /**
     * 获取用户的生理期记录
     */
    List<MemorialDate> getUserPeriods(Long userId);
    
    /**
     * 获取最近的提醒
     */
    List<MemorialDate> getUpcomingReminders(Long userId, Integer days);
    
    /**
     * 获取即将到来的纪念日
     * @param userId 用户ID
     * @return 纪念日列表
     */
    List<MemorialDate> getUpcomingDates(Long userId);
} 