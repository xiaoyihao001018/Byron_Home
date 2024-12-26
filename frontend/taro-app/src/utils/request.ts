import Taro from '@tarojs/taro'

// 根据环境配置基础URL
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8080'
  : 'https://api.your-domain.com' // 这里替换为实际的生产环境API地址

interface ApiResponse<T> {
  code: number
  data: T
  message?: string
}

const MAX_RETRY_COUNT = 3
const RETRY_DELAY = 1000 // 1秒

// 处理导航到登录页面
const navigateToLogin = () => {
  console.log('准备导航到登录页面')
  // 先尝试使用 redirectTo
  Taro.redirectTo({
    url: '/pages/login/index',
    fail: (err) => {
      console.error('redirectTo失败:', err)
      // 如果redirectTo失败，尝试使用navigateTo
      Taro.navigateTo({
        url: '/pages/login/index',
        fail: (err2) => {
          console.error('navigateTo失败:', err2)
          // 如果navigateTo也失败，使用reLaunch作为最后的方案
          Taro.reLaunch({
            url: '/pages/login/index'
          }).catch(e => {
            console.error('所有导航方法都失败:', e)
            // 显示错误提示
            Taro.showToast({
              title: '无法跳转到登录页面',
              icon: 'none',
              duration: 2000
            })
          })
        }
      })
    }
  })
}

// 解析响应数据
const parseResponseData = (data: any): any => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch (e) {
      console.error('JSON解析失败:', e)
      return data
    }
  }
  return data
}

export default function request<T>({
  url,
  method = 'GET',
  data: requestData,
  header = {},
  retryCount = 0
}: {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
  retryCount?: number
}): Promise<T> {
  const token = Taro.getStorageSync('token')
  console.log('发起请求:', {
    url: `${BASE_URL}${url}`,
    method,
    data: requestData,
    token: token ? '已设置' : '未设置'
  })
  
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data: requestData,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success: (res) => {
        const { statusCode } = res
        // 解析响应数据
        const data = parseResponseData(res.data)
        
        console.log('收到响应:', {
          statusCode,
          data: typeof data === 'object' ? JSON.stringify(data, null, 2) : data
        })
        
        if (statusCode === 401) {
          console.log('响应状态码401，需要重新登录')
          // 未授权，先清除本地token
          Taro.removeStorageSync('token')
          
          // 显示提示
          Taro.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          })
          
          // 延迟跳转，让用户看到提示
          setTimeout(() => {
            navigateToLogin()
          }, 1500)
          
          reject(new Error('登录已过期，请重新登录'))
          return
        }
        
        if (statusCode !== 200) {
          const errorMsg = `请求失败: ${statusCode}`
          console.log('响应状态码非200:', {
            statusCode,
            errorMsg
          })
          
          // 如果是网络错误且未超过重试次数，则重试
          if ((statusCode === 502 || statusCode === 503 || statusCode === 504) && retryCount < MAX_RETRY_COUNT) {
            console.log(`请求失败，${retryCount + 1}秒后重试...`)
            setTimeout(() => {
              request<T>({
                url,
                method,
                data: requestData,
                header,
                retryCount: retryCount + 1
              }).then(resolve).catch(reject)
            }, RETRY_DELAY)
            return
          }
          
          // 显示错误提示
          Taro.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          })
          
          reject(new Error(errorMsg))
          return
        }
        
        try {
          console.log('开始处理响应数据:', {
            dataType: typeof data,
            isNull: data === null,
            hasCode: typeof data === 'object' && data !== null && 'code' in data
          })

          // 检查响应数据的结构
          if (typeof data === 'object' && data !== null) {
            // 检查是否是后端的标准响应格式
            if ('code' in data) {
              console.log('检测到标准响应格式:', {
                code: data.code,
                message: data.message,
                hasData: 'data' in data
              })

              if (data.code === 200) {
                // 成功响应，直接返回data字段
                console.log('成功响应，返回数据:', data.data)
                resolve(data.data)
              } else {
                const errorMsg = data.message || '请求失败'
                console.log('响应code非200:', {
                  code: data.code,
                  errorMsg
                })
                Taro.showToast({
                  title: errorMsg,
                  icon: 'none',
                  duration: 2000
                })
                reject(new Error(errorMsg))
              }
            } else {
              // 不是标准响应格式，直接返回数据
              console.log('非标准响应格式，直接返回数据')
              resolve(data as T)
            }
          } else {
            // 如果data不是对象，直接返回
            console.log('响应数据不是对象，直接返回')
            resolve(data as T)
          }
        } catch (error) {
          console.error('响应数据处理错误:', error)
          reject(new Error('响应数据处理失败'))
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        // 如果是网络错误且未超过重试次数，则重试
        if (retryCount < MAX_RETRY_COUNT) {
          console.log(`请求失败，${retryCount + 1}秒后重试...`)
          setTimeout(() => {
            request<T>({
              url,
              method,
              data: requestData,
              header,
              retryCount: retryCount + 1
            }).then(resolve).catch(reject)
          }, RETRY_DELAY)
          return
        }
        
        // 显示错误提示
        Taro.showToast({
          title: err.errMsg || '网络请求失败',
          icon: 'none',
          duration: 2000
        })
        
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
} 