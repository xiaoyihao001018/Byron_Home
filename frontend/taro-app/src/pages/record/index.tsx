import { View, Text, Image, Button } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import request from '../../utils/request'
import './index.scss'

interface Record {
  id: number
  imageUrl: string
  content: string
  createdAt: string
}

export default function Record() {
  const [records, setRecords] = useState<Record[]>([])

  // 页面首次加载时检查登录状态
  useLoad(() => {
    checkLoginStatus()
  })

  // 每次页面显示时刷新数据
  useDidShow(() => {
    loadRecords()
  })

  const checkLoginStatus = () => {
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    const userInfo = Taro.getStorageSync('userInfo')
    
    if (!token || !userInfo) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
      return false
    }
    return true
  }

  const loadRecords = async () => {
    // 先检查登录状态
    if (!checkLoginStatus()) {
      return
    }

    try {
      const res = await request<Record[]>({
        url: '/api/record/list',
        method: 'GET'
      })
      console.log('加载记录:', res)
      setRecords(res || [])
    } catch (error) {
      console.error('加载记录失败:', error)
      Taro.showToast({
        title: '加载记录失败',
        icon: 'error'
      })
    }
  }

  const handleAddRecord = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0]
        
        try {
          // 上传图片
          const uploadRes = await Taro.uploadFile({
            url: 'http://localhost:8080/api/record/upload',
            filePath: tempFilePath,
            name: 'file',
            header: {
              'Authorization': `Bearer ${Taro.getStorageSync('token')}`
            }
          })
          
          const uploadData = JSON.parse(uploadRes.data)
          console.log('上传响应:', uploadData)
          
          if (uploadData.code !== 200) {
            throw new Error(uploadData.message || '上传失败')
          }
          
          const imageUrl = uploadData.data
          
          // 创建记录
          await request({
            url: '/api/record/create',
            method: 'POST',
            data: {
              imageUrl,
              content: '新的记录'
            }
          })
          
          // 重新加载记录列表
          loadRecords()
          
          Taro.showToast({
            title: '添加成功',
            icon: 'success'
          })
        } catch (error) {
          console.error('添加记录失败:', error)
          Taro.showToast({
            title: '添加记录失败',
            icon: 'error'
          })
        }
      }
    })
  }

  return (
    <View className='record-container'>
      <View className='records-list'>
        {records.map(record => (
          <View key={record.id} className='record-item'>
            <Image 
              className='record-image' 
              src={`http://localhost:8080${record.imageUrl}`} 
              mode='aspectFill' 
            />
            <Text className='record-content'>{record.content}</Text>
            <Text className='record-date'>{record.createdAt.split('T')[0]}</Text>
          </View>
        ))}
        {records.length === 0 && (
          <Text className='empty-text'>暂无记录</Text>
        )}
      </View>
      
      <Button className='add-button' onClick={handleAddRecord}>
        添加记录
      </Button>
    </View>
  )
} 