// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    impowerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if (!wx.getStorageSync('unionid')) {
      this.setData({
        impowerShow: true
      })
    }else{
      this.init();
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
      // wx.setStorageSync('user', JSON.parse(e.detail.data.rawData))
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
    let unionid = wx.getStorageSync('unionid');
    let rule = wx.getStorageSync('rule');
    // if(unionid && !rule) {
    //   wx.request({
    //     url: 'https://www.chiens.cn/qzApi/login',
    //     method: 'POST',
    //     data: {
    //       unionid
    //     },
    //     header: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //     success: res => {
    //       console.log(res)
    //     },
    //     fail: function() {
    //       // fail
    //     }
    //   })
    // }
    
    // wx.switchTab({
    //   url: '../index/index'
    // })
  },

  toPage (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      wx.switchTab({
        url: '../index/index'
      })
    }
  }
})