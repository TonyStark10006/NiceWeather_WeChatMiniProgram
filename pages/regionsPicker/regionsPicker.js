// pages/regionsPicker/regionsPicker.js

import initAreaPicker, { getSelectedAreaData } from '../../resources/template/regionsPicker/index.js';

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
    initAreaPicker({
      hideDistrict: true, // 是否隐藏区县选择栏，默认显示
    });
  
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
  confirmRegions: function() {
    wx.reLaunch({
      url: '../index/index?city=' + getSelectedAreaData()[1].fullName + "&type=1",
    })
    console.log(getSelectedAreaData()[1].fullName)
  },
  cancelSelected: function() {
    wx.navigateBack()
  }
})