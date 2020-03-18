// pages/invite-list/invite-list.js
const req = require('../../utils/request');
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
    req.request('/getInviteList', null, 'GET', res => {
      let data = res.data.data.concat();
      data.forEach(item => {
        item.update_time = Number(item.update_time);
        item.time = this.formatTime(item.update_time);
        item.avatarUrl = item.avatarUrl ? `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}` : '';
        switch (item.status) {
          case 0:
            item.status = '待同意';
            break;
          case 1:
            item.status = '已拒绝';
            break;
          default:
            item.status = '已过期';
        }
      })
      this.setData({
        list: data
      })
    })
  },

  formatTime (t) {
    let date = new Date(t);
    let today = new Date();
    if (today.getFullYear() == date.getFullYear()) {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } else {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },

  toDetail (e) {
    let id = e.currentTarget.dataset.id;
    let list = this.data.list;
    let index = -1;
    let data = list.filter((item, i) => {
      if (item.invite_id  == id) {
        index = i;
        return item;
      }
    });
    wx.navigateTo({
      url: '../invite-detail/invite-detail',
      events: {
        updateStatus: res => {
          
        }
      },
      success: res => {
        res.eventChannel.emit('detail', {
          id,
          data: data[0]
        })
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

  }
})