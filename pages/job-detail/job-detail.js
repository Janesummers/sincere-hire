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
    newChat: true,
    isDone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let job_id = options.jobId;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('isCollect', data => {
      this.setData({
        isCollect: data.isCollect
      })
    })
    this.getData(job_id);
  },

  getData (job_id) {
    req.request('/getJobDetail', {
      job_id
    }, 'POST', res => {
      console.log(res);
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          let detail = this.formatData(res.data.data.concat());
          this.isChat(detail);
        }
      } else {
        console.error('获取职位详情错误');
      }
    })
  },

  isChat (detail) {
    var chats = wx.getStorageSync('chat');
    if (chats) {
      var chatList = Object.keys(chats)
      if (chatList.includes(base64.encode(detail.publisher_id))) {
        this.setData({
          btnText: '继续聊天',
          newChat: false
        })
      }
    }
    this.setData({
      detail,
      rule: app.globalData.userInfo.rule,
      isDone: true
    });
  },

  formatData(data) {
    let item = data[0];
    let detail;
    let t = new Date().getFullYear();
    var small_time = item.update_date.match(/[^\s]+/g)[0];
    var time = small_time.match(/[^-]+/)[0] < t ? small_time : small_time.replace(/[^-]+\-/, '');
    let isCollect = item.col_job_id ? true : false;
    detail = {
      id: item.job_id,
      position: item.job_name,
      location: item.city,
      display: item.display,
      job_type: item.job_type,
      other_require: item.other_require.split('|'),
      people: item.recruit,
      company_type: item.company_type,
      company: item.company_name,
      company_size: item.company_size,
      price: item.salary,
      edu_level: item.edu_level,
      working_exp: item.working_exp,
      time,
      collect: isCollect,
      publisher_id: item.publisher_id,
      publisher_name: item.publisher_name,
      publisher_position: item.position
    };
    return detail;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  collect () {
    let job_id = this.data.detail.id;
    let collectData = this.data.detail.collect;
    collectData = collectData ? '1' : '0';
    this.setData({
      ["detail.collect"]: !this.data.detail.collect,
      tapCollect: false
    })
    const eventChannel = this.getOpenerEventChannel();
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
        commit_name: app.globalData.userInfo.name || app.globalData.userInfo.nickname
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