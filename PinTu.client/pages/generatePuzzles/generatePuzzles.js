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
    inputDescription:'',
    logo: '../../image/camera.png',
    poster:'../../image/poster001.png'
  },
  onLoad: function (options) {
    that = this;
    that.setData({ poster: options.poster})
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
  getDescription: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputDescription: curVal })
  },
  chooseImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        that.setData({ logo: tempFilePaths[0] });
        let params = {
          path: "active"
        }
        common.uploadFile(that, "submitActiveImg", tempFilePaths[0], params);    
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
      group: parseInt(group)
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
    let moneyTotal = moneyService + group * (no1 + no2 + no3 + no4 * 7);
    that.setData({
      moneyNo1: no1.toFixed(2),
      moneyNo2: no2.toFixed(2),
      moneyNo3: no3.toFixed(2),
      moneyNo4: no4.toFixed(2),
      moneyTotal: moneyTotal.toFixed(2)
    })
  },
  clickGenerate:function(){
    if (!that.data.moneyNo1){
      common.showErrorTip("请先完善信息");
      return false;
    }
    let params = {
      path: "act/poster"
    }
    common.uploadFile(that, "submitPost", that.data.poster, params);
  },
  submitActive:function(){
    let params = {
      _C: "Act",
      _A: "insertOne",
      _DATA: JSON.stringify({
        'type':'poster', // '【common普通；poster海报】',
        'degree_type' :'3*3',
        'pay_total': that.data.moneyTotal,
        'pay_fee': that.data.moneyService,//'发起人手续费',
        'award_first': that.data.moneyNo1,// '冠军奖励',
        'award_two': that.data.moneyNo2,//'亚军奖励',
        'award_third': that.data.moneyNo3,//'季军奖励',
        'award_all': that.data.moneyNo4,// '参与奖励',
        'num_group': that.data.group,// '参与组数',
        'num_person': that.data.group*10,// '参与人数',
        'limit_sex': that.data.radioSex,// '【1男，2女】',
        'limit_distance': that.data.inputDiffDistance,//'限制距离【单位米】',
        "description": that.data.inputDescription,
        'pic': that.data.poster
      })
    }
    common.request("submitActive", that, "form", params);
  },
  onSuccess: function (methodName, res) {
    console.log(methodName);
    console.log(res);
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = ret.data;
        switch (methodName) {
          case 'submitActive':
            common.urlTarget("share");
            break;
          case 'submitImg':
            
            break;
        }

      } else {
        common.showErrorTip(ret || ret.msg);
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
  onUpload: function (result, res, submitName) {  
    let data = JSON.parse(res.data);  
    if (result == "fail" || res.statusCode != 200 || data.code != 200) {
      common.showErrorTip(submitName + "上传失败");
      return false;
    }
    // 上传成功
    let info = data.data.info;
    let pic = app.globalData.imgDir + info.pic;
    console.log(submitName + "服务器图片地址：" + pic);
    switch (submitName) {
      case 'submitPoster':
        that.setData({ poster: pic})
        // let timeStamp = "0";
        // let nonceStr = "0";
        // let pkg = "0";
        // let paySign = "0";
        // let orderId = "0";
        //common.wxpay(timeStamp, nonceStr, pkg, paySign, orderId);
        that.submitActive();
        break;
      case 'submitActiveImg':

        break;
    }
  }
})