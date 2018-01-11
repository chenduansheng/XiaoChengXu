// pages/my/my.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({
  data: {
    userInfo:'',
    balance:0,
    posterNum:134
  },
  onLoad: function (options) {
    that = this;
    // let _DATA = {
    //   'type' :'5',// 活动id
    //   'money' :6.6
    // }
    // let params = {
    //   _C: 'Money',
    //   _A: 'insertOne',
    //   _DATA: JSON.stringify(_DATA)
    // }
    // common.request("insertMoney", that, "form", params);
  },
  onReady: function () {
    
  },
  onShow: function () {
    that.setData({ userInfo: app.globalData.userInfo })
    let params = {
      _C:'Money',
      _A:'selectOne'
    }
    common.request("getBalance", that, "form", params);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  urlTarget: function (event) {
    const url_name = event.currentTarget.dataset.url;    
    var params = "";
    if (url_name == "myPuzzles"){
      const curType = event.currentTarget.dataset.type;
      params = "?type=" + curType;

    }
    common.urlTarget(url_name,"",params);
  },
  onSuccess: function (methodName, res) {
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = ret.data;
        let info = data.data;
        switch (methodName) {
          case 'getBalance':
            var curBalance = 0.0;
            if(info){
              curBalance = info.money;
            }
            that.setData({ balance: curBalance})
            break;
        }

      } else {
        console.log(ret);
        // common.showErrorTip(ret.msg);
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