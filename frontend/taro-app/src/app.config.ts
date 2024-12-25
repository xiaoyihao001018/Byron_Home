export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/record/index',
    'pages/dates/index',
    'pages/profile/index',
    'pages/login/index',
    'pages/todo/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Byron Home',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: false,
    color: '#999999',
    selectedColor: '#1296db',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/tabbar/home.png',
        selectedIconPath: './assets/tabbar/home-active.png'
      },
      {
        pagePath: 'pages/record/index',
        text: '记录',
        iconPath: './assets/tabbar/record.png',
        selectedIconPath: './assets/tabbar/record-active.png'
      },
      {
        pagePath: 'pages/dates/index',
        text: '纪念日',
        iconPath: './assets/tabbar/date.png',
        selectedIconPath: './assets/tabbar/date-active.png'
      },
      {
        pagePath: 'pages/todo/index',
        text: '待办',
        iconPath: './assets/tabbar/todo.png',
        selectedIconPath: './assets/tabbar/todo-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/profile.png',
        selectedIconPath: './assets/tabbar/profile-active.png'
      }
    ]
  }
})
