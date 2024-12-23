import { View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      console.log('=== 开始登录流程 ===')
      
      // 调用微信登录
      console.log('1. 调用Taro.login获取code...')
      const loginRes = await Taro.login()
      console.log('Taro.login结果:', JSON.stringify(loginRes, null, 2))
      
      if (loginRes.errMsg !== 'login:ok') {
        console.error('登录失败:', loginRes.errMsg)
        Taro.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
        return
      }

      // 发送登录请求到后端
      console.log('2. 发送登录请求到后端...')
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
      
      console.log('3. 收到后端响应:')
      console.log('完整响应:', JSON.stringify(res, null, 2))

      // 检查响应状态
      if (res.statusCode !== 200) {
        console.error('HTTP请求失败:', res.statusCode)
        Taro.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
        return
      }

      if (!res.data || res.data.code !== 200) {
        console.error('业务请求失败:', res.data)
        Taro.showToast({
          title: res.data?.message || '登录失败，请重试',
          icon: 'none'
        })
        return
      }

      // 登录成功
      console.log('4. 处理登录结果...')
      
      // 存储用户信息
      const userInfo = res.data.data
      console.log('用户信息:', JSON.stringify(userInfo, null, 2))
      Taro.setStorageSync('userInfo', userInfo)
      
      // 显示成功提示
      console.log('5. 显示成功提示...')
      await Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })

      // 等待提示显示完成后再跳转
      console.log('6. 等待1.5秒...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 跳转到首页
      console.log('7. 跳转到首页...')
      try {
        await Taro.redirectTo({
          url: '/pages/index/index'
        })
        console.log('跳转成功')
      } catch (error) {
        console.error('跳转失败:', error)
        Taro.showToast({
          title: '跳转失败，请重试',
          icon: 'none',
          duration: 2000
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
      console.log('=== 登录流程结束 ===')
    }
  }

  return (
    <View className='login-container'>
      <Button 
        className='login-button'
        loading={loading}
        onClick={handleLogin}
        type='primary'
      >
        微信一键登录
      </Button>
    </View>
  )
} 