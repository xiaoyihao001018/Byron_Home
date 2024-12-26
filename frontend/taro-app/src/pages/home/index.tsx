import { View, Text, Image } from '@tarojs/components'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import request from '../../utils/request'
import './index.scss'

interface Record {
  id: number
  imageUrl: string
  content: string
  createdAt: string
}

interface MemorialDate {
  id: number
  title: string
  date: string
  type: string
  repeatType: string
}

interface Todo {
  id: number
  title: string
  status: number
  priority: number
  dueDate: string
}

interface Summary {
  recentRecords: Record[]
  upcomingDates: MemorialDate[]
  todoStats: {
    total: number
    completed: number
    upcoming: number
  }
}

export default function Home() {
  const [summary, setSummary] = useState<Summary>({
    recentRecords: [],
    upcomingDates: [],
    todoStats: {
      total: 0,
      completed: 0,
      upcoming: 0
    }
  })

  // 页面首次加载时检查登录状态
  useLoad(() => {
    checkLoginStatus()
  })

  // 每次页面显示时刷新数据
  useDidShow(() => {
    loadSummary()
  })

  const checkLoginStatus = () => {
    // 检查登录状态
    const token = Taro.getStorageSync('token')
    const userInfo = Taro.getStorageSync('userInfo')
    
    if (!token || !userInfo) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
      return false
    }
    return true
  }

  const loadSummary = async () => {
    // 先检查登录状态
    if (!checkLoginStatus()) {
      return
    }

    try {
      // 加载最近记录
      const records = await request<Record[]>({
        url: '/api/record/recent',
        method: 'GET'
      })

      // 加载即将到来的纪念日
      const dates = await request<MemorialDate[]>({
        url: '/api/dates/upcoming',
        method: 'GET'
      })

      // 加载待办事项统计
      const todos = await request<Todo[]>({
        url: '/api/todo/list',
        method: 'GET'
      })

      console.log('加载数据:', {
        records,
        dates,
        todos
      })

      const todoStats = {
        total: todos.length,
        completed: todos.filter(todo => todo.status === 2).length,
        upcoming: todos.filter(todo => todo.status === 0 && new Date(todo.dueDate) > new Date()).length
      }

      setSummary({
        recentRecords: records || [],
        upcomingDates: dates || [],
        todoStats
      })
    } catch (error) {
      console.error('加载汇总数据失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  }

  const userInfo = Taro.getStorageSync('userInfo')

  const navigateToModule = (path: string) => {
    Taro.switchTab({
      url: path
    })
  }

  return (
    <View className='home-container'>
      <View className='header'>
        <View className='welcome'>
          <Text className='title'>欢迎回来</Text>
          <Text className='username'>{userInfo?.nickname || '用户'}</Text>
        </View>
      </View>

      <View className='summary-section'>
        <View className='section-title'>最近记录</View>
        <View className='records-list'>
          {summary.recentRecords.map(record => (
            <View key={record.id} className='record-item' onClick={() => navigateToModule('/pages/record/index')}>
              <Image 
                className='record-image' 
                src={`http://localhost:8080${record.imageUrl}`} 
                mode='aspectFill' 
              />
              <Text className='record-content'>{record.content}</Text>
              <Text className='record-date'>{record.createdAt.split('T')[0]}</Text>
            </View>
          ))}
          {summary.recentRecords.length === 0 && (
            <Text className='empty-text'>暂无记录</Text>
          )}
        </View>
      </View>

      <View className='summary-section'>
        <View className='section-title'>即将到来的纪念日</View>
        <View className='dates-list'>
          {summary.upcomingDates.map(date => (
            <View key={date.id} className='date-item' onClick={() => navigateToModule('/pages/dates/index')}>
              <Text className='date-title'>{date.title}</Text>
              <Text className='date-info'>{date.date}</Text>
              <Text className='date-type'>{date.type}</Text>
            </View>
          ))}
          {summary.upcomingDates.length === 0 && (
            <Text className='empty-text'>暂无纪念日</Text>
          )}
        </View>
      </View>

      <View className='summary-section'>
        <View className='section-title'>待办事项</View>
        <View className='todo-stats' onClick={() => navigateToModule('/pages/todo/index')}>
          <View className='stat-item'>
            <Text className='stat-value'>{summary.todoStats.total}</Text>
            <Text className='stat-label'>总计</Text>
          </View>
          <View className='stat-item'>
            <Text className='stat-value'>{summary.todoStats.completed}</Text>
            <Text className='stat-label'>已完成</Text>
          </View>
          <View className='stat-item'>
            <Text className='stat-value'>{summary.todoStats.upcoming}</Text>
            <Text className='stat-label'>待处理</Text>
          </View>
        </View>
      </View>
    </View>
  )
} 