const app = getApp();
const thisPage = getCurrentPages;
var num = 0
var apiData = require('../../resource/data.js')
var config = require('../../config.js')

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var that = this
    wx.showLoading({
      title: '定位中...',
    })
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        wx.hideLoading()
        wx.showLoading({
          title: '查询中...',
        })
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log('纬度：' + latitude + "  纬度：" + longitude)
        // wx.showLoading({
        //   title: '经度:' +longitude
        // })
        //更新视图
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        //根据获取到的坐标查询城市代码
        wx.request({
          url: config.data.baiduUrl,
          data: {
            ak: config.data.baiduAK,
            location: latitude + "," + longitude,
            output: 'json',
            pois: 1
          },
          success: (res) => {
            this.setData({
              city: res.data.result.addressComponent.city
            })
            var city = res.data.result.addressComponent.city
            // 根据获得城市名称查询天气
            // wx.request({
            //   url: '',
            //   data: {

            //   },
            //   success: (res) => {

            //   }
            // })
            //更新视图
            var data = {}
            for(var i = 0; i < apiData.data.data.forecast.length; i++) {
              data["t" + (i + 1)] = apiData.data.data.forecast[i].date + " "
                + apiData.data.data.forecast[i].type + " "
                + apiData.data.data.forecast[i].high + " "
                + apiData.data.data.forecast[i].low + " "
                //+ apiData.data.data.forecast[0].fengli.nodevalue + " "
                + apiData.data.data.forecast[i].fengxiang
            }
            this.setData(data)
            this.setData({
              tips: apiData.data.data.ganmao,
              tem: apiData.data.data.wendu
            })
            console.log(res.data.result)
            console.log(apiData.data.data.forecast[0].date)
            wx.hideLoading()
          }
        })
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
})
