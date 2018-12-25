//app.js
App({
  globalData: {
    version: "2.5.1 (181225)",
    credit: "感谢心知天气、中国天气网、百度地图提供数据。\n数据仅供参考",
    copyRight: "Copyright © 2018",
    darkMode: false
  },
  onShow(options) {
    wx.getStorage({
      key: 'darkMode',
      success: (result)=>{
        console.log(result)
        if (result.data === true) {
          this.globalData.darkMode = result.data
        }
        this.switchNavigationBar(result.data)
      }
    });
  },

  switchNavigationBar: function(data) {
    if (data) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000'
      })
      // wx.setBackgroundColor({
      //   backgroundColor: '#6A5ACD',
      // })
    } else {
      wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#6A5ACD'
        })
    }
  },
  
  switchTabBar: function(data) {
    if (data) {
      // 调整tabBar颜色
      wx.setTabBarStyle({
        color: '#A9A9A9',
        selectedColor: '#FFFFFF',
        backgroundColor: '#696969'
      })
    } else {
      wx.setTabBarStyle({
        color: '#999999',
        selectedColor: '#000000',
        backgroundColor: '#FFFFFF'
      })
    }
  }

})