// pages/topic-list/topic-list.js
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadMore: false,
    page: 1,
    num: 10,
    isAll: false,
    isToDetail: false,
    hotTopic: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      isAll: false
    })
    this.getData();
  },

  getData () {
    this.setData({
      loadMore: true
    })
    wx.showLoading({
      title: '载入中'
    })
    req.request('/getAttentionList', {
      page: this.data.page,
      num: this.data.num
    }, 'POST', res => {
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          if (this.data.page == 1) {
            let hotTopic = this.formatData(res.data.data.concat());
            this.setData({
              hotTopic,
              page: this.data.page + 1,
              loadMore: false
            })
          } else {
            let data = this.formatData(res.data.data.concat());
            let hotTopic = this.data.hotTopic.concat(data);
            this.setData({
              hotTopic,
              page: this.data.page + 1,
              loadMore: false
            })
          }
          wx.hideLoading();
        } else {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
          this.setData({
            isAll: true,
            loadMore: false
          })
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      } else {
        console.error('请求数据失败')
      }
    })
  },

  formatData (data) {
    data.forEach(item => {
      let titles = item.topic_title.match(/[^#]+/g);
      let content = item.toppic_content.split('|');
      item.toppic_content = content[0];
      item.content = content;
      if (titles.length > 1) {
        let len = titles.length - 1;
        item.topic_title = titles[len];
        item.topic = titles.slice(0, -1);
      } else {
        item.topic_title = titles[0];
      }
    })
    return data;
  },

  onReachBottom: function () {
    if (!this.data.isAll && !this.data.loadMore && this.data.selectIndex == 0) {
      this.getData()
    }
  },

  toDetail (e) {
    let {
      id,
      idx
    } = e.currentTarget.dataset;
    idx = parseInt(idx);
    let data = this.data.hotTopic.filter(item => item.topic_id === id && item.id === idx);
    wx.navigateTo({
      url: '../discover-detail/discover-detail',
      events: {
        updateContentRead: res => {
          let hotTopic = this.data.hotTopic;
          hotTopic.forEach(item => {
            if (item.topic_id === id && item.id === idx) {
              item.topic_read = res;
            }
          });
          this.setData({
            hotTopic
          })
        },
        updateAnswerNum: res => {
          let hotTopic = this.data.hotTopic;
          hotTopic.forEach(item => {
            if (item.topic_id === id && item.id === idx) {
              item.answer_num = res;
            }
          });
          this.setData({
            hotTopic
          })
        }
      },
      success: res => {
        this.setData({
          isToDetail: true
        })
        res.eventChannel.emit('detail', {
          id,
          idx: data[0].id,
          data
        })
      }
    })
  }
})