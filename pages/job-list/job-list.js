// pages/job-list/job-list.js
const req = require('../../utils/request');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: [],
    isCollect: false,
    type: '',
    page: 1,
    isAllDone: false,
    loadMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    wx.setNavigationBarTitle({
      title: type
    })
    this.setData({
      type
    })

    switch (type) {
      case '发布':
        this.getRelease();
        break;
      case '收藏':
        this.setData({
          isCollect: true
        })
        this.getUserCollect();
        break;
      default:
        this.getData()
    }
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let type = this.data.type;
    this.setData({
      page: 1,
      isAllDone: false
    })
    switch (type) {
      case '发布':
        this.getRelease();
        break;
      case '收藏':
        this.setData({
          isCollect: true
        })
        this.getUserCollect();
        break;
      default:
        this.getData()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isAllDone && !this.data.loadMore) {
      let page = parseInt(this.data.page) + 1;
      let type = this.data.type;
      this.setData({
        page,
        loadMore: true
      })
      switch (type) {
        case '发布':
          this.getRelease();
          break;
        case '收藏':
          this.setData({
            isCollect: true
          })
          this.getUserCollect();
          break;
        default:
          this.getData()
      }
    }
  },
  
  getRelease () {
    req.request('/getMyRelease', {
      company_id: app.globalData.userInfo.company_id,
      page: this.data.page,
    }, 'GET', res => {
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          let station = this.formatData(res.data.data.concat());
          if (station.length < 10) {
            this.setData({
              station,
              loadMore: false,
              isAllDone: true
            })
          } else {
            this.setData({
              station,
              loadMore: false
            })
          }
        } else {
          this.setData({
            isAllDone: true
          })
        }
        wx.stopPullDownRefresh();
      } else {
        console.error('错误')
      }
    })
  },

  getData () {
    req.request('/getPracticeJobs', {
      emplType: this.data.type,
      page: this.data.page
    }, 'POST', res => {
      wx.stopPullDownRefresh();
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          let station = this.formatData(res.data.data.concat());
          if (this.data.page == 1) {
            this.setData({
              station,
              loadMore: false
            })
            if (station.length < 10) {
              this.setData({
                isAllDone: true
              })
            }
          }
          if (this.data.page > 1) {
            let data = this.data.station.concat(station);
            this.setData({
              station: data,
              loadMore: false
            })
          }
        } else {
          this.setData({
            isAllDone: true,
            loadMore: false
          })
        }
        wx.stopPullDownRefresh();
      } else {
        console.error('请求数据失败')
      }
    })
  },

  getUserCollect () {
    req.request('/getUserCollect', null, 'GET', res => {
      if (res.data.code == 'ok') {
        if (res.data.data.length > 0) {
          let station = this.formatData(res.data.data.concat(), true);
          if (this.data.page == 1) {
            this.setData({
              station,
              loadMore: false
            })
            if (station.length < 10) {
              this.setData({
                isAllDone: true
              })
            }
          }
          if (this.data.page > 1) {
            let data = this.data.station.concat(station);
            this.setData({
              station: data,
              loadMore: false
            })
          }
        } else {
          this.setData({
            isAllDone: true,
            loadMore: false
          })
        }
      } else {
        console.error('错误');
      }
      wx.stopPullDownRefresh();
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
  },

  toJobDetail (e) {
    let job_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?jobId=${job_id}&isCollect=${this.data.isCollect}`,
      events: {
        delCollect: () => {
          let station = this.data.station;
          let delIndex = 0;
          station.forEach((item, index) => {
            if (item.id == job_id) {
              delIndex = index;
            }
          })
          station.splice(delIndex, 1);
          this.setData({
            station
          })
        }
      },
      success: (res) => {
        res.eventChannel.emit('isCollect', { isCollect: this.data.isCollect })
      }
    })
  }
})