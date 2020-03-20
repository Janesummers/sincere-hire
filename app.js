//app.js
const base64 = require('./utils/base64').Base64;

App({
  onLaunch: function() {
    var unionid = wx.getStorageSync('unionid');
    
    if (unionid) {
      this.globalData.connectSocket(unionid);
      console.log('准备开始获取聊天记录')
      this.globalData.getMessage(unionid);
    }

    wx.onSocketError((res) => {
      setTimeout(() => {
        var unionid = wx.getStorageSync('unionid');
        this.globalData.connectSocket(unionid);
      }, 10000);
    })

    wx.onSocketMessage(data => {
      console.log('app接收到')
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
      var app = getApp() || this;
      var chatList = wx.getStorageSync('chat');
      let dataLen = allData.length;

      if (chatList) {
        
        if (chatList[allData[dataLen - 1].sendId]) {
          let text = '';
          if (app.globalData.userInfo.rule == 'job_seeker') {
            if (allData[dataLen - 1].data == '对方已同意您的面试邀请') {
              text = '您已同意面试邀请，请认真对待每一次机会！';
            } 
            if (allData[dataLen - 1].data == '对方拒绝了您的面试邀请') {
              text = '您拒绝了对方的面试邀请';
            } else {
              text = allData[dataLen - 1].data;
            }
          } else {
            text = allData[dataLen - 1].data;
          }
          chatList[allData[dataLen - 1].sendId].push({
            data: text,
            sendId: allData[dataLen - 1].sendId,
            acceptId: allData[dataLen - 1].acceptId,
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: allData[dataLen - 1].read,
            invite_id: allData[dataLen - 1].invite_id
          });
        } else {
          chatList[allData[dataLen - 1].sendId] = allData;
        }
        
        wx.setStorageSync('chat', chatList);
      } else {

        var obj = {};
        obj[allData[dataLen - 1].sendId] = allData;
        wx.setStorageSync('chat', obj);

      }
    })

  },
  globalData: {
    user: null,
    userInfo: null,
    unionid: null,
    UrlHeadAddress: 'http://192.168.1.104', //https://www.chiens.cn/qzApi  http://192.168.1.104/
    selected: 0,
    openData: {},
    list: [
      {
        "selectedIconPath": "../../images/job_selected.png",
        "iconPath": "../../images/job.png",
        "pagePath": "pages/index/index",
        "text": "职位"
      },
      {
        "selectedIconPath": "../../images/discover_selected.png",
        "iconPath": "../../images/discover.png",
        "pagePath": "pages/discover/discover",
        "text": "发现"
      },
      {
        "selectedIconPath": "../../images/message_selected.png",
        "iconPath": "../../images/message.png",
        "pagePath": "pages/message/message",
        "text": "消息"
      },
      {
        "selectedIconPath": "../../images/me_selected.png",
        "iconPath": "../../images/me.png",
        "pagePath": "pages/me/me",
        "text": "我的"
      }
    ],
    list2: [
      {
        "selectedIconPath": "../../images/message_selected.png",
        "iconPath": "../../images/message.png",
        "pagePath": "pages/message/message",
        "text": "消息"
      },
      {
        "selectedIconPath": "../../images/discover_selected.png",
        "iconPath": "../../images/discover.png",
        "pagePath": "pages/discover/discover",
        "text": "发现"
      },
      {
        "selectedIconPath": "../../images/me_selected.png",
        "iconPath": "../../images/me.png",
        "pagePath": "pages/me/me",
        "text": "我的"
      }
    ],
    getMessage() {
      console.log('开始获取聊天记录')
      var app = getApp() || this;
      var unionid = wx.getStorageSync('unionid');
      var uri = '';
      if (app.globalData) {
        uri = app.globalData.UrlHeadAddress;
      } else {
        uri = app.UrlHeadAddress;
      }
      wx.request({
        url: `${uri}/qzApi/getMessage`,
        data: {
          id: unionid
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res =>{
          console.log('获取聊天记录成功')
          let data = res.data.data;
          if (data.length > 0) {
            var chatList = wx.getStorageSync('chat');
            if (chatList) {
              chatList = JSON.parse(JSON.stringify(data[0]));
              wx.setStorageSync('chat', chatList);
            } else {
              wx.setStorageSync('chat', JSON.parse(JSON.stringify(data[0])));
            }
          } else {
            wx.removeStorageSync('chat');
          }
        },
        fail: () => {
          console.error('请求失败')
        }
      })
    },
    connectSocket (unionid) {
      wx.connectSocket({
        url: 'ws://192.168.1.104/wss', //wss://www.chiens.cn/wss  ws://192.168.1.104/wss
        header:{
          'content-type': 'application/json',
          'unionid': base64.encode(unionid)
        },
        success: (res) => {
          console.log(res)
          onSocketOpen();
        },
        fail: () => {
          console.log('连接失败')
        }
      })
  
      //监听WebSocket连接打开事件。
      function onSocketOpen() {
        wx.onSocketOpen(() => {
          console.log('WebSocket连接已打开！');
          setTimeout(() => {
            let app = getApp();
            let unionid = wx.getStorageSync('unionid');
            app.globalData.connectSocket(unionid);
          }, 889999);
        });
      }
    }
  }
})