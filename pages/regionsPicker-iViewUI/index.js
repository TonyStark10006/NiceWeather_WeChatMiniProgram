import { cities } from './city';
const app = getApp()
Page({
    data : {
      cities: [],
      inputShowed: false,
      inputVal: "",
      searchResultShow: false
    },
    getSelectedCity(e) {
      console.log(e)
      wx.reLaunch({
        url: '../index/index?city=' + e.currentTarget.dataset.itName + "&type=1",
      })
    },
    onChange(event){
        console.log(event.detail,'click right menu callback data')
    },
    onReady(){
        let storeCity = new Array(26);
        const words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
        words.forEach((item,index)=>{
            storeCity[index] = {
                key : item,
                list : []
            }
        })
        cities.forEach((item)=>{
            let firstName = item.pinyin.substring(0,1);
            let index = words.indexOf( firstName );
            storeCity[index].list.push({
                pinyin : item.pinyin,
                name : item.name,
                key : firstName
            });
        })
        this.data.cities = storeCity;
        this.setData({
            cities : this.data.cities
      })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchResultShow: false
    });
  },
  inputTyping: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    });
  },
  searchRegion: function (event) {
    // let query = wx.createSelectorQuery()
    // query.select('#Jiangmen').boundingClientRect(function (res) {
    //   console.log(res)
    //   wx.pageScrollTo({
    //     scrollTop: res.top,
    //   })
    //   res[0].top       // #the-id节点的上边界坐标
    //   res[1].scrollTop // 显示区域的竖直滚动位置
    // })
    // query.exec()
    if (event.detail.value === '') {
      return
    } else {
      // 定义数组结构，根据iView的索引选择器组件的数据结构定义
      let arr = []
      let num = 0
      let num1 = 0
      // 历遍A-Z的地名集合
      for (let i in this.data.cities) {
        arr[num1] = {}
        arr[num1].list = []
        // 历遍具体某个字母的地名集合，匹配中文字或拼音
        for (let j in this.data.cities[i]['list']) {
          if (this.data.cities[i]['list'][j].name.indexOf(event.detail.value) >= 0 || 
            this.data.cities[i]['list'][j].pinyin.toLowerCase().indexOf(event.detail.value.toLowerCase()) >= 0) {
            arr[num1].key = this.data.cities[i]['list'][j].key
            arr[num1].list[num] = this.data.cities[i]['list'][j]
            ++num
          }
        }
        // 重置某个字母地名集合的搜索结果索引
        num = 0

        // 去除最后一个空数组
        if (!('key' in arr[num1]) && i == 25) {
          arr.pop()
          break
        }

        // 搜索结果不为空则递增索引
        if (arr[num1].list.length > 0) {
          ++num1
        }
      }
      console.log(arr)
      if (arr.length == 0) {
        wx.showToast({
          title: '没有该城市',
          icon: 'none'
        })
        return
      } else {
        this.setData({
          searchResult: arr,
          searchResultShow: true
        })
      }
    }
  },

  // 将用户输入的拼音转成首字母大写
  caseTransfer: function (str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  },

  onShow: function() {
    app.switchNavigationBar(app.globalData.darkMode)
    console.log(app.globalData.darkMode)
    this.setData({
      darkMode: app.globalData.darkMode
    })
    app.switchTabBar(app.globalData.darkMode)
  }
});