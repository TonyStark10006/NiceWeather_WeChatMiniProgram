// pages/settings.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1 : false,
    switch2 : false,
    time1: "14:00",
    time2: "6:00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'darkMode',
      success: (result)=>{
        console.log(result)
        if (result.data || app.globalData.darkModeByTime) {
          that.setData({
            switch1 : true
            //darkMode: result.data
          })
          //app.switchNavigationBar(true)
        }
      }
    })
    // wx.getStorage({
    //   key: 'darkModeByTime',
    //   success: (result)=>{
        
    //   }
    // })
    app.switchDarkMode(this)
    if (app.globalData.darkModeByTime) {
      if (app.globalData.darkModeStartTime) {
        that.setData({
          switch2 : true,
          time1: app.globalData.darkModeStartTime,
          time2: app.globalData.darkModeStopTime
        })
      } else {
        that.setData({
          switch2 : true,
          time1: this.data.time1,
          time2: this.data.time2
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // onChange: function(event) {
  //   console.log(event)
  //   app.globalData.darkMode = event.detail.value
  //   console.log("黑暗模式的全局变量值为" + app.globalData.darkMode)
  //   this.setData({
  //       'switch1' : event.detail.value
  //   })
  // },

  switch2Change(e) {
    app.globalData.darkMode = e.detail.value
    this.setData({
      'switch1' : e.detail.value,
      'switch2' : !e.detail.value,
      'darkMode' : e.detail.value
    })

    // 改变导航栏背景颜色
    this.switchNavigationBar(app.globalData.darkMode)
    // 本地保存模式状态
    if (e.detail.value) {
      wx.setStorage({
        key: 'darkMode',
        data: e.detail.value
      })
    } else {
      app.globalData.darkModeByTime = e.detail.value
      wx.setStorage({
        key: 'darkMode',
        data: e.detail.value
      })
      wx.setStorage({
        key: 'darkModeByTime',
        data: e.detail.value
      })
    }
    // 调整tabBar颜色
    // wx.setTabBarStyle({
    //   color: '#0000FF',
    //   selectedColor: '#999999',
    //   backgroundColor: '#000000'
    // })

  },

  switch3Change: function(e) {
    // app.globalData.darkMode = e.detail.value
    this.setData({
        'switch2' : e.detail.value
    })
    app.globalData.darkModeByTime = e.detail.value
    wx.setStorage({
      key: 'darkModeByTime',
      data: e.detail.value
    });
    if (e.detail.value) {
      if (app.globalData.darkModeStartTime) {
        this.setData({
          time1: app.globalData.darkModeStartTime,
          time2: app.globalData.darkModeStopTime
        })
        this.saveDarkModeTimeRange(app.globalData.darkModeStartTime, app.globalData.darkModeStopTime, this)
      } else {
        this.saveDarkModeTimeRange(this.data.time1, this.data.time2, this)
      }
    } else {
      app.globalData.darkMode = true
      this.setData({
        'darkMode': true
      })
      wx.setStorage({
        key: 'darkMode',
        data: true
      })
      app.switchNavigationBar(true)
    }
  },

  bindTime1Change: function (e) {
    wx.setStorage({
      key: 'darkModeStartTime',
      data: e.detail.value,
      fail: (result) => {
        console.log("保存开始时间失败:" + result)
      }
    })
    this.setData({
        time1: e.detail.value
    })
    this.saveDarkModeTimeRange(this.data.time1, this.data.time2, this)
  },

  bindTime2Change: function (e) {
    this.setData({
        time2: e.detail.value
    })
    wx.setStorage({
      key: 'darkModeStopTime',
      data: e.detail.value,
      fail: (result) => {
        console.log("保存开始时间失败:" + result)
      }
    })
    this.saveDarkModeTimeRange(this.data.time1, this.data.time2, this)
    
  },

  switchNavigationBar: function(data) {
    if (data) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000'
      })
      wx.setBackgroundColor({
        backgroundColor: '#6A5ACD',
      })
    } else {
      wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#6A5ACD'
        })
    }
  },

  saveDarkModeTimeRange: function(startTime, stopTime, that) {
    wx.setStorage({
      key: 'darkModeStartTime',
      data: startTime
    })
    wx.setStorage({
      key: 'darkModeStopTime',
      data: stopTime
    })
    app.globalData.darkModeStartTime = startTime
    app.globalData.darkModeStopTime = stopTime

    let hour = (new Date()).getHours()
    let min = (new Date()).getMinutes()
    let startTimeHour = startTime.substr(0, 2)
    let stopTimeHour = stopTime.substr(0, 2)
    let startTimeMin = startTime.substr(-2, 2)
    let stopTimeMin = stopTime.substr(-2, 2)
    if ((startTimeHour < hour) || (startTimeHour == hour && startTimeMin <= min)
        || ((hour == stopTimeHour && min < stopTimeMin) || (hour <= (stopTimeHour - 1)))) {
        app.switchDarkModeGo(true, that)
    } else {
      app.switchDarkModeGo(false, that)
    }
  }

})