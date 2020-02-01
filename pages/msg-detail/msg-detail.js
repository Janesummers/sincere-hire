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
    otherEncrypt: '',
    listTop: 50
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let height = wx.getSystemInfoSync().windowHeight - 55;
    let data = wx.getStorageSync('chat');
    let id = base64.encode(options.id);
    if (data) {
      this.setData({
        list: data[id]
      })
    }

    if (this.data.list.length * 66 > height) {
      this.setData({
        listTop: 0
      })
    }

    this.setData({
      height,
      originHeight: height,
      other: options.id,
      otherEncrypt: id
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
    })
    
    wx.onKeyboardHeightChange(res => {
      if (res.height != 0 && res.height > parseInt(this.data.keyHeight)) {
        let height = parseInt(this.data.height);
        height = height - parseInt(res.height) - 55
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
    wx.onSocketMessage(data => {
      // data
      var chatList = wx.getStorageSync('chat');
      var unionid = wx.getStorageSync('unionid');
      data = JSON.parse(data.data);
      let sendId = this.data.otherEncrypt;
      if (chatList) {
        chatList[sendId].push({
          data: data.msg,
          sendId: sendId,
          acceptId: base64.encode(unionid),
          time: new Date(Number(data.all.time))
        });
        wx.setStorageSync('chat', chatList);
      } else {
        let obj = {};
        obj[sendId] = [JSON.parse(data.all)]
        wx.setStorageSync('chat', obj);
      }

      

      
      let list = this.data.list;
      list.push({
        data: data.msg,
        sendId: sendId,
        acceptId: base64.encode(unionid),
        time: new Date(Number(data.all.time))
      })
      if (list.length * 66 > this.data.originHeight) {
        this.setData({
          listTop: 0
        })
      }
      this.setData({
        list
      }, () => {
        this.setData({
          toLast: `item${this.data.list.length - 1}`
        })
      })
    })
  },

  getTime () {
    return new Date().getTime().toString();
  },

  test () {
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
      }, 100);
    })
  },

  end () {
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
    let chatList = wx.getStorageSync('chat');
    let time = this.getTime();
    let acceptId = this.data.otherEncrypt;
    let all = {
      data: e.detail.value,
      sendId: base64.encode(unionid),
      acceptId,
      time
    };

    this.setData({
      sendText: ''
    })

    if (chatList) {
      chatList[acceptId].push({
        data: e.detail.value,
        sendId: base64.encode(unionid),
        acceptId,
        time: new Date(Number(time))
      });
      wx.setStorageSync('chat', chatList);
    } else {
      let obj = {};
      obj[acceptId] = [all]
      wx.setStorageSync('chat', obj);
    }
    let data = JSON.stringify({
      msg: e.detail.value,
      client: base64.encode(unionid),
      to: acceptId,
      time: all.time
    })
    wx.sendSocketMessage({
      data
    })
    list.push({
      data: e.detail.value,
      sendId: base64.encode(unionid),
      acceptId,
      time: all.time
    })
    this.setData({
      list
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
    })
  },

  clear () {
    wx.removeStorageSync('chat')
  },

  adInputChange (e) {
    this.setData({
      sendText: e.detail.value
    })
  }
})