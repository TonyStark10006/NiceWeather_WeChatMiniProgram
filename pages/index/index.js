const app = getApp();
const thisPage = getCurrentPages;
// const apiData = require('../../resources/data.js')
const config = require('../../config.js')
const promise = require('../../utils/wechatAPI.js')
// wx.cloud.init({
//   traceUser: true
// })

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSettingPage: false
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
      // 获取位置并同步获取天气信息
      this.getLocation().then((res) => {
        wx.showLoading({
          title: '查询中...',
        })
        this.getCurrentWeather(res)
      }, (error) => {
        // 兼容处理调用设置页功能，SDK版本小于2.0.7的可以用wx.openSetting这个API，SDK不小于2.0.7要使用button组件
        // this.hideLoading()
        wx.hideLoading();
        wx.showModal({
          content: "出错啦，请先授权获取您的位置",
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              if (wx.getSystemInfoSync().SDKVersion >= '2.0.7') {
                this.setData({
                  showSettingPage: true
                })
              } else {
                wx.openSetting({
                  success: (res) => {
                    wx.showToast({
                      title: '请下拉页面刷新',
                      icon: "none"
                    })
                  }
                })
              }
            } else {
              wx.showToast({
                title: '请下拉页面刷新并点击确定',
                icon: "none"
              })
            }
          }
        });
      })

      // const currentWthPromise = this.getLocation().then((res) => this.getCurrentWeather(res));
      // const sevenDaysPromise = this.getLocation().then((res) => this.get7DaysWeather(res));
      // Promise.all([currentWthPromise, sevenDaysPromise]).then(() => {
      //   console.log(app.globalData.haha)
      //     wx.hideLoading();
      //   }
      // ).catch(e => console.log(e));
    } else {
      wx.showLoading({
        title: '查询中...',
      })
      this.getCurrentWeather(options.city);
    }

    // wx.cloud.callFunction({
    //   name: "add",
    //   data: {
    //     a: 1,
    //     b: 2
    //   },
    //   success: function(res) {
    //     console.log("云函数add的运算结果如下：")
    //     console.log(res.result)
    //   }
    // })

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
    // 因为onshow时获取到值的时间比设置globalData值的时间点要早，所以要从本地储存获取darkMode的值
    let that = this 
    promise.wechatAPI.taskSequence()
    .then(() => {
      return new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'darkMode',
          success: (res) => {
            that.setData({
              darkMode: res.data
            })
            app.switchNavigationBar(res.data)
            app.switchTabBar(res.data)
            resolve()
          }
        })
      })
    })
    .then(() => {
      return new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'darkModeByTime',
          success: (result) => {
            app.globalData.darkModeByTime = result.data
            // console.log('app.globalData.darkModeByTime')
            resolve()
          }
        })
      })
    })
    .then(() => {
      return new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'darkModeStartTime',
          success: (result) => {
            app.globalData.darkModeStartTime = result.data
            // console.log('darkModeStartTime')
            resolve()
          }
        })
      })
    })
    .then(() => {
      return new Promise(function (resolve, reject) {
        wx.getStorage({
          key: 'darkModeStopTime',
          success: (result) => {
            app.globalData.darkModeStopTime = result.data
            // console.log('darkModeStopTime')
            resolve()
          }
        })
      })
    })
    .then(() => {
      // console.log('switchDarkMode')
      app.switchDarkMode(that)
      app.switchTabBar(app.globalData.darkMode)
        // if (app.globalData.darkModeByTime) {
        //   let hour = (new Date()).getHours()
        //   let min = (new Date()).getMinutes()
        //   let startTimeHour = app.globalData.darkModeStartTime.substr(0, 2)
        //   let stopTimeHour = app.globalData.darkModeStopTime.substr(0, 2)
        //   let startTimeMin = app.globalData.darkModeStartTime.substr(-2, 2)
        //   let stopTimeMin = app.globalData.darkModeStopTime.substr(-2, 2)
        //   if ((startTimeHour <= hour && startTimeMin <= min) 
        //     || ((hour == stopTimeHour && min < stopTimeMin) || (hour <= (stopTimeHour - 1)))) {
        //       app.switchDarkModeGo(true, that)
        //   } else {
        //     app.switchDarkModeGo(false, that)
        //   }
        // }
    }).catch(function(error) {
      console.log('发生错误！', error)
      logger.warn('发生错误！', error)
    })
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
    wx.showLoading({
      title: '定位中...',
    })

    this.getLocation().then((res) => {
      wx.showLoading({
        title: '查询中...',
      })
      this.getCurrentWeather(res)
    }, (error) => {
      //console.log(error)
      // 兼容处理调用设置页功能，SDK版本小于2.0.7的可以用wx.openSetting这个API，SDK不小于2.0.7要使用button组件
      // this.hideLoading()
      wx.hideLoading();
      wx.showModal({
        content: "出错啦，请先授权获取您的位置",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            if (wx.getSystemInfoSync().SDKVersion >= '2.0.7') {
              this.setData({
                showSettingPage: true
              })
            } else {
              wx.openSetting({
                success: (res) => {
                  wx.showToast({
                    title: '请下拉页面刷新',
                    icon: "none"
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: '请下拉页面刷新并点击确定',
              icon: "none"
            })
          }
        }
      });
    })
    // 下拉动画维持时间
    setTimeout(() => {
      this.hideLoading
      wx.stopPullDownRefresh()
    }, 1500);
  },

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

  getLocation: function() {
    return new Promise(function(resolve, reject) {
        wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          //根据获取到的坐标查询城市代码
          wx.request({
            url: config.data.baiduUrl,
            data: {
              ak: config.data.baiduAK,
              location: res.latitude + "," + res.longitude,
              output: 'json',
              pois: 1
            },
            success: (res) => {
              //wx.hideLoading()
              resolve(res.data.result.addressComponent.city)
            }
          })
        },
        fail: () => {
          reject(new Error('no location permission'));
        }
      })
    }
    )
  },

  getSelecedData() {
    // wx.navigateTo({
    //   url: '../regionsPicker/regionsPicker',
    // })
    wx.navigateTo({
      url: '../regionsPicker-iViewUI/index',
    })
  },

  getCurrentWeather: function(city) {
    var data = {}
    var ts = config.generateKey().ts
    var uid = config.generateKey().UID
    var sig = config.generateKey().sig
    var ttl = config.generateKey().ttl
    
    //心知天气接口-今天天气
    wx.request({
      url: config.data.xinzhiRTWthUrl,
      data: {
        location: city,
        ts: ts,
        uid: uid,
        sig: sig,
        ttl: ttl
      },
      success: (res) => {
        if (res.statusCode == 200) {
          //console.log(res.data.results[0].now);
          this.data["city"] = city;
          this.data["tem"] = res.data.results[0].now.temperature;
          this.data["wea"] = res.data.results[0].now.text;
          this.data["iconSrc"] = "../../resources/weatherIcon/" + res.data.results[0].now.code + ".png";

          //心知天气接口-生活提示
          wx.request({
            url: config.data.xinzhiSuggestionUrl,
            data: {
              location: city,
              ts: ts,
              uid: uid,
              sig: sig,
              ttl: ttl
            },
            success: (res) => {
              //console.log(res.data.results[0].suggestion)
              var suggestion = res.data.results[0].suggestion;
              this.data["tips"] = "感冒" + suggestion.flu.brief + "，紫外线" + suggestion.uv.brief;

              // 更新视图, 回调get7DaysWeather
              this.setData(this.data)
              this.get7DaysWeather(city)
            }
          })
        } else {
           if (res.statusCode == 403) {
              wx.showModal({
                content: "查询太频繁或者暂没" + city + "的天气信息(目前不支持地级市)",
                showCancel: false
              })
              // this.getCurrentWeather('北京市')
            } else {
              wx.showModal({
                content: "哎哟，暂时没" + city +  "的天气信息",
                showCancel: false
              })
            }
          this.hideLoading()
          }
      },
      fail: (res) => {
        wx.showToast({
          title: '网络有点问题，重新操作一下吧',
          icon: "none"
        })
        wx.reLaunch({
          url: './index',
        })
      }
    })
  },

  get7DaysWeather: function(city) {
    wx.request({
      url: config.data.getWeatherMsgURL + city,
      success: (res) => {
        console.log(res.data)
        if (res.data.status == 200) {
          this.setData({
            updateTime: res.data.updateTime,
            forecast: res.data.data,
            showSettingPage: false
          })
        } else {
          wx.showModal({
            content: "没有" + city + "的7天天气预测啊",
            showCancel: false
          })
        }
        this.hideLoading()
      },
      fail: (error) => {
        logger.warn(error)
      }
    })

  },

  showVersion: function() {
    wx.showModal({
      content: '版本号: ' + app.globalData.version,
      showCancel: false
    })
  },

  hideLoading: function() {
    wx.hideLoading();
  }

})
