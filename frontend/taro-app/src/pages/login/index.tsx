import { View, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import request from '../../utils/request'
import './index.scss'

interface LoginResponse {
  token: string
  userInfo: {
    id: number
    openid: string
    nickname?: string
    avatarUrl?: string
    gender?: number
    phone?: string
    status: number
    country?: string
    province?: string
    city?: string
  }
}

export default function Login() {
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    console.log('Login page loaded')
  })

  const handleLogin = async () => {
    try {
      setLoading(true)
      // 获取微信登录凭证
      const { code } = await Taro.login()
      
      // 调用后端登录接口
      const res = await request<LoginResponse>({
        url: '/api/user/wx-login',
        method: 'POST',
        data: { code }
      })

      console.log('登录响应:', res)

      // 保存token和用户信息
      Taro.setStorageSync('token', res.token)
      Taro.setStorageSync('userInfo', res.userInfo)

      // 跳转到首页
      Taro.switchTab({
        url: '/pages/home/index'
      })
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: '登录失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='login-container'>
      <View className='bg-image' />
      <Button
        className='login-btn'
        loading={loading}
        onClick={handleLogin}
      >
        微信一键登录
      </Button>
    </View>
  )
} 