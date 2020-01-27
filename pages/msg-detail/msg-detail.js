// pages/msg-detail/msg-detail.js
const base64 = require('../../utils/base64').Base64;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    originHeight: 0,
    top: 0,
    keyHeight: 0,
    toLast: 'item',
    list: [],
    sendText: '',
    other: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    // console.log(height = wx.getSystemInfoSync().windowHeight)
    let height = wx.getSystemInfoSync().windowHeight - 50;
    console.log(height)

    if (!this.data.socket_open) {
      this.wssInit();
    }

    this.setData({
      height,
      originHeight: height,
      other: options.id
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
    })
    wx.onKeyboardHeightChange(res => {
      if (res.height != 0 && res.height > parseInt(this.data.keyHeight)) {
        console.log(res)
        let height = parseInt(this.data.height);
        height = height - parseInt(res.height) - 50
        this.setData({
          height,
          keyHeight: res.height,
          top: res.height
        })
      }
    })
  },

  wssInit() {
    var that = this;
    //建立连接
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.onSocketMessage(data => {
      // data
      console.log(data)
      let list = this.data.list;
      list.push({
        img: '',
        text: data.data,
        origin: 'other'
      })
      this.setData({
        list
      })
    })
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

  test () {
    console.log("唤起")
    let top = this.data.keyHeight
    let height = parseInt(this.data.height);
    height = height - parseInt(top)
    this.setData({
      height,
      top,
      toLast: 'item'
    }, () => {
      setTimeout(() => {
        this.setData({
          toLast: `item${this.data.list.length - 1}`
        })
      }, 50);
    })
    
  },

  end () {
    console.log("收")
    let height = parseInt(this.data.originHeight);
    this.setData({
      height,
      top: 0,
      toLast: 'item'
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
    })
  },

  bindconfirm (e) {
    let list = this.data.list;
    let unionid = wx.getStorageSync('unionid');
    let data = JSON.stringify({
      msg: e.detail.value,
      client: base64.encode(unionid),
      to: base64.encode(this.data.other)
    })
    wx.sendSocketMessage({
      data
    })
    list.push({
      img: '',
      text: e.detail.value,
      origin: 'self'
    })
    this.setData({
      list
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`,
        sendText: ''
      })
    })
  },

  adInputChange (e) {
    this.setData({
      sendText: e.detail.value
    })
  }
})