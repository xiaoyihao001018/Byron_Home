package org.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.MemorialDate;
import org.example.enums.DateType;
import org.example.mapper.MemorialDateMapper;
import org.example.service.MemorialDateService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemorialDateServiceImpl extends ServiceImpl<MemorialDateMapper, MemorialDate> implements MemorialDateService {

    @Override
    public MemorialDate createDate(MemorialDate date, Long userId) {
        date.setUserId(userId);
        date.setCreatedAt(LocalDateTime.now());
        date.setUpdatedAt(LocalDateTime.now());
        save(date);
        return calculateDaysLeft(date);
    }

    @Override
    public MemorialDate updateDate(MemorialDate date, Long userId) {
        // 验证权限
        MemorialDate existing = getById(date.getId());
        if (existing == null || !existing.getUserId().equals(userId)) {
            throw new RuntimeException("无权修改此记录");
        }
        
        date.setUserId(userId);
        date.setUpdatedAt(LocalDateTime.now());
        updateById(date);
        return calculateDaysLeft(date);
    }

    @Override
    public void deleteDate(Long dateId, Long userId) {
        remove(new LambdaQueryWrapper<MemorialDate>()
                .eq(MemorialDate::getId, dateId)
                .eq(MemorialDate::getUserId, userId));
    }

    @Override
    public List<MemorialDate> getUserDates(Long userId) {
        List<MemorialDate> dates = list(new LambdaQueryWrapper<MemorialDate>()
                .eq(MemorialDate::getUserId, userId)
                .ne(MemorialDate::getType, DateType.PERIOD.name())
                .orderByAsc(MemorialDate::getDate));
        
        return dates.stream()
                .map(this::calculateDaysLeft)
                .collect(Collectors.toList());
    }

    @Override
    public List<MemorialDate> getUserPeriods(Long userId) {
        List<MemorialDate> dates = list(new LambdaQueryWrapper<MemorialDate>()
                .eq(MemorialDate::getUserId, userId)
                .eq(MemorialDate::getType, DateType.PERIOD.name())
                .orderByDesc(MemorialDate::getDate)
                .last("LIMIT 12"));  // 只返回最近12次记录
        
        return dates.stream()
                .map(this::calculateDaysLeft)
                .collect(Collectors.toList());
    }

    @Override
    public List<MemorialDate> getUpcomingReminders(Long userId, Integer days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        
        List<MemorialDate> dates = list(new LambdaQueryWrapper<MemorialDate>()
                .eq(MemorialDate::getUserId, userId)
                .ge(MemorialDate::getDate, today)
                .le(MemorialDate::getDate, endDate)
                .orderByAsc(MemorialDate::getDate));
        
        return dates.stream()
                .map(this::calculateDaysLeft)
                .collect(Collectors.toList());
    }
    
    /**
     * 计算剩余天数或已过天数
     */
    private MemorialDate calculateDaysLeft(MemorialDate date) {
        LocalDate today = LocalDate.now();
        LocalDate targetDate = date.getDate();
        
        // 计算天数差
        long days = ChronoUnit.DAYS.between(today, targetDate);
        date.setDaysLeft((int) days);
        
        // 格式化日期
        date.setDateStr(targetDate.toString());
        
        return date;
    }
} 