import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Home() {
  useLoad(() => {
    console.log('Home page loaded')
  })

  return (
    <View className='home-container'>
      <View className='content'>
        <Text className='title'>首页</Text>
        {/* 这里添加首页的主要内容 */}
      </View>
    </View>
  )
} 