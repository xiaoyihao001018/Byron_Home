import { PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import request from './utils/request'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  Taro.useLaunch(() => {
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    const userInfo = Taro.getStorageSync('userInfo')
    
    if (!token || !userInfo) {
      // 如果没有登录信息，跳转到登录页
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    } else {
      // 有登录信息，验证 token 有效性
      checkToken()
    }
  })

  // 验证 token 有效性
  const checkToken = async () => {
    try {
      await request({
        url: '/api/user/check-token',
        method: 'GET'
      })
      // token 有效，跳转到首页
      Taro.switchTab({
        url: '/pages/home/index'
      })
    } catch (error) {
      console.error('token验证失败:', error)
      // token 无效，清除登录信息并跳转到登录页
      Taro.clearStorageSync()
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  }

  // children 是将要会渲染的页面
  return children
}

export default App
