// pages/ranking/ranking.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
var interval = '';
Page({
  data: {
    aid:'',
    ainfo:'',
    avatar: '',
    posterSrc:'',
    showPuzzle:false,
    useTime:0,
    test1:'../../image/poster2018.png',
    test2: '../../image/2018.png',
    preIndex:'',
    prePic:'',
    arrPic0:[],   // 原始九宫格
    arrPic: []    // 交换后的九宫格
  },
  onLoad: function (options) {
    that = this;
    that.setData({ aid: options.aid})
    that.setData({ aid: 3 })
  },
  onReady: function () {
  
  },
  onShow: function () {
    that.setData({ avatar: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '../../image/2018.png' });
    let params = {
      _C:'Act',
      _A:'selectOne',
      id:that.data.aid
    }
    common.request("getActiveInfo", that,"form", params);
    var arrPic = [];
    arrPic[0] = '../../image/poster2018.png';
    arrPic[1] = '../../image/poster2018.png';
    arrPic[2] = '../../image/poster2018.png';
    arrPic[3] = '../../image/2018.png';
    arrPic[4] = '../../image/2018.png';
    arrPic[5] = '../../image/2018.png';
    arrPic[6] = '../../image/2018.png';
    arrPic[7] = '../../image/2018.png';
    arrPic[8] = '../../image/2018.png';
    that.setData({
      arrPic0:arrPic,
      arrPic: arrPic
    })
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
    interval = setInterval(function(){
      time += 1;
      that.setData({useTime:time})
    },1000)
  },
  cancelGame:function(){
    clearInterval(interval);
    that.setData({
      showPuzzle:false,
      useTime:0,
      preIndex:'',
      prePic:'',
      arrPic: that.data.arrPic0
    })
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
            if(info){
              var curInfo = info;
              let poster = app.globalData.imgDir + info.pic
              //curInfo.pic = poster;
              that.setData({ 
                ainfo: curInfo,
                posterSrc: poster
              })
            }
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
    if (!that.data.preIndex){
      that.setData({
        preIndex: curIndex,
        prePic: curPic
      })
    }else{
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
      if (arrPic == arrPic0){
        console.log("拼图成功！");
        common.showSuccessTip("拼图成功！");
      }

      // 交换完毕清空上一次的
      that.setData({
        preIndex: '',
        prePic: ''
      })
    }
  }
})