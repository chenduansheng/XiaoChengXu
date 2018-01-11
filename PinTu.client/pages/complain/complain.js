// pages/complain/complain.js
const app = getApp();
const common = require('../../js/common.js');
var that = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrCheckbox:[
      { name: "欺诈", value:"qizha"},
      { name: "色情", value: "seqing" },
      { name: "政治谣言", value: "zzyy" },
      { name: "诱导分享", value: "ydfx" },
      { name: "恶意营销", value: "eyyx" },
      { name: "隐私信息收集", value: "ysxxsj" }
    ],
    arrChecked:[]
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
  submitComplain:function(){
    common.showErrorTip("暂无接口");
  },
  changeCheckBox:function(e){
    var arrCheckbox = that.data.arrCheckbox;
    var arrChecked = e.detail.value;
    for (let [index, elem] of arrCheckbox.entries()){
      arrCheckbox[index].checked = false;
      for (let [i, ele] of arrChecked.entries()){
        if(ele == elem.value){
          arrCheckbox[index].checked = true;
          break;
        }
      }
    }
    that.setData({ arrCheckbox: arrCheckbox})
  }
})