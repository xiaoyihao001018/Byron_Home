import { View, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Login() {
  useLoad(() => {
    console.log('登录页面加载...')
    Taro.setNavigationBarTitle({
      title: '登录'
    })
  })

  const handleWechatLogin = () => {
    Taro.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功：', res)
        const { userInfo } = res
        
        // 保存用户信息
        Taro.setStorageSync('userInfo', userInfo)
        
        // 跳转到首页
        Taro.redirectTo({
          url: '/pages/home/index'
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败：', err)
        Taro.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className='login-container'>
      <View className='login-form'>
        <Button 
          className='wechat-login-btn'
          type='primary'
          onClick={handleWechatLogin}
        >
          微信一键登录
        </Button>
      </View>
    </View>
  )
} 