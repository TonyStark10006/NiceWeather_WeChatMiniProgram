const app = getApp();
//const thisPage = getCurrentPages;
const apiData = require('../../resources/data.js')
const config = require('../../config.js')

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    credit: app.globalData.credit,
    copyRight: app.globalData.copyRight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)//区域选择页面传入参数
    //console.log(config.generateKey())
    wx.showNavigationBarLoading();
    if (!options.city) {
      wx.showLoading({
        title: '定位中...',
      })

      this.getLocation().then((res) => {
        wx.showLoading({
          title: '查询中...',
        })
        this.getCurrentWeather(res)
      })

      // const currentWthPromise = this.getLocation().then((res) => this.getCurrentWeather(res));
      // const sevenDaysPromise = this.getLocation().then((res) => this.get7DaysWeather(res));
      // Promise.all([currentWthPromise, sevenDaysPromise]).then(() => {
      //   console.log(app.globalData.haha)
      //     wx.hideLoading();
      //     wx.hideNavigationBarLoading();
      //   }
      // ).catch(e => console.log(e));
    } else {
      wx.showLoading({
        title: '查询中...',
      })
      this.getCurrentWeather(options.city);
    }


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
    wx.showLoading({
      title: '定位中...',
    })

    this.getLocation().then((res) => {
      wx.showLoading({
        title: '查询中...',
      })
      this.getCurrentWeather(res)
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
  onReachBottom: function () {
  
  },

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
          this.hideLoading()
          wx.showModal({
            content: "出错啦，请先授权获取您的位置",
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
                wx.showToast({
                  title: '请下拉页面刷新',
                  icon: "none"
                })
              }
            }
          });
        }
      })
    }
    )
  },

  getSelecedData() {
    wx.navigateTo({
      url: '../regionsPicker/regionsPicker',
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
                content: "查询太频繁啦，过一会再来吧",
                showCancel: false
              })
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
            forecast: res.data.data
          })
        } else {
          wx.showModal({
            content: '没有这个城市的7天天气预测啊',
            showCancel: true
          })
        }
        this.hideLoading()
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
    wx.hideNavigationBarLoading();
  }

})
