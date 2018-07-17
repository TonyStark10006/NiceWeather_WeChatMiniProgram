// pages/mix/duokanSpecialOfferBook/duokanSpecialOfferBook.js
const config = require('../../../config.js')
const lazyImg = require('../../../utils/lazyImg.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    switch (options.target) {
      case 'duokanDiscountBook':
        var title = '限时折扣'
        var url = config.data.duoKanDiscountBookUrl
        var tips = '暂时没有折扣书，明天再来看看吧'
        break
      case 'duokanSpecialOfferBook':
        var title = '限时特价'
        var url = config.data.duoKanSpecialOfferBookUrl
        var tips = '暂时没有特价书，明天再来看看吧'
        break
      default:
        var title = '页面不对啊'
        var tips = '页面不对啊'
    }

    wx.showLoading({
      title: '加载中',
    })

    wx.setNavigationBarTitle({
      title: '多看' + title,
    })

    this.setData({
      title: title
    })

    var that = this
    lazyImg.getDeviceHeight(that)

    wx.request({
      url: url,
      success: (res) => {
        if (res.data == '') {
          wx.showModal({
            content: tips,
            showCancel: false
          })
        } else {
          var imgList = []
          for (var i = 0; i < res.data.length; i++) {
            imgList[i] = res.data[i].cover
          }
          this.setData({
            dataList: res.data,
            imgList: imgList
          })
          lazyImg.showImg(that, this.data.dataList)
        }
        wx.hideLoading()
      }
    })

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
  
  },

  onPageScroll: function() {
    var that = this
    lazyImg.showImg(that, this.data.dataList)
  },

  copyName: function(e) {
    lazyImg.copyName(e)
  },

  previewImg: function(e) {
    var that = this
    lazyImg.previewImg(that, e)
  }



})