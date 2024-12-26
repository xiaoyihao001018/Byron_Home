package org.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.entity.Record;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RecordService extends IService<Record> {
    /**
     * 上传图片
     */
    String uploadImage(MultipartFile file);
    
    /**
     * 创建记录
     */
    Record createRecord(Record record, Long userId);
    
    /**
     * 获取用户的记录列表
     */
    List<Record> getUserRecords(Long userId);
    
    /**
     * 删除记录
     */
    void deleteRecord(Long recordId, Long userId);
    
    /**
     * 获取最近记录
     * @param userId 用户ID
     * @return 记录列表
     */
    List<Record> getRecentRecords(Long userId);
} 