// pages/msg-detail/msg-detail.js
const base64 = require('../../utils/base64').Base64;
const app = getApp();
const req = require('../../utils/request');
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
    acceptId: '',
    sendImg: '',
    acceptImg: '',
    sendCompany: '',
    resumeFile: false,
    jobId: '',
    inter: {
      startTime: '',
      endTime: '',
      date: '',
      time: '',
      text: ''
    },
    interIsShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name
    })
    let height = wx.getSystemInfoSync().windowHeight - 55;
    let data = wx.getStorageSync('chat');

    this.init(options);

    if (options.newChat) {
      this.isNewChat(options, height);
    }
    
    if (data) {
      this.initChatData(options, height, data);
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
    
    this.keyBoardChange();
  },

  init (options) {
    let id = base64.encode(options.id);
    var unionid = base64.encode(wx.getStorageSync('unionid'));
    let userInfo = wx.getStorageSync('userInfo');
    let date = new Date();
    let startTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let endTime = `${date.getFullYear() + 1}-${date.getMonth() + 1}-${date.getDate()}`;
    let acceptImg = options.acceptImg ? decodeURIComponent(options.acceptImg) : '';
    if (acceptImg != '' && !acceptImg.match(/https|http/)) {
      acceptImg = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${acceptImg}`
    }
    this.setData({
      sendId: id,
      acceptId: unionid,
      sendImg: options.sendImg ? decodeURIComponent(options.sendImg) : '',
      acceptImg,
      userInfo,
      otherEncrypt: id,
      sendName: options.name,
      sendCompany: options.company ? decodeURIComponent(options.company) : '',
      jobId: options.jobId || '',
      ["inter.startTime"]: startTime,
      ["inter.endTime"]: endTime
    })
  },

  isNewChat (options) {
    req.request('/getAvar', {
      id: options.id
    }, 'GET', res => {
      let data = res.data.data;
      let sendImg = '';
      let acceptImg = '';
      data.forEach(item =>{
        if (item.unionid == options.id) {
          sendImg = item.avatarUrl ? `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}` : ''
        } else {
          acceptImg = item.avatarUrl ? `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}` : ''
        }
      })
      this.setData({
        sendImg,
        acceptImg
      })
    })
  },

  initChatData (options, height, data) {
    let list = [];
    let id = base64.encode(options.id);
    if (data[id]) {
      list = data[id];
      list.forEach(item => {
        if (item.sendId == this.data.sendId) {
          item.avatarUrl = this.data.sendImg
        } else {
          item.avatarUrl = this.data.acceptImg
        }
        if (item.type == 'sendFile') {
          this.setData({
            resumeFile: true
          })
        }
      })
    }
    if (list.length * 66 > height) {
      this.setData({
        listTop: 0
      })
    }
    this.setData({
      list
    })
  },

  keyBoardChange () {
    wx.onKeyboardHeightChange(res => {
      if (!this.data.interIsShow) {
        if (res.height != 0 && res.height > parseInt(this.data.keyHeight)) {
          let height = parseInt(this.data.height);
          height = height - parseInt(res.height) - 55
          this.setData({
            height,
            keyHeight: res.height,
            top: res.height
          })
        }
      }
    })
  },

  onShow: function () {
    wx.onSocketMessage(data => {
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
      this.saveStorage(allData);
    })
  },

  saveStorage (allData) {
    var chatList = wx.getStorageSync('chat');
    let dataLen = allData.length;
    if (allData[dataLen - 1].type == 'sendFile') {
      this.setData({
        resumeFile: true
      })
    }
    let {
      sendId,
      acceptId
    } = this.data;
    if (chatList) {
      
      if (sendId != allData[dataLen - 1].sendId) { // 如果收到消息时候当前聊天窗口不是接收用户则将数据存到 LocalStorage
        // console.log('不是我的聊天界面')
        // console.log(allData)
        app.globalData.msgNum = parseInt(app.globalData.msgNum) + 1; // 更新未读消息数
        if (chatList[allData[dataLen - 1].sendId]) { // 如果已有在本地则 push
          // console.log('聊天记录有在本地')
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
        // wx.setStorageSync('chat', chatList);
      } else {
        if (chatList[sendId]) {
          chatList[sendId].push({
            data: allData[dataLen - 1].data,
            sendId,
            acceptId,
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: true,
            invite_id: allData[dataLen - 1].invite_id
          });
          let unionid = wx.getStorageSync('unionid');
          let acceptId = this.data.otherEncrypt;
          let data = JSON.stringify({
            msg: '系统任务：更新消息为已读',
            client: base64.encode(unionid),
            to: acceptId
          })
          wx.sendSocketMessage({
            data
          })
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
      time: new Date(Number(msg.time)),
      avatarUrl: this.data.sendImg,
      type: msg.type,
      invite_id: msg.invite_id
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
    if (e.detail.value != '') {
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
        name: app.globalData.userInfo.name || app.globalData.userInfo.nickname,
        read: false
      })
      wx.sendSocketMessage({
        data
      })
      list.push({
        data: e.detail.value,
        sendId: base64.encode(unionid),
        acceptId,
        time: all.time,
        avatarUrl: this.data.acceptImg
      })
      this.setData({
        list
      }, () => {
        this.setData({
          toLast: `item${this.data.list.length - 1}`
        })
      })
    } else {
      wx.showToast({
        title: '请先输入内容',
        icon: 'none'
      })
    }
  },

  clear () {
    wx.removeStorageSync('chat')
  },

  adInputChange (e) {
    this.setData({
      sendText: e.detail.value
    })
  },

  sendResume () {
    let unionid = wx.getStorageSync('unionid');
    let list = this.data.list;
    let chatList = wx.getStorageSync('chat');
    let time = this.getTime();
    let acceptId = this.data.otherEncrypt;
    let all = {
      data: '[个人简历]',
      sendId: base64.encode(unionid),
      acceptId,
      time,
      type: 'sendFile'
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
    list.push({
      data: '[个人简历]',
      sendId: base64.encode(unionid),
      acceptId,
      time: all.time,
      avatarUrl: this.data.acceptImg,
      type: 'sendFile'
    })
    this.setData({
      list
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
    })
    let data = JSON.stringify({
      msg: '[个人简历]',
      client: base64.encode(unionid),
      to: acceptId,
      time: all.time,
      name: app.globalData.userInfo.name || app.globalData.userInfo.nickname,
      type: 'sendFile',
      read: false
    })
    wx.sendSocketMessage({
      data
    })
  },

  showResume () {
    wx.navigateTo({
      url: `../live-resume/live-resume?id=${this.data.other}`,
      events: {
        updateMessage: res => {
          let list = this.data.list;
          list.push(res);
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
          let unionid = wx.getStorageSync('unionid');
          let acceptId = this.data.otherEncrypt;
          let data = JSON.stringify({
            msg: '系统任务：更新消息为已读',
            client: base64.encode(unionid),
            to: acceptId
          })
          wx.sendSocketMessage({
            data
          })
        }
      },
      success: res => {
        res.eventChannel.emit('detail', {
          jump: true
        })
      }
    })
  },

  interview () {
    this.setData({
      interIsShow: !this.data.interIsShow
    })
  },

  bindDateChange (e) {
    this.setData({
      ["inter.date"]: e.detail.value
    })
  },

  bindTimeChange (e) {
    this.setData({
      ["inter.time"]: e.detail.value
    })
  },

  remarkChange (e) {
    this.setData({
      ["inter.text"]: e.detail.value
    })
  },

  sendInvite () {
    wx.showLoading({
      title: '发送中'
    })
    let unionid = wx.getStorageSync('unionid');
    let list = this.data.list;
    let chatList = wx.getStorageSync('chat');
    let time = this.getTime();
    let acceptId = this.data.otherEncrypt;
    let all = {
      data: '[面试邀请]',
      sendId: base64.encode(unionid),
      acceptId,
      time,
      type: 'sendInvite',
      invite_id: this.randomNumber()
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
    list.push({
      data: '[面试邀请]',
      sendId: base64.encode(unionid),
      acceptId,
      time: all.time,
      avatarUrl: this.data.acceptImg,
      type: 'sendInvite',
      invite_id: this.randomNumber()
    })
    this.setData({
      list,
      interIsShow: false
    }, () => {
      this.setData({
        toLast: `item${this.data.list.length - 1}`
      })
    })
    let data = JSON.stringify({
      msg: '[面试邀请]',
      client: base64.encode(unionid),
      to: acceptId,
      time: all.time,
      name: app.globalData.userInfo.name || app.globalData.userInfo.nickname,
      type: 'sendInvite',
      invite_id: `YQ${this.randomNumber()}`,
      other: {
        sendCompany: this.data.sendCompany,
        interDate: this.data.inter.date,
        interTime: this.data.inter.time,
        interText: this.data.inter.text,
        sendName: this.data.sendName,
        job_id: this.data.jobId
      },
      read: false
    })
    wx.sendSocketMessage({
      data,
      success: () => {
        wx.showToast({
          title: '发送成功'
        })
        this.setData({
          ["inter.date"]: '',
          ["inter.time"]: '',
          ["inter.text"]: ''
        })
      }
    })
  },

  randomNumber () {
    let d = new Date();
    return `${d.getFullYear()}${d.getMonth() + 1 <= 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}${d.getDate() <= 9 ? '0' + d.getDate() : d.getDate()}${d.getHours() <= 9 ? '0' + d.getHours() : d.getHours()}${d.getMinutes() <= 9 ? '0' + d.getMinutes() : d.getMinutes()}${d.getSeconds() <= 9 ? '0' + d.getSeconds() : d.getSeconds()}${Math.floor((Math.random() + 1) * 10000)}`;
  },

  showInvite (e) {
    wx.showLoading({
      title: '载入中'
    })
    let id = e.currentTarget.dataset.id;
    req.request('/getOnceInvite', {
      id
    }, 'POST', res => {
      let data = res.data.data.concat()[0];
      data.avatarUrl = data.avatarUrl ? `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${data.avatarUrl}` : '';
      switch (data.status) {
        case 0:
          data.status = '待接受';
          break;
        case 1:
          data.status = '已同意';
          break;
        case 2:
          data.status = '已拒绝';
          break;
        default:
          data.status = '已过期';
      }
      wx.navigateTo({
        url: '../invite-detail/invite-detail',
        events: {
          updateMessage: res => {
            console.log(res)
            let list = this.data.list;
            list.push(res);
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
            let unionid = wx.getStorageSync('unionid');
            let acceptId = this.data.otherEncrypt;
            let data = JSON.stringify({
              msg: '系统任务：更新消息为已读',
              client: base64.encode(unionid),
              to: acceptId
            })
            wx.sendSocketMessage({
              data
            })
          }
        },
        success: res => {
          wx.hideLoading()
          res.eventChannel.emit('detail', {
            id,
            data,
            avatarUrl: this.data.sendImg,
            jump: true
          })
        }
      })
    })
  }
})