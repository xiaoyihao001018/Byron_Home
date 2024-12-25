import { View, Text, Image, Button, Textarea } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import request, { baseURL } from '../../utils/request'
import './index.scss'

interface Record {
  id: number
  userId: number
  imageUrl: string
  content: string
  location?: string
  createdAt: string
  updatedAt: string
}

export default function Record() {
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(false)
  const [showInput, setShowInput] = useState(false)
  const [content, setContent] = useState('')
  const [tempImage, setTempImage] = useState<{
    path: string
    location?: { latitude: number; longitude: number }
  } | null>(null)

  useLoad(() => {
    loadRecords()
  })

  // 加载记录列表
  const loadRecords = async () => {
    try {
      const data = await request<Record[]>({
        url: '/api/record/list',
        method: 'GET'
      })
      setRecords(data)
    } catch (error) {
      console.error('加载记录失败:', error)
    }
  }

  // 选择图片
  const handleChooseImage = async () => {
    try {
      // 选择图片
      const res = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      // 获取位置信息
      const location = await Taro.getLocation({
        type: 'gcj02'
      }).catch(() => null)

      setTempImage({
        path: res.tempFilePaths[0],
        location: location ? { 
          latitude: location.latitude, 
          longitude: location.longitude 
        } : undefined
      })
      setShowInput(true)
    } catch (error) {
      console.error('选择图片失败:', error)
      Taro.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    }
  }

  // 保存记录
  const handleSave = async () => {
    if (!tempImage) return

    try {
      setLoading(true)
      // 上传图片
      const uploadRes = await Taro.uploadFile({
        url: baseURL + '/api/record/upload',
        filePath: tempImage.path,
        name: 'file',
        header: {
          'Authorization': `Bearer ${Taro.getStorageSync('token')}`
        }
      })

      // 解析上传响应
      const uploadData = JSON.parse(uploadRes.data)
      if (uploadData.code !== 200) {
        throw new Error(uploadData.message || '上传图片失败')
      }
      const imageUrl = uploadData.data

      // 创建记录
      await request({
        url: '/api/record/create',
        method: 'POST',
        data: {
          imageUrl,
          content: content || '美好的一刻',
          location: tempImage.location 
            ? `${tempImage.location.latitude},${tempImage.location.longitude}` 
            : undefined
        }
      })

      // 重新加载记录列表
      loadRecords()
      // 清理临时状态
      setShowInput(false)
      setContent('')
      setTempImage(null)
      
      Taro.showToast({
        title: '添加成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('添加记录失败:', error)
      Taro.showToast({
        title: error.message || '添加失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='record-container'>
      <View className='header'>
        <Text className='title'>生活记录</Text>
        <Button 
          className='add-btn' 
          onClick={handleChooseImage}
          loading={loading}
        >
          记录此刻
        </Button>
      </View>

      {showInput && tempImage && (
        <View className='input-modal'>
          <View className='input-content'>
            <Image 
              className='preview-image' 
              src={tempImage.path} 
              mode='aspectFill' 
            />
            <Textarea
              className='content-input'
              value={content}
              onInput={e => setContent(e.detail.value)}
              placeholder='记录这一刻的想法...'
              maxlength={200}
            />
            <View className='button-group'>
              <Button 
                className='cancel-btn' 
                onClick={() => {
                  setShowInput(false)
                  setContent('')
                  setTempImage(null)
                }}
              >
                取消
              </Button>
              <Button 
                className='save-btn' 
                onClick={handleSave}
                loading={loading}
              >
                保存
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className='record-list'>
        {records.map(record => (
          <View key={record.id} className='record-item'>
            <Image 
              className='record-image' 
              src={baseURL + record.imageUrl} 
              mode='aspectFill'
              onClick={() => {
                Taro.previewImage({
                  urls: [baseURL + record.imageUrl]
                })
              }}
            />
            <View className='record-info'>
              <Text className='record-content'>{record.content || '美好的一刻'}</Text>
              <Text className='record-time'>{record.createdAt}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
} 