package org.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.entity.Record;
import org.example.mapper.RecordMapper;
import org.example.service.RecordService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecordServiceImpl extends ServiceImpl<RecordMapper, Record> implements RecordService {

    @Value("${upload.path:/uploads}")
    private String uploadPath;

    @Override
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("上传文件不能为空");
        }

        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename)) {
            throw new RuntimeException("文件名不能为空");
        }

        // 检查文件类型
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        if (!".jpg".equals(extension) && !".jpeg".equals(extension) && !".png".equals(extension)) {
            throw new RuntimeException("只支持 jpg、jpeg、png 格式的图片");
        }

        try {
            // 创建上传目录
            String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            File uploadDir = new File(uploadPath + "/" + datePath);
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                if (!created) {
                    throw new RuntimeException("创建上传目录失败");
                }
            }

            // 生成文件名
            String filename = UUID.randomUUID().toString() + extension;

            // 保存文件
            File destFile = new File(uploadDir, filename);
            file.transferTo(destFile);

            // 返回文件访问路径
            return "/uploads/" + datePath + "/" + filename;
        } catch (Exception e) {
            log.error("上传图片失败", e);
            throw new RuntimeException("上传图片失败: " + e.getMessage());
        }
    }

    @Override
    public Record createRecord(Record record, Long userId) {
        if (record == null) {
            throw new RuntimeException("记录不能为空");
        }
        if (!StringUtils.hasText(record.getImageUrl())) {
            throw new RuntimeException("图片URL不能为空");
        }

        record.setUserId(userId);
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());

        try {
            save(record);
            return record;
        } catch (Exception e) {
            log.error("创建记录失败", e);
            throw new RuntimeException("创建记录失败: " + e.getMessage());
        }
    }

    @Override
    public List<Record> getUserRecords(Long userId) {
        return list(new LambdaQueryWrapper<Record>()
                .eq(Record::getUserId, userId)
                .orderByDesc(Record::getCreatedAt));
    }

    @Override
    public void deleteRecord(Long recordId, Long userId) {
        remove(new LambdaQueryWrapper<Record>()
                .eq(Record::getId, recordId)
                .eq(Record::getUserId, userId));
    }

    @Override
    public List<Record> getRecentRecords(Long userId) {
        // 使用 QueryWrapper 构建查询条件
        QueryWrapper<Record> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                    .orderByDesc("created_at")
                    .last("LIMIT 3"); // 只返回最近的3条记录
        
        return baseMapper.selectList(queryWrapper);
    }
} 