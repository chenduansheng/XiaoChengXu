// pages/ranking/ranking.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({
  data: {
    avatar: '',
    posterSrc:'../../image/2018.jpg',
    showPuzzle:false,
    useTime:0
  },
  onLoad: function (options) {
    that = this;
  },
  onReady: function () {
  
  },
  onShow: function () {
    that.setData({ avatar: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '../../image/poster2018.png' })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  urlTarget:function(e){
    const name = e.currentTarget.dataset.url;
    common.urlTarget(name,"switchTab");
  },
  openPuzzle:function(){
    that.setData({showPuzzle:true});
    var time = 0;
    setTimeout(function(){
      time += 1;
      that.setData({useTime:time})
    },1000)
  },
  cancelGame:function(){
    that.setData({showPuzzle:false})
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
  onComplete: function (methodName) { }
})