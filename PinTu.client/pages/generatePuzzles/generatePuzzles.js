// pages/generatePuzzles/generatePuzzles.js
const app = getApp();
const common = require("../../js/common.js");
var that = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyNo1:'',
    moneyNo2: '',
    moneyNo3: '',
    moneyNo4: '',
    moneyTotal: '',
    group:1,
    moneyService:8,
    diffDistance:'',
    radioSex:'',
    inputDiffDistance:'',
    logo: '../../image/camera.png'
  },
  onLoad: function (options) {
    that = this;
  },
  onReady: function () {
  
  },
  onShow: function () {    

  },
  onShareAppMessage: function () {
  
  },
  changeRadioSex: function (e) {
    that.setData({ radioSex: e.detail.value });
  },
  getDiffDistance: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputDiffDistance: curVal })
  },
  uploadLogo: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        that.setData({ logo: res.tempFilePaths[0] });
      }
    })
  },
  getNo1:function(e){
    var no1 = parseFloat(e.detail.value);
    if (!no1 || no1 < 2) {
      common.showErrorTip("冠军最低2元");
      no1 = 2;
    }
    that.computeMoney(no1);
  },
  getGroup:function(e){
    let group = e.detail.value;
    that.setData({
      group: group
    })
    that.computeMoney();
  },
  computeMoney:function(no1){
    var no1 = no1 ? no1 : (that.data.moneyNo1 ? that.data.moneyNo1:2);
    no1 = parseFloat(no1);
    let no2 = no1 * 0.2;
    let no3 = no2 * 0.2;
    let no4 = no3 * 0.2;
    let group = that.data.group;
    let moneyService = that.data.moneyService;
    let moneyTotal = moneyService + parseInt(group) * (no1 + no2 + no3 + no4 * 7);
    that.setData({
      moneyNo1: no1.toFixed(2),
      moneyNo2: no2.toFixed(2),
      moneyNo3: no3.toFixed(2),
      moneyNo4: no4.toFixed(2),
      moneyTotal: moneyTotal.toFixed(2)
    })
  },
  generatePics:function(){
    if (!that.data.moneyNo1){
      common.showErrorTip("请先完善信息");
      return false;
    }
    //common.showErrorTip("切图3*4");
    let timeStamp = "0";
    let nonceStr = "0";
    let pkg = "0";
    let paySign = "0";
    let orderId = "0";
    common.wxpay(timeStamp, nonceStr, pkg, paySign, orderId);
  },
  onSuccess: function (methodName, res) {
    console.log(methodName);
    console.log(res);
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = ret.data;
        switch (methodName) {
          case 'sendCode':
            
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