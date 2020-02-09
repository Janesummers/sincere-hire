// pages/live-resume/live-resume.js
const app = getApp();
const req = require('../../utils/request');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userEducation: null,
    isBack: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo
      });
      this.getData()
    } catch(e) {

    }
  },

  onShow () {
    let isBack = this.data.isBack;
    if (isBack) {
      this.getData();
    }
  },

  getData () {
    req.request('/getUserEducation', null, 'POST', (res) => {
      let education = res.data.data;
      this.setData({
        userEducation: education,
        isBack: false
      })
    })
  },

  toPage (e) {
    let path = e.target.dataset.path;
    wx.navigateTo({
      url: `../${path}/${path}`
    })
  }
})