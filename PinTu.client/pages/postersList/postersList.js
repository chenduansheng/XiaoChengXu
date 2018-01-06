// pages/postersList/postersList.js
const app = getApp();
const common = require("../../js/common.js");
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    selectBegin:0,
    selectEnd: 50,
    curPage:1,
    totalPage:1,
    arrPoster:[],
    imgDir:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      imgDir: app.globalData.imgDir
    })
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
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
    that.getPosterList();
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
  onShareAppMessage: function () {
  
  },
  getPosterList:function(){
    let begin = that.data.selectBegin;
    let end = that.data.selectEnd;
    let params = {
      _C: 'Act',
      _A: 'select',
      _LIMIT: begin + "," + end,
      _FILTER: ''
    }
    common.request("getPosterList", that, "form", params);  
  },
  onSuccess: function (methodName, res) {
    if (res.statusCode == 200) {
      let ret = res.data;
      let data = res.data.data;
      if (ret.code == 200) {
        let data = ret.data;
        switch (methodName) {
          case 'getPosterList':
            //let length = data.list.length;
            var arrPoster = that.data.arrPoster.concat(data.list);
            that.setData({
              arrPoster: arrPoster
            })
            //console.log(arrPoster);
            break;
        }

      } else {
        console.log(ret)
        ret.msg?common.showErrorTip(ret.msg):'';
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
  scrollToBottom:function(){
    console.log("---end---");
  }
})