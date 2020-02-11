// pages/live-resume/live-resume.js
const app = getApp();
const req = require('../../utils/request');
const EventProxy = require('../../utils/eventproxy');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userEducation: null,
    isBack: false,
    userWork: null
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
    let ep = new EventProxy();

    req.request('/getUserEducation', null, 'GET', (res) => {
      if (res.data.code == 'ok') {
        let education = res.data.data;
        ep.emit('edu', education);
      } else {
        ep.emit('error', res.data.data);
      }
    })

    req.request('/getUserWork', null, 'GET', (res) => {
      if (res.data.code == 'ok') {
        let work = res.data.data;
        ep.emit('work_experience', work);
      } else {
        ep.emit('error', res.data.data);
      }
    })

    ep.all('edu', 'work_experience', (edu, work) => {
      this.setData({
        userEducation: edu,
        userWork: work,
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