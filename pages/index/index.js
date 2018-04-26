const app = getApp();
const thisPage = getCurrentPages;
const apiData = require('../../resources/data.js')
const config = require('../../config.js')
//import initAreaPicker, { getSelectedAreaData } from '../../resources/template/index.js';
// const city = Promise(function (resolve, reject) {
//   wx.getLocation({
//     type: 'wgs84',
//     success: (res) => {
//       wx.hideLoading()
//       wx.showLoading({
//         title: '查询中...',
//       })
//       var latitude = res.latitude
//       var longitude = res.longitude
//       var speed = res.speed
//       var accuracy = res.accuracy
//       //根据获取到的坐标查询城市代码
//       wx.request({
//         url: config.data.baiduUrl,
//         data: {
//           ak: config.data.baiduAK,
//           location: latitude + "," + longitude,
//           output: 'json',
//           pois: 1
//         },
//         success: (res) => {
//           var city = res.data.result.addressComponent.city
//           //app.globalData.city = res.data.result.addressComponent.city
//           if (city) {
//             resolve(value)
//           } else {
//             reject(error)
//           }
//         }
//       })
//     }
//   })
// })

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRegions: false,
    showQuery: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)//区域选择页面传入参数
    if (!options.city) {
      wx.showLoading({
        title: '定位中...',
      })
      this.getLocation().then((res) => {
        console.log(res);
        wx.showLoading({
          title: '查询中...',
        })
        this.getWeatherMsg3(res)
      });
    } else {
      wx.showLoading({
        title: '查询中...',
      })
      this.getWeatherMsg3(options.city)
    }
    //this.getWeatherMsg()

    // 个人接口
    // 坐标转城市
    //  this.getLocation().then((response) => {
    //    var data = {}
    //    data["city"] = response;
    //    // 根据城市名查天气
    //    this.getWeatherMsg1('http://localhost/getWeatherMsg?city=' + response).then((response) => {
    //      // 填充视图
    //      console.log(response)
    //      for (var i = 0;i < response.data.length; i++) {
    //       data["t" + (i + 1)] = "";
    //       for (var j = 0; j < response.data[i].length; j++) {
    //       data["t" + (i + 1)] += response.data[i][j]
    //       //console.log(response.data[i][j])
    //       }
    //      }
    //      console.log(data)
    //      this.setData(data)
    //      wx.hideLoading()
    //    })
    //  })

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
    // initAreaPicker({
    //   hideDistrict: true, // 是否隐藏区县选择栏，默认显示
    // });
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
    this.getWeatherMsg()
    //
    setTimeout(() => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1500);
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
  
  getWeatherMsg: function() {
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
                this.data["iconSrc"] = "../../resources/weatherIcon/" + res.data.results[0].now.code + ".png";

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
                        + forecast[i].low + "-"
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
                        wx.hideLoading();
                        wx.hideNavigationBarLoading()
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
            //wx.hideLoading()
          }
        })
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          content: "定位失败，请重新授权",
          showCancel: false,
          success: function (res) {
            // 用户点击确定
            if (res.confirm) {
              // wx.authorize({
              //   scope: 'scope.userLocation',
              //   success() {
              //     console.log("我的天")
              //   },
              //   fail() {
              //     console.log("你的天")
              //   }
              // })
              //this.getWeatherMsg()
              wx.openSetting({
                success: (res) => {
                  wx.showToast({
                    title: '请下拉页面刷新',
                    icon: "none"
                  })
                }
              })
              // 用户无操作
            } else {
              wx.showModal({
                content: "定位失败，下拉本页面刷新或到设置页面授权位置权限",
                showCancel: false
              })
            }
          }
        });
      }
    })
  },

  getLocation: function() {
    return new Promise(function(resolve, reject) {
        wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          var latitude = res.latitude
          var longitude = res.longitude
          var speed = res.speed
          var accuracy = res.accuracy
          //根据获取到的坐标查询城市代码
          // this.fetch({
          //   url: config.data.baiduUrl,
          //   data: {
          //     ak: config.data.baiduAK,
          //     location: latitude + "," + longitude,
          //     output: 'json',
          //     pois: 1
          //     }
          //   }).then((res) => {
          //     console.log(res)
          //     return res.data.result.addressComponent.city
          //   });
          wx.request({
            url: config.data.baiduUrl,
            data: {
              ak: config.data.baiduAK,
              location: latitude + "," + longitude,
              output: 'json',
              pois: 1
            },
            success: (res) => {
              wx.hideLoading()
              //this.city = res.data.result.addressComponent.
              //app.globalData.city = res.data.result.addressComponent.city
              //console.log(res.data.result.addressComponent.city)
              resolve(res.data.result.addressComponent.city)
            }
          })
        }
      })
    }
    )
  },

  fetch: function (options) {
    options = options || {};
    return new Promise((resolve, reject) => {
      options.success = resolve;
      options.fail = reject;
      wx.request(options);
    });
  },

  getWeatherMsg1: function(url) {
    return new Promise(function(resolve, reject) {
      wx.request({
        url: url,
        success: (res) => {
          //console.log(res.data)
          resolve(res.data)
        }
      })
    })
  },

  getSelecedData() {
    wx.navigateTo({
      url: '../regionsPicker/regionsPicker',
    })
    // this.showRegions = this.showRegions ? false : true;
    // this.showQuery = this.showQuery ? false : true;
    // console.log(this.showRegions)
    // this.setData({
    //   showRegions: this.showRegions,
    //   showQuery: this.showQuery
    // })
    //console.table(getSelectedAreaData()); // 提供`getSelectedAreaData`方法，返回当前选择的省市区信息组成的数组
  },

  getWeatherMsg3: function(city) {
    var data = {}
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
        this.data["iconSrc"] = "../../resources/weatherIcon/" + res.data.results[0].now.code + ".png";

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
                + forecast[i].low + "-"
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
                wx.hideLoading();
                wx.hideNavigationBarLoading()
              }
            })

          }
        })
      }
    })
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          content: "定位失败，请重新授权",
          showCancel: false,
          success: function (res) {
            // 用户点击确定
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  wx.showToast({
                    title: '请下拉页面刷新',
                    icon: "none"
                  })
                }
              })
              // 用户无操作
            } else {
              wx.showModal({
                content: "定位失败，下拉本页面刷新或到设置页面授权位置权限",
                showCancel: false
              })
            }
          }
        });
  },

  getWeatherMsg4: function(city) {
    var data = {};
    wx.request({
      url: '',
    })

  }

})
