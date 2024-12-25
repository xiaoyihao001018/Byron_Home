import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Home() {
  useLoad(() => {
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    const userInfo = Taro.getStorageSync('userInfo')
    
    if (!token || !userInfo) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
  })

  const userInfo = Taro.getStorageSync('userInfo')

  return (
    <View className='home-container'>
      <View className='content'>
        <View className='welcome'>
          <Text className='title'>欢迎回来</Text>
          <Text className='username'>{userInfo?.nickName || '用户'}</Text>
        </View>
      </View>
    </View>
  )
} 