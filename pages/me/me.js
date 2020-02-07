// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let userInfo = wx.getStorageSync('userInfo');
      let birth = userInfo.birthday;
      birth = birth.match(/[^\.]+/g);
      let year = parseInt(birth[0]);
      let month = parseInt(birth[1]);
      let date = new Date();
      let age = 0;
      if (month < date.getMonth() + 1) {
        age = date.getFullYear() - year
      } else {
        age = date.getFullYear() - year - 1
      }
      userInfo.age = age
      this.setData({
        userInfo
      });
    } catch(e) {

    }
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

  toPage (options) {
    wx.navigateTo({
      url: options.currentTarget.dataset.path
    })
  }
})