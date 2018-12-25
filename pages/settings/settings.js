// pages/settings.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1 : false,
    switch2 : false,
    time: "23:00",
    time1: "6:00"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'darkMode',
      success: (result)=>{
        console.log(result)
        if (result.data === true) {
          that.setData({
            switch1 : result.data
          })
          app.switchNavigationBar(result.data)
        }
      }
    });

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
    console.log(e)
    app.globalData.darkMode = e.detail.value
    console.log("黑暗模式的全局变量值为" + app.globalData.darkMode)
    this.setData({
      'switch1' : e.detail.value,
      'switch2' : !e.detail.value
    })

    // 改变导航栏背景颜色
    this.switchNavigationBar(app.globalData.darkMode)
    // 本地保存模式状态
    wx.setStorage({
      key: 'darkMode',
      data: app.globalData.darkMode,
      success: () => {
        console.log("darkMode变量保存成功")
      }
    })


    // 调整tabBar颜色
    // wx.setTabBarStyle({
    //   color: '#0000FF',
    //   selectedColor: '#999999',
    //   backgroundColor: '#000000'
    // })

  },

  switch3Change: function(e) {
    app.globalData.darkMode = e.detail.value
    console.log("黑暗模式的全局变量值为" + app.globalData.darkMode)
    this.setData({
        'switch2' : e.detail.value
    })
  },
  // bindTimeChange: function (e) {
  //     this.setData({
  //         time: e.detail.value
  //     })
  // },

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
  }

})