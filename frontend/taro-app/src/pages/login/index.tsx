import { View, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import request from '../../utils/request'
import './index.scss'

export default function Login() {
  useLoad(() => {
    console.log('Login page loaded')
  })

  const handleLogin = async () => {
    try {
      // 获取用户信息
      const userProfile = await Taro.getUserProfile({
        desc: '用于完善会员资料'
      })

      // 获取微信登录凭证
      const { code } = await Taro.login()
      console.log('微信登录凭证:', code)
      
      // 调用后端登录接口
      const res = await request<{
        token: string
        user: {
          id: number
          openid: string
          nickName?: string
          avatarUrl?: string
        }
      }>({
        url: '/api/user/wx-login',
        method: 'POST',
        data: { code }
      })

      console.log('登录响应:', res)
      console.log('Token:', res.token)

      // 保存token和用户信息
      Taro.setStorageSync('token', res.token)
      
      // 更新用户信息
      const updatedUser = await request<{
        id: number
        openid: string
        nickName?: string
        avatarUrl?: string
      }>({
        url: '/api/user/update',
        method: 'POST',
        data: {
          id: res.user.id,
          nickName: userProfile.userInfo.nickName,
          avatarUrl: userProfile.userInfo.avatarUrl,
        }
      })

      console.log('更新后的用户信息:', updatedUser)

      // 更新本地存储的用户信息
      Taro.setStorageSync('userInfo', updatedUser)

      // 登录成功，跳转到首页
      Taro.switchTab({
        url: '/pages/home/index'
      })
    } catch (error) {
      console.error('登录失败:', error)
      // 如果是用户取消，不显示错误提示
      if (error.errMsg && error.errMsg.includes('getUserProfile:fail cancel')) {
        return
      }
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    }
  }

  return (
    <View className='login'>
      <Button className='login-btn' onClick={handleLogin}>
        微信一键登录
      </Button>
    </View>
  )
} 