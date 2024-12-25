export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/profile/index',
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
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tabbar/profile.png',
        selectedIconPath: './assets/tabbar/profile-active.png'
      }
    ]
  }
})
