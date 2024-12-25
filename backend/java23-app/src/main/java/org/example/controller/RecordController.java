package org.example.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.common.R;
import org.example.entity.Record;
import org.example.service.RecordService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Api(tags = "生活记录")
@RestController
@RequestMapping("/api/record")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @ApiOperation("上传图片")
    @PostMapping("/upload")
    public R<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = recordService.uploadImage(file);
            log.info("图片上传成功: {}", imageUrl);
            return R.ok(imageUrl);
        } catch (Exception e) {
            log.error("图片上传失败", e);
            return R.error("图片上传失败: " + e.getMessage());
        }
    }

    @ApiOperation("创建记录")
    @PostMapping("/create")
    public R<Record> createRecord(@RequestBody Record record, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            log.info("创建记录: userId={}, record={}", userId, record);
            Record created = recordService.createRecord(record, userId);
            log.info("记录创建成功: {}", created);
            return R.ok(created);
        } catch (Exception e) {
            log.error("创建记录失败", e);
            return R.error("创建记录失败: " + e.getMessage());
        }
    }

    @ApiOperation("获取记录列表")
    @GetMapping("/list")
    public R<List<Record>> getRecordList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(recordService.getUserRecords(userId));
    }

    @ApiOperation("删除记录")
    @DeleteMapping("/{id}")
    public R<Void> deleteRecord(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        recordService.deleteRecord(id, userId);
        return R.ok();
    }
} 