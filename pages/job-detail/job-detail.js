// pages/job-detail/job-detail.js
const req = require('../../utils/request');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    tapCollect: true,
    isCollect: false,
    rule: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('job_detail', data => {
      data = JSON.parse(JSON.stringify(data));
      data.other_require = data.other_require.split('|');
      // data.job_type = data.job_type.split('/')[0];
      this.setData({
        detail: data,
        rule: app.globalData.userInfo.rule
      });
    })
    eventChannel.on('collect', data => {
      console.log(data)
      this.setData({
        isCollect: data
      })
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

  collect () {
    let job_id = this.data.detail.id;
    let collectData = this.data.detail.collect;
    collectData = collectData ? '1' : '0';
    this.setData({
      ["detail.collect"]: !this.data.detail.collect,
      tapCollect: false
    })
    const eventChannel = this.getOpenerEventChannel()
    if (!this.data.isCollect) {
      eventChannel.emit('changeCollect', this.data.detail.collect);
    }
    req.request('/setCollect', {
      job_id,
      collectData
    }, 'GET', res => {
      this.setData({
        tapCollect: true
      })
      if (res.data.code == 'ok') {
        if (this.data.detail.collect) {
          wx.showToast({
            title: '收藏成功'
          })
        } else {
          wx.showToast({
            title: '取消收藏',
            icon: 'none'
          })
        }
        if (this.data.isCollect) {
          eventChannel.emit('delCollect');
        }
      } else {
        this.setData({
          ["detail.collect"]: !this.data.detail.collect
        })
        if (!this.data.isCollect) {
          eventChannel.emit('changeCollect', this.data.detail.collect);
        }
        wx.showToast({
          title: '收藏失败',
          icon: 'none'
        })
      }
    })
  }
})