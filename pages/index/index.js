//index.js
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: [],
    hotSubject: [
      {icon: 'icon-hangkonghangtian-aerospace-diqiuyueqiu- yellow', text: '工学'}, 
      {icon: 'icon-qianbi blue', text: '理学'},
      {icon: 'icon-ico_home_obligation orange', text: '经济学'},
      {icon: 'icon-yezi- blue', text: '农学'},
      {icon: 'icon-huodongguanli blue', text: '管理学'},
      {icon: 'icon-yiyuanguahao orange', text: '医学'},
      {icon: 'icon-shuben yellow', text: '文学'},
      {icon: 'icon-bingtutongji orange', text: '法学'},
      {icon: 'icon-jiaoxue orange', text: '教育学'},
      {icon: 'icon-yishu yellow', text: '艺术学'},
      {icon: 'icon-gongshang blue', text: '工商管理'},
    ],
    impowerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = new Date().getFullYear();
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
      req.request('/getPracticeJobs', {
        emplType: '实习'
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
          collect: false,
          publisher_id: item.publisher_id,
          publisher_name: item.publisher_name
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
    wx.setNavigationBarTitle({
      title: '易优聘'
    })
    if (!wx.getStorageSync('unionid')) {
      this.setData({
        impowerShow: true
      })
    }else{
      // this.init()

    }
    
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

  getUser(e) {
    // console.log(e)
    if ((e.detail.data.errMsg).indexOf('ok') != -1) {
      // console.log('用户信息获取成功', JSON.parse(e.detail.data.rawData));
      this.setData({
        impowerShow: false
      })
      // wx.setStorageSync('unionid', JSON.parse(e.detail.data.rawData))
      // app.globalData.eventMgr.emit('user', e.detail.data );
 
      this.init()
    }else{
      wx.setStorageSync('unionid', '')
    }
   
    // console.log(e)
    
    // if ((e.detail.data.errMsg).indexOf('ok') == -1) {
    //   console.log('用户信息获取失败')
    // }
  },

  init () {
    this.setData({
      impowerShow: false
    })
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

  toList (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/job-list/job-list?type=${type}`
    })
  }
})