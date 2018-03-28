const app = getApp();
const thisPage = getCurrentPages;
const apiData = require('../../resources/data.js')
const config = require('../../config.js')

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
    var data = {}
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
        //console.log('纬度：' + latitude + "  纬度：" + longitude)
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
            var city = res.data.result.addressComponent.city
            //心知天气接口-今天天气
            wx.request({
              url: config.data.xinzhiRTWthUrl,
              data: {
                location: city,
                ts: config.data.xinzhiTS,
                uid: config.data.xinzhiUID,
                sig: config.data.xinzhiEncrypted
              },
              success: (res) => {
                //console.log(res.data.results[0].now);
                this.data["city"] = city;
                this.data["tem"] = res.data.results[0].now.temperature;
                this.data["wea"] = res.data.results[0].now.text;

                //心知天气接口-未来三天天气
                wx.request({
                  url: config.data.xinzhiDailyWthUrl,
                  data: {
                    location: city,
                    ts: config.data.xinzhiTS,
                    uid: config.data.xinzhiUID,
                    sig: config.data.xinzhiEncrypted,
                    start: 0,
                    days: 5
                  },
                  success: (res) => {
                    //console.log(res.data.results[0].daily)
                    var forecast = res.data.results[0].daily
                    for (var i = 0; i < forecast.length; i++) {
                    this.data["t" + (i + 1)] = //forecast[i].date + " " +
                      forecast[i].text_day + " "
                      + forecast[i].low + "℃-"
                      + forecast[i].high + "℃ "
                      //+ forecast[i].wind_direction_degrdd + " "
                      + forecast[i].wind_direction
                    }

                    //心知天气接口-生活提示
                    wx.request({
                      url: config.data.xinzhiSuggestionUrl,
                      data: {
                        location: city,
                        ts: config.data.xinzhiTS,
                        uid: config.data.xinzhiUID,
                        sig: config.data.xinzhiEncrypted
                      },
                      success: (res) => {
                        //console.log(res.data.results[0].suggestion)
                        var suggestion = res.data.results[0].suggestion;
                        this.data["tips"] = "可穿" + suggestion.dressing.brief + "衣服，感冒" +
                          suggestion.flu.brief + "，紫外线" + suggestion.uv.brief;

                        //更新视图
                        this.setData(this.data)
                      }
                    })

                  }
                })
              }
            })

            // 个人接口
            // 根据获得城市名称查询天气
            // wx.request({
            //   url: '',
            //   data: {

            //   },
            //   success: (res) => {

            //   }
            // })
            //更新视图
            // var data = {}
            // for(var i = 0; i < apiData.data.data.forecast.length; i++) {
            //   data["t" + (i + 1)] = apiData.data.data.forecast[i].date + " "
            //     + apiData.data.data.forecast[i].type + " "
            //     + apiData.data.data.forecast[i].high + " "
            //     + apiData.data.data.forecast[i].low + " "
            //     //+ apiData.data.data.forecast[0].fengli.nodevalue + " "
            //     + apiData.data.data.forecast[i].fengxiang
            // }
            // this.setData(data)
            // this.setData({
            //   tips: apiData.data.data.ganmao,
            //   tem: apiData.data.data.wendu,
            //   city: city
            // })
            // console.log(apiData.data.data.forecast[0].date)



            //console.log(res.data.result)
            //console.log("心知key加密后结果" + config.data.xinzhiEncrypted)
            wx.hideLoading()
          }
        })
      }
    })
            console.log(this.data)
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
