//app.js
const base64 = require('./utils/base64').Base64;

App({
  onLaunch: function() {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    var unionid = wx.getStorageSync('unionid');

    // connectSocket();
    // this.globalData
    if (unionid) {
      this.globalData.connectSocket(unionid);
      console.log('准备开始获取聊天记录')
      this.globalData.getMessage(unionid);
    }

    // wx.onSocketClose((res) => {
    //   connectSocket();
    // })

    wx.onSocketMessage(data => {
      console.log('app接收到')
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
      
      var chatList = wx.getStorageSync('chat');
      let dataLen = allData.length;

      if (chatList) {
        
        if (chatList[allData[dataLen - 1].sendId]) {
          chatList[allData[dataLen - 1].sendId].push({
            data: allData[dataLen - 1].data,
            sendId: allData[dataLen - 1].sendId,
            acceptId: allData[dataLen - 1].acceptId,
            time: allData[dataLen - 1].time
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
          console.log('请求失败')
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