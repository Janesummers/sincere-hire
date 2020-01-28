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
    other: '',
    otherEncrypt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)

    // console.log(height = wx.getSystemInfoSync().windowHeight)
    let height = wx.getSystemInfoSync().windowHeight - 50;
    console.log(height)

    if (wx.getStorageSync(`to_${base64.encode(options.id)}`)) {
      this.setData({
        list: wx.getStorageSync(`to_${base64.encode(options.id)}`)
      })
    }

    if (!this.data.socket_open) {
      this.wssInit();
    }

    this.setData({
      height,
      originHeight: height,
      other: options.id,
      otherEncrypt: base64.encode(options.id)
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
      var chatList = wx.getStorageSync(`to_${this.data.otherEncrypt}`);
      var unionid = wx.getStorageSync('unionid');
      data = JSON.parse(data.data)
      console.log(data.all)
      if (chatList) {
        chatList.push({
          data: data.msg,
          sendId: base64.encode(this.data.other),
          acceptId: base64.encode(unionid),
          time: ''
        });
        wx.setStorageSync(`to_${this.data.otherEncrypt}`, chatList);
      } else {
        wx.setStorageSync(`to_${this.data.otherEncrypt}`, [
          JSON.parse(data.all)
        ]);
      }
      let list = this.data.list;
      list.push({
        data: data.msg,
        sendId: base64.encode(this.data.other),
        acceptId: base64.encode(unionid),
        time: ''
      })
      this.setData({
        list
      }, () => {
        this.setData({
          toLast: `item${this.data.list.length - 1}`
        })
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
    var chatList = wx.getStorageSync(`to_${this.data.otherEncrypt}`);
    var all = {
      data: e.detail.value,
      sendId: base64.encode(unionid),
      acceptId: base64.encode(this.data.other),
      time: ''
    };
    if (chatList) {
      chatList.push(all);
      wx.setStorageSync(`to_${this.data.otherEncrypt}`, chatList);
    } else {
      wx.setStorageSync(`to_${this.data.otherEncrypt}`, [all]);
    }
    let data = JSON.stringify({
      msg: e.detail.value,
      client: base64.encode(unionid),
      to: base64.encode(this.data.other)
    })
    wx.sendSocketMessage({
      data
    })
    list.push({
      data: e.detail.value,
      sendId: base64.encode(unionid),
      acceptId: base64.encode(this.data.other),
      time: ''
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