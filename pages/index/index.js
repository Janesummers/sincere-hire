//index.js
const req = require('../../utils/request');
const app = getApp();
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  getData () {
    req.request('/getPracticeJobs', null, 'POST', res => {
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '易优聘'
    })
    this.selectComponent("#tabbar").getMsgNum();
    wx.onSocketMessage(data => {
      console.log('index接收到')
      app.globalData.msgNum = parseInt(app.globalData.msgNum) + 1;
      this.selectComponent("#tabbar").getMsgNum();
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
      var chatList = wx.getStorageSync('chat');
      let dataLen = allData.length;
      if (chatList) {
        if (chatList[allData[dataLen - 1].sendId]) {
          let text = '';
          if (app.globalData.userInfo.rule == 'job_seeker') {
            if (allData[dataLen - 1].data == '对方已同意您的面试邀请') {
              text = '您已同意面试邀请，请认真对待每一次机会！';
            } 
            if (allData[dataLen - 1].data == '对方拒绝了您的面试邀请') {
              text = '您拒绝了对方的面试邀请';
            } else {
              text = allData[dataLen - 1].data;
            }
          } else {
            text = allData[dataLen - 1].data;
          }
          chatList[allData[dataLen - 1].sendId].push({
            data: text,
            sendId: allData[dataLen - 1].sendId,
            acceptId: allData[dataLen - 1].acceptId,
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: allData[dataLen - 1].read,
            invite_id: allData[dataLen - 1].invite_id
          });
        } else {
          chatList[allData[dataLen - 1].sendId] = allData;
        }
        
        wx.setStorageSync('chat', chatList);
      } else {

        var obj = {};
        obj[allData[dataLen - 1].sendId] = allData;
        wx.setStorageSync('chat', obj);

      }
    });
  },

  toJobDetail (e) {
    let job_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?jobId=${job_id}`
    })
  },

  toList (e) {
    console.log(e)
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/job-list/job-list?type=${type}`
    })
  },

  toSearch () {
    wx.navigateTo({
      url: `/pages/search/search`
    })
  }
})