import { View, Text, Button, Image } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Profile() {
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

  const handleLogout = () => {
    // 清除登录信息
    Taro.clearStorageSync()
    // 跳转到登录页
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

  return (
    <View className='profile-container'>
      <View className='user-info'>
        <Image className='avatar' src={userInfo?.avatarUrl || ''} />
        <Text className='nickname'>{userInfo?.nickName || '用户'}</Text>
      </View>
      
      <View className='action-list'>
        {/* 这里可以添加其他个人中心功能按钮 */}
      </View>

      <Button className='logout-btn' onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  )
} 