// pages/answer/answer.js
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    id: '',
    idx: 0,
    answerText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on('answer', opt => {
      let {
        title,
        id,
        idx
      } = opt;
      this.setData({
        title,
        id,
        idx
      })
    })
  },

  commitAnswer () {
    let {
      id,
      idx,
      answerText
    } = this.data;
    req.request('/commitAnswer', {
      id,
      idx,
      answerText
    }, 'POST', res => {
      if (res.data.code == 'ok') {
        wx.showToast({
          title: '发布成功',
          duration: 1000,
          success: () => {
            setTimeout(() => {
              let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
              //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
              let prevPage = pages[pages.length - 2]; 
              prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作
                isBack: true
              });
              wx.navigateBack({
                delta: 1 // 返回上一级页面。
              });
            }, 1000);
          }
        })

      } else {
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        })
      }
    })
  },

  answerInput (e) {
    let answerText = e.detail.value;
    this.setData({
      answerText
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

  }
})