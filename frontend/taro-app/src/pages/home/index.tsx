import { View, Text, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Home() {
  useLoad(() => {
    // 检查登录状态
    const userInfo = Taro.getStorageSync('userInfo')
    if (!userInfo) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }
    
    Taro.setNavigationBarTitle({
      title: '首页'
    })
  })

  const handleLogout = () => {
    Taro.removeStorageSync('userInfo')
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

  const userInfo = Taro.getStorageSync('userInfo')

  return (
    <View className='home'>
      <View className='welcome'>
        <Image className='avatar' src={userInfo?.avatarUrl} />
        <Text>欢迎回来！</Text>
        <Text className='username'>{userInfo?.nickName}</Text>
      </View>
      <View className='logout-btn' onClick={handleLogout}>
        退出登录
      </View>
    </View>
  )
} 