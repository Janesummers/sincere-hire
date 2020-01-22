// pages/job-list/job-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: [
      {position: '理财规划师', location: '漳州', people: '4', companyType: '国企', company: '中信建投期货', price: '面议', time: '19-09-30'},
      {position: '电气工程师', location: '漳州', people: '1', companyType: '上市公司', company: '新旗滨', price: '面议', time: '今天'},
      {position: '软件开发', location: '北京', people: '2', companyType: '国企', company: '北京中电普华信息技术有限公司', price: '面议', time: '19-10-23'},
      {position: '人力资源实习', location: '南京', people: '若干', companyType: '上市公司', company: '好未来励步事业部', price: '面议', time: '19-10-11'}
    ]
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

  toJobDetail () {
    wx.navigateTo({
      url: '/pages/job-detail/job-detail'
    })
  }
})