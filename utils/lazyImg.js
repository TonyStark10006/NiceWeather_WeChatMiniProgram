function getDeviceHeight(that) {
  wx.getSystemInfo({  // 获取页面可视区域的高度
    success: (res) => {
      that.setData({
        height: res.screenHeight
      })
    },
  })
}

function showImg(that, data) {
  let height = that.data.height  // 页面的可视高度

  wx.createSelectorQuery().selectAll('.item').boundingClientRect((ret) => {
    ret.forEach((item, index) => {
      if (item.top <= height) {
        // 判断是否在显示范围内
        data[index].show = true // 根据下标改变状态
      }
    })
    that.setData({
      dataList: data
    })
  }).exec()

}

function copyName(e) {
  //console.log(e)
  console.log(e.currentTarget.dataset.name)
  wx.setClipboardData({
    data: e.currentTarget.dataset.name,
    // success: function (res) {
    // wx.showModal({
    //   content: '已经复制书名到粘贴板啦',
    //   showCancel: false
    // })
    // wx.getClipboardData({
    //   success: function (res) {
    //     console.log(res.data) // data
    //   }
    // })
    // }
  })
}

function previewImg(that, e) {
  wx.previewImage({
    current: e.currentTarget.dataset.src,
    urls: that.data.imgList
  })
}


module.exports = {
  showImg: showImg,
  copyName: copyName,
  getDeviceHeight: getDeviceHeight,
  previewImg: previewImg
}