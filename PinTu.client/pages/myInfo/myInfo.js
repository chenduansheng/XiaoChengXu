// pages/myInfo/myInfo.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    inputWx: '',
    inputName: '',
    inputTel: '',
    inputAddress: '',
    inputCoordinate: '',
    inputDiffDistance: '',
    logo: '../../image/camera.png'
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that.setData({
      userInfo: app.globalData.userInfo
    })
    that.getMemberInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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
  urlTarget: function (e) {
    const name = e.currentTarget.dataset.url;
    common.urlTarget(name, "", "?aid=" + that.data.aid);
  },
  getWx: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputWx: curVal })
  },
  getName: function (e) {
    let curVal = e.detail.value;
    that.setData({ inputName: curVal })
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
  chooseMap: function () {
    wx.chooseLocation({
      success: function (res) {
        that.setData({ mapInfo: res });
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  getMemberInfo: function (openId) {
    let params = {
      _C: 'User',
      _A: 'selectOne'
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
    let inputDeclaration = that.data.inputDeclaration;
    flag = common.verifyNull(inputWx, "微信号");
    flag && (flag = common.verifyNull(inputName, "联系人"));
    flag && (flag = common.verifyTel(inputTel));
    // flag && (flag = common.verifyNull(inputAddress,"地址"));
    if (flag) {
      let params = {
        _C: "User",
        _A: "updateOne",
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
          //declaration: inputDiffDistance,
          //distance: inputDiffDistance,
          gender: that.data.userInfo.gender,
          city: that.data.userInfo.city,
          logo: that.data.logo
        })
      }
      //common.showErrorTip("提交会员信息");
      common.request("submitMemberInfo", that, "form", params);
    }
  },
  onSuccess: function (methodName, res) {
    if (res.statusCode == 200) {
      let ret = res.data;
      if (ret.code == 200) {
        let data = res.data.data;
        let info = res.data.data.info ? res.data.data.info : '';
        switch (methodName) {
          case 'getMemberInfo':  // 获取会员信息
            console.log("会员信息获取成功");
            if (!info) {
              that.setData({
                hasMember: false
              })
            } else {
              let mapInfo = {
                "address": info.address
              }
              that.setData({
                hasMember: true,
                memberInfo: info,
                inputWx: info.wx,
                inputName: info.name,
                inputTel: info.mobile,
                mapInfo: mapInfo,
                logo: app.globalData.imgDir + info.logo
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
            common.showSuccessTip("保存成功");
            setTimeout(function(){
              common.urlTarget("","switchTab");

            },1500)
            break;

        }

      } else {
        // 提交会员信息接口有bug
        console.log(res);
      }
    } else {
      console.log("接口有问题：" + methodName);
    }
  },
  onFail: function (methodName) {
    console.log("接口调用失败：" + methodName);
  },
  onComplete: function (methodName) {

  }
})