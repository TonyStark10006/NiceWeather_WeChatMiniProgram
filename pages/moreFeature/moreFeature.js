// pages/MoreFeature.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    credit: app.globalData.credit,
    copyRight: app.globalData.copyRight,
    version: app.globalData.version
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
    app.switchDarkMode(this)
    app.switchTabBar(app.globalData.darkMode)
    // app.switchNavigationBar(app.globalData.darkMode)
    // this.setData({
    //   darkMode: app.globalData.darkMode
    // })
    // app.switchTabBar(app.globalData.darkMode)
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
  // onPullDownRefresh: function () {
  
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})