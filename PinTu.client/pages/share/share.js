// pages/share/share.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({
  data: {
    avatar: '',
    qrCode:'../../image/2018.jpg'
  },
  onLoad: function (options) {
    that = this;
  },
  onReady: function () {
    
  },
  onShow: function () {
    that.setData({ avatar: app.globalData.userInfo?app.globalData.userInfo.avatarUrl:'../../image/2018.jpg'})
    wx.showShareMenu({
      withShareTicket:true
    })    
  },
  onShareAppMessage: function (ret) {
    return{
      title:"share海报拼图",
      path:"/pages/share?testId=5678",
      success:function(res){              // 转发成功
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {       // 将encryptedData、iv传给后台解密=>获取群id
            console.log("get转发信息成功：");
            console.log(res);
          },
          fail: function (res) {
            console.log("get转发信息失败：");
            console.log(res);
          }
        })
      },
      fail:function(res){
        console.log("转发失败，来自：" + ret.from);
        console.log(res);
      }
    }
  },
  urlTarget: function (e) {
    const name = e.currentTarget.dataset.url;
    common.urlTarget(name);
  },
  onSuccess: function (methodName, res) {
    console.log(methodName);
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = ret.data;
        switch (methodName) {
          case '':

            break;
        }

      } else {
        common.showErrorTip(ret.msg);
      }
    } else {
      console.log("接口有问题：" + methodName);
    }
  },
  onFail: function (methodName) {
    console.log("接口调用失败：" + methodName);
  },
  onComplete: function (methodName) { 

  },
  generateShareImg:function(){
    common.showErrorTip("保存二维码图片");
  }
})