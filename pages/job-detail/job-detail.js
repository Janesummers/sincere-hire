// pages/job-detail/job-detail.js
const req = require('../../utils/request');
const app = getApp();
const base64 = require('../../utils/base64').Base64;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    tapCollect: true,
    isCollect: false,
    rule: '',
    btnText: '发起聊天',
    newChat: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chats = wx.getStorageSync('chat');
    
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('job_detail', data => {
      data = JSON.parse(JSON.stringify(data));
      data.other_require = data.other_require.split('|');
      // data.job_type = data.job_type.split('/')[0];
      if (chats) {
        var chatList = Object.keys(chats)
        if (chatList.includes(base64.encode(data.publisher_id))) {
          this.setData({
            btnText: '继续聊天',
            newChat: false
          })
        }
      }
      
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
  },

  toChat (e) {
    wx.showLoading({
      title: '载入中'
    })
    let publisher_id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    console.log(this.data.detail)
    if (this.data.newChat) {
      let company = e.currentTarget.dataset.company;
      req.request('/saveMessageList', {
        id: publisher_id,
        name,
        company,
        commit_name: app.globalData.userInfo.name
      }, 'POST', res => {
        
        if (res.data.code != 'error') {
          wx.hideLoading();
          wx.navigateTo({
            url: `/pages/msg-detail/msg-detail?id=${publisher_id}&name=${name}`
          })
        } else {
          wx.showToast({
            title: '异常，请稍后再试!',
            icon: 'none'
          })
        }

      })
    } else {
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/msg-detail/msg-detail?id=${publisher_id}&name=${name}`
      })
    }
    
  }
})