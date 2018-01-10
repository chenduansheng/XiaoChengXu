// pages/generatePuzzles/generatePuzzles.js
const app = getApp();
const common = require("../../js/common.js");
var that = '';
var curArrIndex = 0;    // 当前活动图片数组下标
Page({
  data: {
    moneyNo1:'',
    moneyNo2: '',
    moneyNo3: '',
    moneyNo4: '',
    moneyTotal: '',
    group:10,
    moneyService:0.01,
    diffDistance:'',
    radioSex:'',
    inputDiffDistance:'',
    inputDescription:'',
    logo: '../../image/camera.png',
    poster:'../../image/poster001.png',
    onlinePoster:'',
    arrActive: ['../../image/camera.png']
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
    curVal = parseInt(curVal);
    that.setData({ inputDiffDistance: curVal })
  },
  getDescription: function (e) {
    let curVal = e.detail.value;
    if (curVal.length <= 140){
      that.setData({ inputDescription: curVal })
    }else{
      common.showErrorTip("最多140字符");
    }
    
  },
  chooseImg: function (e) {
    curArrIndex = e.currentTarget.dataset.index;
    wx.showLoading({
      title: '图片加载中...',
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        let tempFilePaths = res.tempFilePaths;
        //that.setData({ logo: tempFilePaths[0] });
        let params = {
          path: "act"
        }
        console.log("上传的图片文件：" + tempFilePaths[0]);
        common.uploadFile(that, "submitActiveImg", tempFilePaths[0], params);    
      },
      fail:function(){
        wx.hideLoading();
      }
    })
  },
  getNo1:function(e){
    var no1 = parseFloat(e.detail.value);
    if (!no1 || no1 < 1) {
      common.showErrorTip("冠军最低1元");
      no1 = 1;
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
    let no2 = no1 * 0.5;
    let no3 = no2 * 0.5;
    let no4 = no3 * 0.5;
    let group = that.data.group;
    let moneyService = that.data.moneyService;
    let moneyTotal = parseFloat(moneyService) + group * (no1 + no2 + no3 + no4 * 7);
    that.setData({
      moneyNo1: no1.toFixed(2),
      moneyNo2: no2.toFixed(2),
      moneyNo3: no3.toFixed(2),
      moneyNo4: no4.toFixed(2),
      moneyTotal: moneyTotal.toFixed(2),
      moneyService: (moneyTotal * 0.02).toFixed(2)
    })
  },
  clickGenerate:function(){ 
    if (!that.data.moneyNo1){
      common.showErrorTip("请先完善信息");
      return false;
    }
    wx.showLoading({
      title: '信息提交中...',
    })
    let params = {
      path: "act/poster"
    }
    setTimeout(function(){
      common.uploadFile(that, "submitPoster", that.data.poster, params);
    },300)
    
  },
  submitActive:function(){   
    var arrActive = that.data.arrActive.concat();
    if (arrActive.includes("../../image/camera.png")) { // 有"../../image/camera.png"
      arrActive.splice(-1, 1);   // 需要提交的活动图片数组
    }
    for (let [index, elem] of arrActive.entries()) {
      arrActive[index] = elem.replace(app.globalData.imgDir, '');
    } 
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
        'pic': that.data.onlinePoster,
        "description_pic": arrActive
      })
    }
    common.request("submitActive", that, "form", params);
  },
  onSuccess: function (methodName, res) {
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = ret.data;
        let info = data.info;
        switch (methodName) {
          case 'submitActive':
            common.urlTarget("share","","?aid="+data.id+"&poster="+that.data.poster);
            break;
          case 'submitImg':
            
            break;
          case 'getWxPayInfo':
            let timeStamp = info.timeStamp;
            let nonceStr = info.nonceStr;
            let pkg = info.package;
            let paySign = info.paySign;
            let orderId = '';  
            wx.hideLoading();          
            common.wxpay(timeStamp, nonceStr, pkg, paySign,that);            
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
    console.log(res);
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
        that.setData({ onlinePoster: info.pic})
        let params = {
          _C:'Pay',
          _A:'get',
          // money: that.data.moneyTotal
          money: 0.01
        }
        common.request("getWxPayInfo", that, "form", params);        
        break;
      case 'submitActiveImg':
        var arrActive = that.data.arrActive.concat();
        if (arrActive.length <= 6){
          arrActive[curArrIndex] = pic;
          if (curArrIndex >= arrActive.length - 1 && arrActive.length != 6){  // 当前下标是当前展示的最后一个，则可添加新的图片
            arrActive[arrActive.length] = "../../image/camera.png";
          }          
        }
        that.setData({ arrActive: arrActive});
        wx.hideLoading();
        break;
    }
  },
  onWxPay: function (result,res){
    if (result == "success"){
      that.submitActive();
    }
  }
})