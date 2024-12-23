import { View, Text, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      console.log('开始登录流程...')
      
      // 调用 Taro.login 获取 code
      console.log('调用Taro.login获取code...')
      const loginResult = await Taro.login()
      console.log('Taro.login结果:', loginResult)
      
      if (loginResult.code) {
        console.log('准备发送登录请求...')
        const url = 'http://localhost:8080/api/user/wx/login'
        console.log('请求URL:', url)
        console.log('请求参数:', { code: loginResult.code })
        
        const response = await Taro.request({
          url,
          method: 'GET',
          data: { code: loginResult.code },
          header: {
            'content-type': 'application/json'
          }
        })
        
        console.log('登录请求响应:', response)
        
        if (response.statusCode === 200) {
          if (response.data && response.data.code === 0) {
            console.log('登录成功:', response.data)
            Taro.showToast({
              title: '登录成功',
              icon: 'success'
            })
            
            // 存储用户信息
            Taro.setStorageSync('userInfo', response.data.data)
            
            // 跳转到首页
            setTimeout(() => {
              Taro.switchTab({
                url: '/pages/index/index'
              })
            }, 1500)
          } else {
            console.log('登录失败，业务错误:', response.data)
            Taro.showToast({
              title: response.data?.message || '登录失败',
              icon: 'error'
            })
          }
        } else {
          console.log('登录失败，HTTP错误:', response.statusCode)
          Taro.showToast({
            title: `服务器错误 ${response.statusCode}`,
            icon: 'error'
          })
        }
      } else {
        console.log('获取code失败:', loginResult)
        Taro.showToast({
          title: loginResult.errMsg || '获取授权失败',
          icon: 'error'
        })
      }
    } catch (error) {
      console.error('登录过程发生错误:', error)
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
      console.log('登录流程结束')
    }
  }

  return (
    <View className='login-container'>
      <View className='login-box'>
        <View className='login-title'>
          <Text className='title'>欢迎登录</Text>
          <Text className='subtitle'>请使用微信账号登录</Text>
        </View>
        <Button 
          className='login-button'
          openType='getUserInfo'
          onClick={handleLogin}
          loading={loading}
          disabled={loading}
        >
          {loading ? '登录中...' : '微信一键登录'}
        </Button>
      </View>
    </View>
  )
} 