import { View, Text, Button, Input, Picker } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import request from '../../utils/request'
import './index.scss'

interface Todo {
  id: number
  title: string
  description: string
  dueDate: string
  priority: number
  status: number
}

const priorityOptions = ['低', '中', '高']
const statusOptions = ['待完成', '进行中', '已完成']

const TODO_STATUS = {
  TODO: 0,
  IN_PROGRESS: 1,
  DONE: 2
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [todoPriority, setTodoPriority] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    loadTodos()
  })

  const loadTodos = async () => {
    try {
      const data = await request<Todo[]>({
        url: '/api/todo/list',
        method: 'GET'
      })
      setTodos(data)
    } catch (error) {
      console.error('加载待办事项失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  }

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Taro.showToast({
        title: '请输入待办事项标题',
        icon: 'none'
      })
      return
    }

    try {
      const formattedDueDate = dueDate ? `${dueDate}T23:59:59` : null

      const response = await request<Todo>({
        url: '/api/todo',
        method: 'POST',
        data: {
          title: title.trim(),
          description: description.trim(),
          priority: todoPriority,
          dueDate: formattedDueDate,
          status: 0
        }
      })

      Taro.showToast({
        title: '添加成功',
        icon: 'success'
      })
      setTitle('')
      setDescription('')
      setTodoPriority(0)
      setDueDate('')
      setShowAdd(false)
      loadTodos()
    } catch (error) {
      console.error('添加待办事项失败:', error)
      Taro.showToast({
        title: error.message || '添加失败',
        icon: 'none'
      })
    }
  }

  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      await request({
        url: `/api/todo/${id}/status/${status}`,
        method: 'PUT'
      })
      loadTodos()
    } catch (error) {
      console.error('更新状态失败:', error)
      Taro.showToast({
        title: '更新失败',
        icon: 'none'
      })
    }
  }

  const handleUpdatePriority = async (id: number, priority: number) => {
    try {
      await request({
        url: `/api/todo/${id}/priority/${priority}`,
        method: 'PUT'
      })
      loadTodos()
    } catch (error) {
      console.error('更新优先级失败:', error)
      Taro.showToast({
        title: '更新失败',
        icon: 'none'
      })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await Taro.showModal({
        title: '确认删除',
        content: '确定要删除这个待办事项吗？'
      })

      await request({
        url: `/api/todo/${id}`,
        method: 'DELETE'
      })
      
      Taro.showToast({
        title: '删除成功',
        icon: 'success'
      })
      
      loadTodos()
    } catch (error) {
      if (error.errMsg?.includes('cancel')) return
      
      console.error('删除失败:', error)
      Taro.showToast({
        title: '删除失败',
        icon: 'none'
      })
    }
  }

  return (
    <View className='todo-container'>
      <View className='header'>
        <Text className='title'>待办事项</Text>
        <Button 
          className='add-btn' 
          onClick={() => setShowAdd(true)}
        >
          添加待办
        </Button>
      </View>

      {showAdd && (
        <View className='add-modal'>
          <View className='add-content'>
            <View className='form-item'>
              <Text className='label'>标题</Text>
              <Input
                className='input'
                value={title}
                onInput={e => setTitle(e.detail.value)}
                placeholder='请输入标题'
              />
            </View>

            <View className='form-item'>
              <Text className='label'>描述</Text>
              <Input
                className='input'
                value={description}
                onInput={e => setDescription(e.detail.value)}
                placeholder='请输入描述'
              />
            </View>

            <View className='form-item'>
              <Text className='label'>优先级</Text>
              <Picker
                mode='selector'
                range={priorityOptions}
                value={todoPriority}
                onChange={e => setTodoPriority(Number(e.detail.value))}
              >
                <View className='picker'>
                  {priorityOptions[todoPriority]}
                </View>
              </Picker>
            </View>

            <View className='form-item'>
              <Text className='label'>截止日期</Text>
              <Picker
                mode='date'
                value={dueDate}
                onChange={e => setDueDate(e.detail.value)}
              >
                <View className='picker'>
                  {dueDate || '请选择日期'}
                </View>
              </Picker>
            </View>

            <View className='button-group'>
              <Button 
                className='cancel-btn' 
                onClick={() => {
                  setShowAdd(false)
                  setTitle('')
                  setDescription('')
                  setTodoPriority(0)
                  setDueDate('')
                }}
              >
                取消
              </Button>
              <Button 
                className='save-btn' 
                onClick={handleAddTodo}
                loading={loading}
              >
                保存
              </Button>
            </View>
          </View>
        </View>
      )}

      <View className='todo-list'>
        {todos.map(todo => (
          <View key={todo.id} className='todo-item'>
            <View className='todo-content'>
              <Text className='title'>{todo.title}</Text>
              {todo.description && (
                <Text className='description'>{todo.description}</Text>
              )}
              {todo.dueDate && (
                <Text className='due-date'>截止日期：{todo.dueDate}</Text>
              )}
              <View className='status-priority'>
                <Picker
                  mode='selector'
                  range={statusOptions}
                  value={todo.status}
                  onChange={e => handleUpdateStatus(todo.id, Number(e.detail.value))}
                >
                  <Text className={`status status-${todo.status}`}>
                    {statusOptions[todo.status]}
                  </Text>
                </Picker>
                <Picker
                  mode='selector'
                  range={priorityOptions}
                  value={todo.priority}
                  onChange={e => handleUpdatePriority(todo.id, Number(e.detail.value))}
                >
                  <Text className={`priority priority-${todo.priority}`}>
                    {priorityOptions[todo.priority]}
                  </Text>
                </Picker>
              </View>
            </View>
            
            <Button 
              className='delete-btn'
              onClick={() => handleDelete(todo.id)}
            >
              删除
            </Button>
          </View>
        ))}
        
        {todos.length === 0 && (
          <View className='empty'>暂无待办事项</View>
        )}
      </View>
    </View>
  )
} 