// pages/msg-detail/msg-detail.js
const base64 = require('../../utils/base64').Base64;
const app = getApp();
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
    listTop: 50,
    sendId: '',
    acceptId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let height = wx.getSystemInfoSync().windowHeight - 55;
    let data = wx.getStorageSync('chat');
    let id = base64.encode(options.id);
    var unionid = base64.encode(wx.getStorageSync('unionid'));
    this.setData({
      sendId: id,
      acceptId: unionid
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    console.log('进入获取聊天记录：', data[id])
    if (data) {
      this.setData({
        list: data[id] || []
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
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
      this.saveStorage(allData);
    })
  },

  saveStorage (allData) {
    var chatList = wx.getStorageSync('chat');
    let dataLen = allData.length;
    let {
      sendId,
      acceptId
    } = this.data;
    if (chatList) {
      
      if (sendId != allData[dataLen - 1].sendId) { // 如果收到消息时候当前聊天窗口不是接收用户则将数据存到 LocalStorage
        console.log('不是我的聊天界面')
        console.log(allData)
        if (chatList[allData[dataLen - 1].sendId]) { // 如果已有在本地则 push
          console.log('聊天记录有在本地')
          chatList[allData[dataLen - 1].sendId].push({
            data: allData[dataLen - 1].data,
            sendId: allData[dataLen - 1].sendId,
            acceptId: allData[dataLen - 1].acceptId,
            time: allData[dataLen - 1].time
          });
          
        } else { // 不在本地则新增本地数据
          console.log('聊天记录不在本地')
          chatList[allData[dataLen - 1].sendId] = allData;
        }
        // wx.setStorageSync('chat', chatList);
      } else {
        if (chatList[sendId]) {
          chatList[sendId].push({
            data: allData[dataLen - 1].data,
            sendId,
            acceptId,
            time: allData[dataLen - 1].time
          });
        } else {
          chatList[sendId] = allData;
        }
        this.setList(allData[dataLen - 1]);
      }

      wx.setStorageSync('chat', chatList);
    } else {
      
      var obj = {};
      obj[sendId] = allData;
      wx.setStorageSync('chat', obj);
      if (sendId == allData[dataLen - 1].sendId) {
        this.setList(allData[dataLen - 1]);
      }

    }
  },

  setList (msg) {
    
    let list = this.data.list;
    let {
      sendId,
      acceptId
    } = this.data;
    list.push({
      data: msg.data,
      sendId,
      acceptId,
      time: new Date(Number(msg.time))
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
      if (chatList[acceptId]) {
        chatList[acceptId].push({
          data: e.detail.value,
          sendId: base64.encode(unionid),
          acceptId,
          time: time
        });
      } else {
        chatList[acceptId] = [{
          data: e.detail.value,
          sendId: base64.encode(unionid),
          acceptId,
          time: time
        }]
      }
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
      time: all.time,
      name: app.globalData.userInfo.name
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