// pages/beginPuzzles/beginPuzzles.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
var intervalUseTime = '';
var arrSmallPics = [];
var arrPic0 = [];
var arrPic = [];
Page({
  data: {
    gid: '',       // 群id
    aid: '',       // 活动id
    ainfo: '',     // 海报信息
    avatar: '',
    posterSrc: '',
    showPuzzle: false,
    useTime: 0,
    // test1:'../../image/poster2018.png',
    // test2: '../../image/2018.png',
    preIndex: '',
    prePic: '',
    arrPic0: [],   // 原始九宫格
    arrPic: [],   // 交换后的九宫格
    curGroup: [],   // 当前组信息
    hasMe: '',     // 是否已拼过该海报
    canvasId: 'myCanvas',
    imgDir:'',
    showSuccessModal: true
  },
  onLoad: function (options) {
    that = this;
    let aid = options.aid;
    let gid = options.gid;
    that.setData({
      imgDir: app.globalData.imgDir,
      aid: aid ? aid : 31,
      gid: gid ? gid : ''
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onReady: function () {

  },
  onUnload:function(){
    arrSmallPics = [];
    arrPic0 = [];
    arrPic = [];
    clearInterval(intervalUseTime);
    that.setData({ useTime:0})    
  },
  onShow: function () {    
    that.setData({
      avatar: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '../../image/2018.png',
      useTime:0,
      imgDir: app.globalData.imgDir
    });
    clearInterval(intervalUseTime);
    that.getActiveInfo();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ret) {
    var diffPeople = 10 - that.data.curGroup.list.length;
    return {
      title: "【仅剩" + diffPeople+"人】快来拼图赢赏金",
      path: "/pages/index/index?aid=" + that.data.aid,
      // imageUrl:"../../image/2018.png",
      success: function (res) {
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: function (res) {       // 将encryptedData、iv传给后台解密=>获取群id
            console.log("beginPuzzles界面转发成功：");
            console.log(res);
          },
          fail: function (res) {
            console.log("beginPuzzles界面转发失败：");
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log("beginPuzzles转发失败，来自：" + ret.from);
        console.log(res);
      }
    }
  },
  getActiveInfo: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let params = {
      _C: 'Act',
      _A: 'selectOne',
      id: that.data.aid,
      group_id: that.data.gid
    }
    common.request("getActiveInfo", that, "form", params);
  },
  urlTarget: function (e) {
    const name = e.currentTarget.dataset.url;
    common.urlTarget(name, "switchTab");
  },
  openPuzzle: function () {
    let ainfo = that.data.ainfo;
    if (that.data.curGroup.is_finish){         // 1代表活动结束
      common.showErrorTip("此拼图活动结束");
      //return false;
    }
    if (that.data.hasMe) {
      common.showErrorTip("此拼图您已玩过");
      return false;
    }
    if (ainfo.limit_sex > 0) {           // 性别限制1男，2女
      if (ainfo.limit_sex != app.globalData.userInfo.gender) {
        ainfo.limit_sex==1 && common.showErrorTip("男生才能玩");
        ainfo.limit_sex== 2 && common.showErrorTip("女生才能玩");
        return false;
      }
    }
    if (ainfo.limit_distance < 0) {     // 距离限制
      // 计算当前用户与海报距离
      let posterLat = ainfo.user_info.lat;
      let posterLng = ainfo.user_info.lng;
      //let userMap = that.openScopeMap();    // --------- 需要做异步处理
      // let intervalMap = setInterval(function(){

      // });
      //var distance = that.getDistance(posterLat, posterLng, userMap.latitude, userMap.longitude);
      // var distance = that.getDistance(posterLat, posterLng, 28.23529, 112.93134); // km
      // if (ainfo.limit_distance < distance){
      //   let diffDistace = (distance - ainfo.limit_distance).toFixed(2);
        //common.showErrorTip("超出范围" + diffDistace+"km");
        //return false;
      // }
      that.openScopeMap();

    }else{
      // 切割的图片数组打散
      if (!arrPic0) {
        setTimeout(function () {
          that.viewPuzzle();
        }, 300)
      } else {
        that.viewPuzzle();
      }

    }    
    
  },
  viewPuzzle:function(){
    that.randomPics();    
  },
  startAddTime:function(){
    that.setData({ showPuzzle: true });
    var time = 0;
    intervalUseTime = setInterval(function () {
      time += 1;
      that.setData({ useTime: time })
    }, 1000)
  },
  cancelGame: function () {
    clearInterval(intervalUseTime);
    that.setData({
      showPuzzle: false,
      useTime: 0,
      preIndex: '',
      prePic: '',
      arrPic: that.data.arrPic0   // 恢复原九宫格位置
    })
    arrPic = arrPic0.concat();
  },
  onSuccess: function (methodName, res) {
    console.log(methodName);
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = ret.data;
        let info = data.info;
        switch (methodName) {
          case 'getActiveInfo':
            if (info) {
              var curInfo = info;
              let poster = app.globalData.imgDir + info.pic
              //curInfo.pic = poster;
              that.setData({
                ainfo: curInfo,
                posterSrc: poster,
                curGroup: data.user_data_one_group,
                hasMe: data.is_i_in,
                gid: data.group_id
              })
              wx.hideLoading();
              that.canvas();
            }
            break;
          case 'insertResult':
            that.setData({
              showPuzzle: false
            })
            // 提示成功以及最终用时


            // 更新当前组海报排名
            that.getActiveInfo();
            break;
        }

      } else {

        console.log(ret);
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
  exchangePic: function (e) {
    let dataset = e.currentTarget.dataset;
    let curIndex = dataset.index;
    let curPic = dataset.src;
    if (!that.data.preIndex) {
      that.setData({
        preIndex: curIndex,
        prePic: curPic
      })
    } else {
      // 交换
      let arrPic0 = that.data.arrPic0;
      var arrPic = that.data.arrPic;
      let preIndex = that.data.preIndex;
      let prePic = that.data.prePic;
      arrPic[preIndex] = curPic;
      arrPic[curIndex] = prePic;
      that.setData({
        arrPic: arrPic
      })
      var flag = true;
      for (let [index, elem] of arrPic.entries()) {
        if (elem != arrPic0[index]) {
          flag = false;
        }
      }
      if (flag) {
        common.showSuccessTip("拼图成功！");
        clearInterval(intervalUseTime);
        // 插入一条成绩
        let _DATA = {
          'act_id': that.data.aid,// 活动id
          'group_id': that.data.gid,//分组id
          'use_time': that.data.useTime,// 用时
        }
        let params = {
          _C: 'Act',
          _A: 'insertUser',
          _DATA: JSON.stringify(_DATA)
        }
        common.request("insertResult", that, "form", params);
      }
      // 交换完毕清空上一次的
      that.setData({
        preIndex: '',
        prePic: ''
      })
    }
  },
  randomPics: function () {    
    var flag = false;   // 记录是否打散
    var arrPic = [];
    wx.showLoading({
      title: '加载中...',
    })
    let intervalArr = setInterval(function(){
      arrPic = arrPic0.concat();
      arrPic = arrPic.sort(function () {
        console.log("打散中...");
        flag = true;
        return (0.5 - Math.random());
      })
      if (flag){
        that.setData({
          arrPic: arrPic
        })
        that.startAddTime();
        clearInterval(intervalArr);
        console.log("打散成功...");
        wx.hideLoading();
      }
    },200);
    
  },
  canvas: function () {
    var tempPoster = '';
    wx.getImageInfo({
      src: that.data.posterSrc, //"https://pintu.xizai.com/meinv1.jpg"
      success:function(res){
        //console.log(res);
        tempPoster = res.path;
        var arrSmallPics = [];
        let ctx = wx.createCanvasContext(that.data.canvasId);
        ctx.setGlobalAlpha(0.8);
        ctx.drawImage(tempPoster, 0, 0, 270, 270);
        ctx.draw();
        setTimeout(function () {
          that.getSmallPics(0);
        }, 500)
      },
      fail:function(res){
        console.log(res);
      }
    })
    
  },
  getSmallPics: function (index, x, y) {
    let nextIndex = index + 1;
    wx.canvasToTempFilePath({
      x: x,
      y: y,
      width: 90,
      height: 90,
      destWidth: 90,
      destHeight: 90,
      canvasId: that.data.canvasId,
      success: function (res) {
        if (index < 9) {
          arrSmallPics[index] = res.tempFilePath;
          that.getSmallPics(nextIndex, (nextIndex % 3) * 90, parseInt(nextIndex / 3) * 90);
          //console.log(index + "---" + arrSmallPics[index]);
          if (index == 8) {
            arrPic0 = arrSmallPics;
            arrPic = arrPic0.concat();
            that.setData({
              arrPic0: arrSmallPics,
              arrPic: arrSmallPics,
            })
          }
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  getDistance: function (lat1, lng1, lat2, lng2){     // 两个经纬度间的距离
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s;
  },
  openScopeMap: function () {    // 开启地图授权
    wx.getLocation({
      success: function (res) {        
        console.log("用户当前latitude:" + res.latitude);
        console.log("用户当前longitude:" + res.longitude);
        let ainfo = that.data.ainfo;
        let posterLat = ainfo.user_info.lat;
        let posterLng = ainfo.user_info.lng;
        let userMap = res;
        var distance = that.getDistance(posterLat, posterLng, userMap.latitude, userMap.longitude);// km
        console.log("海报posterLat:" + posterLat + "，posterLng：" + posterLng);
        console.log("拼图者latitude:" + userMap.latitude + "，longitude：" + userMap.longitude);
        if (ainfo.limit_distance < distance) {
          let diffDistace = (distance - ainfo.limit_distance).toFixed(2);
          common.showErrorTip("超出范围" + diffDistace+"km");
          console.log(("超出范围" + diffDistace + "km"));
          //return false;
        }else{
          if (!arrPic0) {
            setTimeout(function () {
              that.viewPuzzle();
            }, 300)
          } else {
            that.viewPuzzle();
          }
          //return true;
        }
      },
      fail: function () {
        common.showErrorTip("位置未授权");
        setTimeout(function () {
          that.openSetting();
        }, 1500)
      }
    })

  },
  openSetting: function () {   // 打开授权设置引导界面
    wx.openSetting({
      success: function (res) {
        if (res.authSetting['scope.userLocation']) {
          that.openScopeMap();
        }
      }
    });
  },
  contactPoster:function(){
    wx.makePhoneCall({
      phoneNumber: that.data.ainfo.user_info.mobile.toString(),
    })
  },
  priviewImg:function(e){
    let curIndex = e.currentTarget.dataset.index;
    let curSrc = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [curSrc],
      success:function(res){

      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  closeSuccessModal: function () {
    that.setData({ showSuccessModal: false })
  }
})