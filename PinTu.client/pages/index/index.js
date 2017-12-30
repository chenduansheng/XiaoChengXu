//index.js
//获取应用实例
const app = getApp();
const common = require("../../js/common.js");
var that = '';
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    hasUserInfo: false,
    hasImg:false,
    hasMember:false,
    memberInfo:'',
    imgSrc: '',//../../image/poster001.png
    winWidth: app.globalData.phoneInfo.windowWidth,
    winHeight: app.globalData.phoneInfo.windowHeight,
    canvasHeight:0,
    canvasId:'mycanvas',
    radioInfo:'SHOW',
    radioSex:'all',
    inputWx:'',
    inputName:'',
    inputTel:'',
    inputAddress:'',
    inputCoordinate:'',
    inputDiffDistance:'',
    showMemberInfo: false,
    showCanvas:false,
    showHome:true,
    preX:0,
    preY:0,
    logo:'../../image/camera.png',
    mapInfo:'',
    canvasMarginL: 0,     // 子画布左边距
    canvasMarginT: 0,     // 子画布上边距
    posterW:0,            // 海报宽
    posterH: 0,           // 海报高
    privateInfo:''        // openId等信息
  },
  onLoad: function () {
    that = this;
    let code = wx.getStorageSync("code");
    //console.log("缓存code:"+code);
    console.log(app.globalData);
    let canvasHeight = that.data.winHeight - 50;
    that.setData({
      showHome: true,
      showCanvas: false,
      showMemberInfo: false,
      canvasHeight: canvasHeight,
      canvasMarginL: ((that.data.winWidth-270)/2).toFixed(2),
      canvasMarginT: ((canvasHeight - 270) / 2).toFixed(2),
      preX: ((that.data.winWidth - 270) / 2).toFixed(2),
      preXY: ((canvasHeight - 270) / 2).toFixed(2),
    })
    let params = {
      _C:"Key",
      _A:"getWxId",
      code: code
    }
    common.request("getSessionKey",that,"form",params);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 获取sessionKey

  },
  onShow:function(){
    //console.log("窗口宽高：" + that.data.winWidth + "," + that.data.winHeight);
    //console.log("子画布左、上边距："+that.data.canvasMarginL + "," + that.data.canvasMarginT);
    if (app.globalData.userInfo && app.globalData.userInfo.openId){
      that.getMemberInfo();
    }
    
  },
  getUserInfo: function(e) {      // 获取用户微信信息
    // 判断是否有个人信息
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //console.log("刷新项目");
    //wx.startPullDownRefresh({})
  },
  urlTarget:function(e){
    common.urlTarget(e.currentTarget.dataset.url);
  },
  addImg:function(){              // 点击选择拼图
    if (that.data.hasMember){
      common.showErrorTip("添加图片");
      that.chooseImg();
    }else{
      that.setData({ 
        showHome: false,
        showCanvas:false,
        showMemberInfo: true
      })
    }
    
  },
  chooseImg:function(){
    that.setData({ 
        showHome: false,
        showMemberInfo: false,
        showCanvas: true
    });
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        
        let tempFilePaths = res.tempFilePaths;
        that.getImgInfo(tempFilePaths[0]);        
      }
    })
  },
  delImg:function(){
    that.setData({
      hasImg: false,
      imgSrc: '',
      showHome: true,
      showMemberInfo: false,
      showCanvas: false
    })
  },
  cancel:function(){
    that.delImg();
  },
  next:function(){
    that.exportImg();
  },
  drawImg:function(x,y,w,h){
    let ctx = wx.createCanvasContext(that.data.canvasId);
    ctx.beginPath();
    ctx.setGlobalAlpha(1);
    ctx.drawImage(that.data.imgSrc,x,y,w,h);
    ctx.draw();    
  },
  getImgInfo:function(src){
    wx.getImageInfo({
      src: src,
      success:function(res){
        if(res.width < 270 || res.height < 270){
          common.showErrorTip("图片过小");
          that.setData({
            showHome: true,
            showCanvas: false,
            showMemberInfo: false
          })
        }else{
          that.setData({
            hasImg: true,
            imgSrc: src
          })   
          // 海报首次出现的位置
          that.setData({
            posterW: res.width,
            posterH: res.height,
            showHome: false,
            showMemberInfo: false,
            showCanvas: true
          })          
          //that.drawImg(that.data.canvasMarginL, that.data.canvasMarginT, res.width, res.height);
        }
      }
    })
  },
  exportImg:function(){
    wx.canvasToTempFilePath({
      canvasId: that.data.canvasId,
      x:35,
      y:100,
      width:270,
      height:167,
      destWidth: 270,
      destHeight: 117,
      success:function(res){
        console.log(res);
        that.setData({ imgSrc: res.tempFilePath});
        common.showSuccessTip("图片裁剪成功");
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  changeRadioInfo: function (e) {
    that.setData({ radioInfo: e.detail.value});
  },
  changeRadioSex: function (e) {
    that.setData({ radioSex: e.detail.value });
  },
  getMemberInfo:function(openId){
    let params = {
      _C: 'User',
      _A: 'selectContact',
      openid: openId ? openId : that.data.privateInfo.openId
    }
    common.request("getMemberInfo", that, "form", params);
  },
  submitInfo: function () {
    var flag = false;
    let radioInfo = that.data.radioInfo;
    let inputWx = that.data.inputWx;
    let inputName = that.data.inputName;
    let inputTel = that.data.inputTel;
    let inputAddress = that.data.mapInfo ? that.data.mapInfo.address : '';
    let inputCoordinate = that.data.inputCoordinate;
    let inputDiffDistance = that.data.inputDiffDistance;
    flag = common.verifyNull(inputWx, "微信号");
    flag = common.verifyNull(inputName,"联系人");
    flag && (flag = common.verifyTel(inputTel));
    // flag && (flag = common.verifyNull(inputAddress,"地址"));
    flag = true;
    if(flag){
      let params = {
        _C:"User",
        _A:"updateUser",
        _DATA: JSON.stringify({
          lat: that.data.mapInfo ? that.data.mapInfo.latitude : '',
          lng: that.data.mapInfo ? that.data.mapInfo.longitude : '',
          mobile: inputTel,
          avatarUrl: that.data.userInfo.avatarUrl,
          is_show_info: radioInfo,
          name: inputName,
          nick_name: that.data.userInfo.nickName,
          wx: inputWx,
          address: inputAddress,
          //distance: inputDiffDistance,
          gender: that.data.userInfo.gender,
          city: that.data.userInfo.city,
          logo: that.data.logo
        })        
      }
      //common.showErrorTip("提交会员信息");
      common.request("submitMemberInfo",that,"form",params);
    }    
  },
  getWx:function(e){
    let curVal = e.detail.value;
    that.setData({ inputWx: curVal })
  },
  getName:function(e){
    let curVal = e.detail.value;
    that.setData({ inputName: curVal})
  },
  getTel: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputTel: curVal })
  }, 
  getAddress: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputAddress: curVal })
  },
  getDiffDistance: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputDiffDistance: curVal })
  },
  onSuccess: function (methodName, res) {
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = res.data.data;
        let info = res.data.data.info ? res.data.data.info : '';
        switch (methodName) {
          case 'getMemberInfo':  // 获取会员信息
            if(!info){
              that.setData({
                hasMember: false
              })
            }else{
              that.setData({
                hasMember: true,
                memberInfo: info
              })
            }             
            break;
          case 'submitMemberInfo':  // 提交会员信息
            that.setData({
              hasMember: true,
              showHome: true,
              showCanvas: false,
              showMemberInfo: false
            })
            common.showSuccessTip("提交成功");
            break;
          case 'getSessionKey':
              let params = {
                sessionKey : info.session_key,
                openId : info.openid,
                unionId : info.unionid ? info.unionid : ''
              }
              wx.setStorageSync("pivateInfo", params);
              that.getMemberInfo(info.openid);    // 第一次通过openId获取会员信息
            break;

        }

      } else {
        // 提交会员信息接口有bug
        console.log(res);
        //common.showErrorTip(ret.msg);
        // that.setData({    // bug解决这个需要delete
        //   hasMember: true,
        //   showHome: true,
        //   showCanvas: false,
        //   showMemberInfo: false
        // })
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
  touchStart:function(e){
    console.log("触摸start：");
    console.log(e);
  },
  touchMove:function(e){
    console.log("触摸move：");
    console.log(e);
    setTimeout(function(){
      //that.move(e);
    },500)
  },
  touchEnd:function(e){
    console.log("触摸end：");
    console.log(e);
  },
  move:function(e){
    console.log(e);
    let preX = that.data.preX;
    let preY = that.data.preY;
    let curX = e.changedTouches[0].x;
    let curY = e.changedTouches[0].y;    
    var moveW = curX - preX;
    var moveH = curY - preY;
    //console.log("移动x:"+moveW+",移动y:"+moveH);
    // 判断图像超出子画布
    if (curX > that.data.canvasMarginL || curY > that.data.canvasMarginT){  // 固定左上角
      that.drawImg(that.data.canvasMarginL, that.data.canvasMarginT, that.data.posterW, that.data.posterH);
      //curX = that.data.canvasMarginL;
      //curY = that.data.canvasMarginT;
    // } else if (curX + that.data.posterW < that.data.canvasMarginL || curY + that.data.posterH < curY > that.data.canvasMarginT){   // 固定右下角:海报右下角<子画布右下角
    //   that.drawImg(270 + canvasMarginL - that.data.posterW, 270 + canvasMarginT - that.data.posterH, that.data.posterW, that.data.posterH);
    //   curX = 270 + canvasMarginL - that.data.posterW;
    //   curY = 270 + canvasMarginT - that.data.posterH;
     }else{
      that.drawImg(preX + moveW, preY + moveH, that.data.posterW, that.data.posterH);
    }
    that.setData({
      preX: curX,
      preY: curY
    })
    console.log("海报坐标的变化：(" + preX + "," + preY + "),==>(" + curX + "," + curY + ")");
    console.log(e);
  },
  uploadLogo:function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        that.setData({ logo: res.tempFilePaths[0] });
      }
    })    
  },
  getMap: function () {
    wx.getSetting({
      success: function (res) {    // 地图已授权
        that.chooseMap();
      }
    })
  },
  chooseMap:function(){
    wx.chooseLocation({
      success: function (res) {
        that.setData({mapInfo:res});
      },
      fail:function(){
        wx.openSetting({
            success:function(res){
              console.log("引导用户授权：");
              console.log(res);
            }
        });
      }
    })
  }
})
