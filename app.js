//app.js
App({
  globalData: {
    version: "2.6.5 (190426)",
    credit: "感谢心知天气、中国天气网、百度地图提供数据。\n数据仅供参考",
    copyRight: "Copyright © 2019",
    darkMode: false,
    darkModeByTime: false,
    darkModeStartTime: "23:00",
    darkModeStopTime: "06:00"
  },
  onShow(options) {
    wx.getStorage({
      key: 'darkMode',
      success: (result) => {
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
  },

  switchDarkMode: function(that) {
    if (this.globalData.darkModeByTime) {
      let startTime = this.globalData.darkModeStartTime
      let stopTime = this.globalData.darkModeStopTime
      let hour = (new Date()).getHours()
      let min = (new Date()).getMinutes()
      let startTimeHour = startTime.substr(0, 2)
      let stopTimeHour = stopTime.substr(0, 2)
      let startTimeMin = startTime.substr(-2, 2)
      let stopTimeMin = stopTime.substr(-2, 2)
      if ((startTimeHour < hour) || (startTimeHour == hour && startTimeMin <= min)
        || ((hour == stopTimeHour && min < stopTimeMin) || (hour <= (stopTimeHour - 1)))) {
          this.switchDarkModeGo(true, that)
      } else {
        this.switchDarkModeGo(false, that)
      }
    } else {
      that.setData({
        darkMode: this.globalData.darkMode
      })
      this.switchTabBar(this.globalData.darkMode)
      this.switchNavigationBar(this.globalData.darkMode)
    }
  },

  switchDarkModeGo: function(status, that) {
    wx.setStorage({
      key: 'darkMode',
      data: status
    })
    this.globalData.darkMode = status
    this.switchNavigationBar(status)
    that.setData({
      darkMode: status
    })
  },

  // switchDarkModeByTimeFromMemory: function(that) {
  //   let startTime = this.globalData.darkModeStartTime
  //   let stopTime = this.globalData.darkModeStopTime
  //   let hour = (new Date()).getHours()
  //   let min = (new Date()).getMinutes()
  //   let startTimeHour = startTime.substr(0, 2)
  //   let stopTimeHour = stopTime.substr(0, 2)
  //   let startTimeMin = startTime.substr(-2, 2)
  //   let stopTimeMin = stopTime.substr(-2, 2)
  //   if ((startTimeHour <= hour && startTimeMin <= min) 
  //     || ((hour == stopTimeHour && min < stopTimeMin) || (hour <= (stopTimeHour - 1)))) {
  //       this.switchDarkModeGo(true, that)
  //   } else {
  //     this.switchDarkModeGo(false, that)
  //   }
  // }

})