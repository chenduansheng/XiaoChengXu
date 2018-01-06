// pages/share/share.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({
  data: {
    avatar: '',
    qrCode:'../../image/2018.jpg',    // 二维码
    aid:''
  },
  onLoad: function (options) {
    that = this;
    that.setData({ 
      aid: options.aid,
      qrCode: options.poster
    })
    console.log(options);
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
      path:"/pages/share?aid="+that.data.aid,
      success:function(res){              // 转发成功
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {       // 将encryptedData、iv传给后台解密=>获取群id
            console.log("share界面转发成功：");
            console.log(res);
          },
          fail: function (res) {
            console.log("share界面转发失败：");
            console.log(res);
          }
        })
      },
      fail:function(res){
        console.log("share转发失败，来自：" + ret.from);
        console.log(res);
      }
    }
  },
  urlTarget: function (e) {
    const name = e.currentTarget.dataset.url;
    common.urlTarget(name,"","?aid="+that.data.aid);
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