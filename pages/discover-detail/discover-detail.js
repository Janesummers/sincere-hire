// pages/discover-detail/discover-detail.js
const req = require('../../utils/request');
const util = require('../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    id: '',
    idx: 0,
    isBack: false,
    page: 1,
    num: 10,
    answerData: [],
    isAttention: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('detail', opt => {
      let {
        data, id, idx
      } = opt;
      this.setData({
        data, id, idx
      })

      if (data[0].answer_num > 0) {
        this.getAnswer();
      }

      this.updateRead(id, idx, data, eventChannel);
      this.checkAttention(id, idx, data);
    })
  },

  updateRead (id, idx, data, eventChannel) {
    req.request('/updateTopicRead', {
      id, idx
    }, 'GET', res => {
      if (res.data.code == 'ok') {
        data[0].topic_read = parseInt(data[0].topic_read) + 1;
        eventChannel.emit('updateContentRead', data[0].topic_read);
        // console.log(res)
        this.setData({
          data
        })
      } else {
        console.error(res.data.data)
      }
    })
  },

  checkAttention (id, idx) {
    req.request('/getOnceAttention', {
      id, idx
    }, 'GET', res => {
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          this.setData({
            isAttention: true
          })
        }
      } else {
        console.error(res.data.data)
      }
    })
  },

  toAnswer () {
    let {
      id, idx, data
    } = this.data;
    let title = data[0].topic_title;
    wx.navigateTo({
      url: '../answer/answer',
      success: res => {
        res.eventChannel.emit('answer', {
          id, idx, title
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isBack) {
      this.setData({
        isBack: false
      })
      this.getAnswer();
    }
  },

  getAnswer () {
    let {
      id,
      idx,
      page,
      num
    } = this.data;
    req.request('/getAnswerList', {
      id,
      idx,
      page,
      num
    }, 'POST', res => {
      let answerData = this.formateData(res.data.data.concat());
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit('updateAnswerNum', answerData.length);
      let data = this.data.data;
      data[0].answer_num = answerData.length;
      this.setData({
        answerData,
        data
      })
    })
  },

  formateData (data) {
    data.forEach(item => {
      let t = Number(item.time);
      let date = new Date(t);
      // 2020-01-01 01:01:01
      let time = util.formatTime(date);
      item.time = time.replace(/\//g, '-');
      item.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}`;
    })
    return data;
  },

  attention () {
    let {
      id,
      idx
    } = this.data;
    req.request('/attentionTopic', {
      id,
      idx
    }, 'GET', res => {
      if (res.data.code == 'ok') {
        wx.showToast({
          title: '关注成功'
        })
        this.setData({
          isAttention: true
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  },

  cancelAttention () {
    let {
      id,
      idx
    } = this.data;
    req.request('/cancelAttention', {
      id,
      idx
    }, 'GET', res => {
      if (res.data.code == 'ok') {
        this.setData({
          isAttention: false
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    })
  }
})