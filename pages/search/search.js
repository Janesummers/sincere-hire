// search/search.js
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: [],
    keyWord: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中'
    // })
    // req.request('/getPracticeJobs', {
    //   emplType: '全职',
    //   num: 10,
    //   page: 1
    // }, 'POST', res => {
    //   let station = this.data.station;
    //   if (res.data.data.length > 0) {
    //     res.data.data.forEach(item => {
    //       station.push({
    //         id: item.job_id,
    //         position: item.job_name,
    //         location: item.city,
    //         display: item.display,
    //         job_type: item.job_type,
    //         other_require: item.other_require,
    //         people: item.recruit,
    //         companyType: item.company_type,
    //         company: item.company_name,
    //         price: item.salary,
    //         edu_level: item.edu_level,
    //         working_exp: item.working_exp,
    //         time: item.update_date.match(/[^\s]+/g)[0]
    //       })
    //     })
    //   }
    //   wx.hideLoading()
    //   this.setData({
    //     station
    //   })
    //   // console.log(res)
    // })
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

  toJobDetail (e) {
    let job_id = e.currentTarget.dataset.id;
    let data = this.data.station.filter(item => item.id == job_id);
    wx.navigateTo({
      url: '/pages/job-detail/job-detail',
      events: {
        changeCollect: collect => {
          let station = this.data.station;
          station.forEach(item => {
            if (item.id == job_id) {
              item.collect = collect;
            }
          })
          this.setData({
            station
          })
          console.log("上一页回传", collect)
        }
      },
      success: res => {
        res.eventChannel.emit('job_detail', data[0])
      }
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
    let getCollect = new Promise((resolve, reject) => {
      req.request('/getCollect', null, 'GET', res => {
        if (res.data.code == 'ok') {
          resolve(res)
        } else {
          reject(res)
        }
        // console.log(res)
      })
    })

    let getJobList = new Promise((resolve, reject) => {
      req.request('/searchJob', {
        keyWord
      }, 'POST', res => {
        if (res.data.code == 'ok') {
          resolve(res)
        } else {
          reject(res)
        }
        // console.log(res)
      })
    })

    let done = Promise.all([getCollect, getJobList]);
    done.then(res => {
      let collect = res[0].data.data;
      let jobList = res[1].data.data;
      let station = [];
      let t = new Date().getFullYear();
      jobList.forEach(item => {
        var small_time = item.update_date.match(/[^\s]+/g)[0];
        var time = small_time.match(/[^-]+/)[0] < t ? small_time : small_time.replace(/[^-]+\-/, '');
        station.push({
          id: item.job_id,
          position: item.job_name,
          location: item.city,
          display: item.display,
          job_type: item.job_type,
          other_require: item.other_require,
          people: item.recruit,
          company_type: item.company_type,
          company: item.company_name,
          company_size: item.company_size,
          price: item.salary,
          edu_level: item.edu_level,
          working_exp: item.working_exp,
          time,
          collect: false
        })
      })
      if (collect.length > 0) {
        collect.forEach(col => {
          station.forEach(sat => {
            if (col.job_id == sat.id) {
              sat.collect = true;
            }
          })
        })
      }

      this.setData({
        station
      })
    })
    
  }
})