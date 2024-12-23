import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('首页加载...')
    checkLoginStatus()
  })

  const checkLoginStatus = () => {
    try {
      const userInfo = Taro.getStorageSync('userInfo')
      console.log('检查登录状态:', userInfo ? '已登录' : '未登录')
      
      if (!userInfo) {
        console.log('未登录，跳转到登录页...')
        Taro.redirectTo({
          url: '/pages/standardized/index'
        })
      } else {
        console.log('已登录，用户信息:', userInfo)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      Taro.redirectTo({
        url: '/pages/standardized/index'
      })
    }
  }

  return (
    <View className='index'>
      <Text>首页内容</Text>
    </View>
  )
}
