// search/search.js
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: [],
    keyWord: '',
    focus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  toJobDetail (e) {
    let job_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?jobId=${job_id}`
    })
  },

  put (e) {
    let value = e.detail.value;
    this.setData({
      keyWord: value
    })
  },

  search () {
    let keyWord = this.data.keyWord;

    req.request('/searchJob', {
      keyWord
    }, 'POST', res => {
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          let station = this.formatData(res.data.data.concat());
          this.setData({
            station
          })
        }
      } else {
        console.error('请求数据失败')
      }
    })
  },

  formatData(data) {
    let jobList = data;
    let station = [];
    let t = new Date().getFullYear();
    jobList.forEach(item => {
      var small_time = item.update_date.match(/[^\s]+/g)[0];
      var time = small_time.match(/[^-]+/)[0] < t ? small_time : small_time.replace(/[^-]+\-/, '');
      station.push({
        id: item.job_id,
        position: item.job_name,
        location: item.city,
        job_type: item.job_type,
        people: item.recruit,
        company_type: item.company_type,
        company: item.company_name,
        price: item.salary,
        time
      });
    });
    return station;
  }
})