// pages/message/message.js
const base64 = require('../../utils/base64').Base64;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let unionid = wx.getStorageSync('unionid');
    wx.request({
      url: `${app.globalData.UrlHeadAddress}/getMessageList`,
      method: 'POST',
      data: { id: base64.encode(unionid)},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        console.log(res.data.data)
        let list = res.data.data;
        this.setData({
          list
        })
      },
      fail: function() {
        // fail
      }
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

  },

  toDetail (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/msg-detail/msg-detail?id=${id}`
    })
  }
})