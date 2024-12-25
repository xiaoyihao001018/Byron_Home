import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Profile() {
  useLoad(() => {
    console.log('Profile page loaded')
  })

  return (
    <View className='profile-container'>
      <View className='content'>
        <Text className='title'>我的</Text>
        {/* 这里添加个人页面的主要内容 */}
      </View>
    </View>
  )
} 