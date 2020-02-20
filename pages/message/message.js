// pages/message/message.js
const base64 = require('../../utils/base64').Base64;
const req = require('../../utils/request');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isDone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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
    this.getData();
  },

  toDetail (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/msg-detail/msg-detail?id=${id}`
    })
  },

  getData () {
    this.setData({
      isDone: false
    })
    let unionid = wx.getStorageSync('unionid');
    req.request('/getMessageList', { id: base64.encode(unionid)}, 'POST', (res) => {
      let list = res.data.data;
      list.forEach(item => {
        if (item.avatarUrl) {
          item.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}`
        }
      })
      this.setData({
        list,
        isDone: true
      })
    })
  }
})