// pages/invite-detail/invite-detail.js
const req = require('../../utils/request');
const base64 = require('../../utils/base64').Base64;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    data: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('detail', opt => {
      let {
        id, data
      } = opt;
      this.setData({
        data, id
      })
    })
  },

  allow () {
    let info = this.data.data;
    let unionid = wx.getStorageSync('unionid');
    let chatList = wx.getStorageSync('chat');
    let time = this.getTime();
    let acceptId = base64.encode(info.invite_user_id);
    let all = {
      data: '系统：[同意面试邀请]',
      sendId: base64.encode(unionid),
      acceptId,
      time,
      type: 'allowInvite'
    };
    if (chatList) {
      if (chatList[acceptId]) {
        chatList[acceptId].push(all);
      } else {
        chatList[acceptId] = [all]
      }
      wx.setStorageSync('chat', chatList);
    } else {
      let obj = {};
      obj[acceptId] = [all]
      wx.setStorageSync('chat', obj);
    }
    let data = JSON.stringify({
      msg: '系统：[同意面试邀请]',
      client: base64.encode(unionid),
      to: acceptId,
      time: all.time,
      name: app.globalData.userInfo.name || app.globalData.userInfo.nickname,
      type: 'allowInvite',
      read: false
    })
    wx.sendSocketMessage({
      data,
      success: () => {
        this.updateInvite();
      }
    })
  },

  getTime () {
    return new Date().getTime().toString();
  },

  updateInvite () {
    req.request('/updateInvite', null, 'GET', res => {

    })
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

  }
})