// pages/msg-detail/msg-detail.js
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
    list: [
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'self'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'other'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'other'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'self'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'other'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'other'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'self'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'other'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'self'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'other'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。',
        origin: 'self'
      },
      {
        img: '',
        text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。1',
        origin: 'other'
      }
    ],
    sendText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(height = wx.getSystemInfoSync().windowHeight)
    let height = wx.getSystemInfoSync().windowHeight - 50;
    console.log(height)
    this.setData({
      height,
      originHeight: height
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
      setTimeout(() => {
        let list = this.data.list;
        list.push({
          img: '',
          text: '您的简历已放入我公司人才库，若有需要我们会与您联系，感谢关注。2',
          origin: 'other'
        })
        this.setData({
          list
        }, () => {
          this.setData({
            toLast: `item${this.data.list.length - 1}`
          })
        })
      }, 3000);
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