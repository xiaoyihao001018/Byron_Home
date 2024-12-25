import { View, Text, Button, Picker, Input } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import request from '../../utils/request'
import './index.scss'

interface MemorialDate {
  id: number
  userId: number
  title: string
  type: 'MEMORIAL' | 'COUNTDOWN' | 'PERIOD'
  date: string
  repeatType: 'NONE' | 'YEARLY' | 'MONTHLY'
  remindDays?: number
  color?: string
  icon?: string
  remark?: string
  daysLeft: number
  dateStr?: string
}

const typeOptions = [
  { label: '纪念日', value: 'MEMORIAL' },
  { label: '倒数日', value: 'COUNTDOWN' },
  { label: '生理期', value: 'PERIOD' }
]

const repeatOptions = [
  { label: '不重复', value: 'NONE' },
  { label: '每年', value: 'YEARLY' },
  { label: '每月', value: 'MONTHLY' }
]

export default function Dates() {
  const [dates, setDates] = useState<MemorialDate[]>([])
  const [periods, setPeriods] = useState<MemorialDate[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<Partial<MemorialDate>>({
    type: 'MEMORIAL',
    repeatType: 'NONE'
  })

  useLoad(() => {
    loadDates()
    loadPeriods()
  })

  // 加载纪念日列表
  const loadDates = async () => {
    try {
      const data = await request<MemorialDate[]>({
        url: '/api/dates/list',
        method: 'GET'
      })
      setDates(data)
    } catch (error) {
      console.error('加载纪念日失败:', error)
    }
  }

  // 加载生理期记录
  const loadPeriods = async () => {
    try {
      const data = await request<MemorialDate[]>({
        url: '/api/dates/periods',
        method: 'GET'
      })
      setPeriods(data)
    } catch (error) {
      console.error('加载生理期记录失败:', error)
    }
  }

  // 保存记录
  const handleSave = async () => {
    if (!form.title || !form.date) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    try {
      setLoading(true)
      await request({
        url: '/api/dates/create',
        method: 'POST',
        data: form
      })

      // 重新加载数据
      if (form.type === 'PERIOD') {
        loadPeriods()
      } else {
        loadDates()
      }

      // 清理表单
      setShowAdd(false)
      setForm({
        type: 'MEMORIAL',
        repeatType: 'NONE'
      })

      Taro.showToast({
        title: '添加成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('添加失败:', error)
      Taro.showToast({
        title: '添加失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  // 删除记录
  const handleDelete = async (id: number) => {
    try {
      await request({
        url: `/api/dates/${id}`,
        method: 'DELETE'
      })

      // 重新加载数据
      loadDates()
      loadPeriods()

      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('删除失败:', error)
      Taro.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  }

  return (
    <View className='dates-container'>
      <View className='header'>
        <Text className='title'>纪念日</Text>
        <Button 
          className='add-btn' 
          onClick={() => setShowAdd(true)}
        >
          添加记录
        </Button>
      </View>

      {showAdd && (
        <View className='add-modal'>
          <View className='add-content'>
            <View className='form-item'>
              <Text className='label'>类型</Text>
              <Picker
                mode='selector'
                range={typeOptions}
                rangeKey='label'
                value={typeOptions.findIndex(t => t.value === form.type)}
                onChange={e => {
                  const type = typeOptions[e.detail.value].value
                  setForm({
                    ...form,
                    type: type as MemorialDate['type']
                  })
                }}
              >
                <View className='picker'>
                  {typeOptions.find(t => t.value === form.type)?.label}
                </View>
              </Picker>
            </View>

            <View className='form-item'>
              <Text className='label'>标题</Text>
              <Input
                className='input'
                value={form.title}
                onInput={e => setForm({ ...form, title: e.detail.value })}
                placeholder='请输入标题'
              />
            </View>

            <View className='form-item'>
              <Text className='label'>日期</Text>
              <Picker
                mode='date'
                value={form.date || ''}
                onChange={e => setForm({ ...form, date: e.detail.value })}
              >
                <View className='picker'>
                  {form.date || '请选择日期'}
                </View>
              </Picker>
            </View>

            {form.type !== 'PERIOD' && (
              <View className='form-item'>
                <Text className='label'>重复</Text>
                <Picker
                  mode='selector'
                  range={repeatOptions}
                  rangeKey='label'
                  value={repeatOptions.findIndex(t => t.value === form.repeatType)}
                  onChange={e => {
                    const type = repeatOptions[e.detail.value].value
                    setForm({
                      ...form,
                      repeatType: type as MemorialDate['repeatType']
                    })
                  }}
                >
                  <View className='picker'>
                    {repeatOptions.find(t => t.value === form.repeatType)?.label}
                  </View>
                </Picker>
              </View>
            )}

            <View className='form-item'>
              <Text className='label'>备注</Text>
              <Input
                className='input'
                value={form.remark}
                onInput={e => setForm({ ...form, remark: e.detail.value })}
                placeholder='请输入备注'
              />
            </View>

            <View className='button-group'>
              <Button 
                className='cancel-btn' 
                onClick={() => {
                  setShowAdd(false)
                  setForm({
                    type: 'MEMORIAL',
                    repeatType: 'NONE'
                  })
                }}
              >
                取消
              </Button>
              <Button 
                className='save-btn' 
                onClick={handleSave}
                loading={loading}
              >
                保存
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className='date-list'>
        {dates.map(date => (
          <View key={date.id} className='date-item'>
            <View className='date-info'>
              <Text className='title'>{date.title}</Text>
              <Text className='date'>{date.dateStr}</Text>
              {date.remark && (
                <Text className='remark'>{date.remark}</Text>
              )}
            </View>
            <View className='days-left'>
              <Text className='number'>{Math.abs(date.daysLeft || 0)}</Text>
              <Text className='text'>
                {date.daysLeft === 0 ? '就是今天' :
                 date.daysLeft > 0 ? '天后' : '天前'}
              </Text>
            </View>
            <Button 
              className='delete-btn'
              onClick={() => handleDelete(date.id)}
            >
              删除
            </Button>
          </View>
        ))}
      </View>

      {periods.length > 0 && (
        <View className='period-section'>
          <Text className='section-title'>生理期记录</Text>
          <View className='period-list'>
            {periods.map(period => (
              <View key={period.id} className='period-item'>
                <Text className='date'>{period.dateStr}</Text>
                {period.remark && (
                  <Text className='remark'>{period.remark}</Text>
                )}
                <Button 
                  className='delete-btn'
                  onClick={() => handleDelete(period.id)}
                >
                  删除
                </Button>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
} 