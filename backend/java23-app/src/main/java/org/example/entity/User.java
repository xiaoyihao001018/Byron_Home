package org.example.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user")
@ApiModel("用户信息")
public class User {
    
    @ApiModelProperty("用户ID")
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @ApiModelProperty("微信openid")
    private String openid;
    
    @ApiModelProperty("昵称")
    private String nickname;
    
    @ApiModelProperty("头像URL")
    private String avatarUrl;
    
    @ApiModelProperty("性别 0-未知 1-男 2-女")
    private Integer gender;
    
    @ApiModelProperty("手机号")
    private String phone;
    
    @ApiModelProperty("状态 0-禁用 1-正常")
    private Integer status;
    
    @ApiModelProperty("微信sessionKey")
    private String sessionKey;
    
    @ApiModelProperty("国家")
    private String country;
    
    @ApiModelProperty("省份")
    private String province;
    
    @ApiModelProperty("城市")
    private String city;
    
    @ApiModelProperty("创建时间")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @ApiModelProperty("更新时间")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
} 