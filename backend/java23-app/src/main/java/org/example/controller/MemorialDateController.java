package org.example.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.common.R;
import org.example.entity.MemorialDate;
import org.example.service.MemorialDateService;
import org.example.utils.UserContext;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Api(tags = "纪念日管理")
@RestController
@RequestMapping("/api/dates")
@RequiredArgsConstructor
public class MemorialDateController {

    private final MemorialDateService memorialDateService;

    @ApiOperation("创建纪念日")
    @PostMapping("/create")
    public R<MemorialDate> createDate(@RequestBody MemorialDate date, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(memorialDateService.createDate(date, userId));
    }

    @ApiOperation("更新纪念日")
    @PostMapping("/update")
    public R<MemorialDate> updateDate(@RequestBody MemorialDate date, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(memorialDateService.updateDate(date, userId));
    }

    @ApiOperation("删除纪念日")
    @DeleteMapping("/{id}")
    public R<Void> deleteDate(@PathVariable Long id, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        memorialDateService.deleteDate(id, userId);
        return R.ok();
    }

    @ApiOperation("获取���念日列表")
    @GetMapping("/list")
    public R<List<MemorialDate>> getDateList(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(memorialDateService.getUserDates(userId));
    }

    @ApiOperation("获取生理期记录")
    @GetMapping("/periods")
    public R<List<MemorialDate>> getPeriods(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return R.ok(memorialDateService.getUserPeriods(userId));
    }

    @ApiOperation("获取即将到来的纪念日")
    @GetMapping("/upcoming")
    public R<List<MemorialDate>> getUpcomingDates() {
        Long userId = UserContext.getCurrentUserId();
        try {
            List<MemorialDate> dates = memorialDateService.getUpcomingDates(userId);
            return R.ok(dates);
        } catch (Exception e) {
            log.error("获取即将到来的纪念日失败", e);
            return R.error("获取即将到来的纪念日失败");
        }
    }
} 