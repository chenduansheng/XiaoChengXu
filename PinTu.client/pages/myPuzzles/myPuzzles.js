// pages/myPuzzles/myPuzzles.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0,
    userInfo:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      currentTab:options.type
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
    that.setData({ userInfo: app.globalData.userInfo })
  
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
  switchNav: function (e) {
    var curTab = e.currentTarget.dataset.current;
    if (curTab == this.data.currentTab) {
      return;
    } else {
      this.setData({
        currentTab: curTab
      })

    }
  },
  switchTab: function (e) {
    var curSwiper = e.detail.current;
    this.setData({
      currentTab: curSwiper
    })
    // 请求

  },
  urlTarget: function (event) {
    const url_name = event.currentTarget.dataset.url;
    common.urlTarget(url_name);
  }
})