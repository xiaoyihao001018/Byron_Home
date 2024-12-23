import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      console.log('开始登录流程...')
      
      // 调用微信登录
      console.log('调用Taro.login获取code...')
      const loginRes = await Taro.login()
      console.log('Taro.login结果:', loginRes)
      
      if (loginRes.errMsg !== 'login:ok') {
        Taro.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
        return
      }

      // 发送登录请求到后端
      console.log('准备发送登录请求...')
      const url = 'http://localhost:8080/api/user/wx/login'
      console.log('请求URL:', url)
      console.log('请求参数:', { code: loginRes.code })
      
      const res = await Taro.request({
        url,
        method: 'GET',
        data: {
          code: loginRes.code
        }
      })
      
      console.log('登录请求响应:', res)

      if (res.statusCode === 200 && res.data.code === 200) {
        // 登录成功
        console.log('登录成功，准备跳转...')
        
        // 存储用户信息
        Taro.setStorageSync('userInfo', res.data.data)
        
        // 跳转到首页
        Taro.switchTab({
          url: '/pages/index/index',
          success: () => {
            console.log('跳转成功')
            Taro.showToast({
              title: '登录成功',
              icon: 'success'
            })
          },
          fail: (err) => {
            console.error('跳转失败:', err)
            Taro.showToast({
              title: '跳转失败',
              icon: 'none'
            })
          }
        })
      } else {
        // 登录失败
        console.log('登录失败，业务错误:', res.data)
        Taro.showToast({
          title: res.data.message || '登录失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('登录过程发生错误:', error)
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      setLoading(false)
      console.log('登录流程结束')
    }
  }

  return (
    <View className='login-container'>
      <Button 
        className='login-button'
        loading={loading}
        onClick={handleLogin}
      >
        微信一键登录
      </Button>
    </View>
  )
} 