import Taro from '@tarojs/taro'

// 基础URL
const baseURL = 'http://localhost:8080'

// 响应数据接口
interface ResponseData<T = any> {
  code: number
  message: string
  data: T
}

// 请求拦截器
const request = <T = any>(options: Taro.request.Option): Promise<T> => {
  const { url, data: requestData, method = 'GET', header = {} } = options

  // 获取token
  const token = Taro.getStorageSync('token')
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${baseURL}${url}`,
      data: requestData,
      method,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success: (res) => {
        const { code, message, data: responseData } = res.data as ResponseData<T>
        if (code === 200) {
          resolve(responseData)
        } else if (code === 401 || res.statusCode === 401) {
          // token过期或无效
          Taro.clearStorageSync()
          // 判断当前是否在登录页
          const pages = Taro.getCurrentPages()
          const currentPage = pages[pages.length - 1]
          if (currentPage?.route !== 'pages/login/index') {
            Taro.redirectTo({
              url: '/pages/login/index'
            })
          }
          reject(new Error(message || '未授权或登录已过期'))
        } else {
          Taro.showToast({
            title: message || '请求失败',
            icon: 'none'
          })
          reject(new Error(message || '请求失败'))
        }
      },
      fail: (err) => {
        Taro.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default request 