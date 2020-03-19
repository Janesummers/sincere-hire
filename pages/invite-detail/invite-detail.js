// pages/invite-detail/invite-detail.js
const req = require('../../utils/request');
const base64 = require('../../utils/base64').Base64;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    data: [],
    jump: false,
    avatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('detail', opt => {
      let {
        id, data, jump, avatarUrl
      } = opt;
      this.setData({
        data, id, jump, avatarUrl
      })
    })
  },

  allow () {
    let info = this.data.data;
    let unionid = wx.getStorageSync('unionid');
    let chatList = wx.getStorageSync('chat');
    let time = this.getTime();
    let acceptId = base64.encode(info.invite_user_id);
    let all = {
      data: '您已同意面试邀请，请认真对待每一次机会！',
      sendId: base64.encode(unionid),
      acceptId,
      time,
      type: 'allowInvite'
    };
    if (chatList) {
      if (chatList[acceptId]) {
        chatList[acceptId].push(all);
      } else {
        chatList[acceptId] = [all]
      }
      wx.setStorageSync('chat', chatList);
    } else {
      let obj = {};
      obj[acceptId] = [all]
      wx.setStorageSync('chat', obj);
    }
    let data = JSON.stringify({
      msg: '系统：[同意面试邀请]',
      client: base64.encode(unionid),
      to: acceptId,
      time: all.time,
      name: app.globalData.userInfo.name || app.globalData.userInfo.nickname,
      type: 'allowInvite',
      read: false
    })
    wx.sendSocketMessage({
      data,
      success: () => {
        let sendId = base64.encode(this.data.data.invite_user_id);
        let acceptId = base64.encode(this.data.data.unionid);
        const eventChannel = this.getOpenerEventChannel();
        let data = {
          data: '您已同意面试邀请，请认真对待每一次机会！',
          sendId,
          acceptId,
          time: new Date(Number(all.time)),
          avatarUrl: this.data.avatarUrl,
          type: 'allowInvite'
        };
    
        eventChannel.emit('updateMessage', data);

        info.status = '已同意'
        this.setData({
          data: info
        })
        this.updateInvite(1);
      }
    })
  },

  refuse () {
    let info = this.data.data;
    let unionid = wx.getStorageSync('unionid');
    let chatList = wx.getStorageSync('chat');
    let time = this.getTime();
    let acceptId = base64.encode(info.invite_user_id);
    let all = {
      data: '您拒绝了对方的面试邀请',
      sendId: base64.encode(unionid),
      acceptId,
      time,
      type: 'refuseInvite'
    };
    if (chatList) {
      if (chatList[acceptId]) {
        chatList[acceptId].push(all);
      } else {
        chatList[acceptId] = [all]
      }
      wx.setStorageSync('chat', chatList);
    } else {
      let obj = {};
      obj[acceptId] = [all]
      wx.setStorageSync('chat', obj);
    }
    let data = JSON.stringify({
      msg: '系统：[拒绝面试邀请]',
      client: base64.encode(unionid),
      to: acceptId,
      time: all.time,
      name: app.globalData.userInfo.name || app.globalData.userInfo.nickname,
      type: 'refuseInvite',
      read: false
    })
    wx.sendSocketMessage({
      data,
      success: () => {
        let sendId = base64.encode(this.data.data.invite_user_id);
        let acceptId = base64.encode(this.data.data.unionid);
        const eventChannel = this.getOpenerEventChannel();
        let data = {
          data: '您拒绝了对方的面试邀请',
          sendId,
          acceptId,
          time: new Date(Number(all.time)),
          avatarUrl: this.data.avatarUrl,
          type: 'refuseInvite'
        };
    
        eventChannel.emit('updateMessage', data);

        info.status = '已拒绝'
        this.setData({
          data: info
        })
        this.updateInvite(2);
      }
    })
  },

  getTime () {
    return new Date().getTime().toString();
  },

  updateInvite (status) {
    req.request('/updateInvite', {
      id: this.data.id,
      status
    }, 'GET', res => {
      if (res.data.code == 'ok') {
        console.log('面试邀请状态已更新');
      } else {
        console.error(res.data.data);
      }
    })
  },

  onShow: function () {
    if (this.data.jump) {
      wx.onSocketMessage(data => {
        console.log('面试详情受到消息')
        data = JSON.parse(data.data);
        let allData = JSON.parse(`[${data.all}]`);
        this.saveStorage(allData);
      })
    }
  },

  saveStorage (allData) {
    var chatList = wx.getStorageSync('chat');
    let dataLen = allData.length;
    if (allData[dataLen - 1].type == 'sendFile') {
      this.setData({
        resumeFile: true
      })
    }
    let sendId = base64.encode(this.data.data.invite_user_id);
    let acceptId = base64.encode(this.data.data.unionid);
    
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
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: allData[dataLen - 1].read,
            invite_id: allData[dataLen - 1].invite_id
          });
          
        } else { // 不在本地则新增本地数据
          console.log('聊天记录不在本地')
          chatList[allData[dataLen - 1].sendId] = allData;
        }
        this.setList(allData[dataLen - 1]);
        // wx.setStorageSync('chat', chatList);
      } else {
        if (chatList[sendId]) {
          chatList[sendId].push({
            data: allData[dataLen - 1].data,
            sendId,
            acceptId,
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: allData[dataLen - 1].read,
            invite_id: allData[dataLen - 1].invite_id
          });
        } else {
          chatList[sendId] = allData;
        }
        
      }
      this.setList(allData[dataLen - 1]);
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
    let sendId = base64.encode(this.data.data.invite_user_id);
    let acceptId = base64.encode(this.data.data.unionid);
    const eventChannel = this.getOpenerEventChannel();
    let data = {
      data: msg.data,
      sendId,
      acceptId,
      time: new Date(Number(msg.time)),
      avatarUrl: this.data.avatarUrl,
      type: msg.type,
      invite_id: msg.invite_id
    };
    
    eventChannel.emit('updateMessage', data);

  }
})