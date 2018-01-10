// pages/share/share.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({
  data: {
    avatar: '',
    qrCode:'../../image/2018.jpg',    // 二维码
    aid:'',
    imgDir:""
  },
  onLoad: function (options) {
    that = this;
    that.setData({ 
      imgDir:app.globalData.imgDir,
      aid: options.aid ? options.aid:2,
      qrCode: options.poster
    })
    console.log(options);
  },
  onReady: function () {
    
  },
  onShow: function () {
    that.setData({ avatar: app.globalData.userInfo?app.globalData.userInfo.avatarUrl:'../../image/2018.jpg'})
    let _DATA = {
      // scene: "aid=" + that.data.aid,
      // page:"pages/share/share",
      path: "pages/share/share?aid=" + that.data.aid
    }
    let params = {
      _C:'Code2d',
      _A:'get',
      _DATA: JSON.stringify(_DATA)      
    }
    common.request("getQrcode",that,"form",params);
    wx.showShareMenu({
      withShareTicket:true
    })    
  },
  onShareAppMessage: function (ret) {
    return{
      title:"share海报拼图",
      path:"/pages/share?aid="+that.data.aid, 
      // imageUrl:"http://xcx.s1.welcomest.com/pintu/images/act/poster/wx3d00770652053edd.o6zAJs9bs--3Qn1Jkc_lFPynmD4A.e756eb43cc22c1f2e0c4c63623777dd5.png",
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
          case 'getQrcode':   // 获取二维码
            let qrCodeSrc = that.data.imgDir + data.info.pic;
            that.setData({ qrCode: qrCodeSrc});
            console.log(qrCodeSrc);
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
    that.previewImg();
  },
  previewImg:function(){
    var arrUrl = [];
    arrUrl[0] = that.data.qrCode;
    wx.previewImage({
      current: that.data.qrCode,
      urls: arrUrl,
      success:function(res){
        
      },
      fail:function(res){
        
      }
    })
  }
})