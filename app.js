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
  },
  globalData: {
    user: null,
    userInfo: null,
    unionid: null,
    UrlHeadAddress: 'http://localhost',
    selected: 0,
    openData: {},
    messageDone: false,
    msgNum: 0,
    tabbar: null,
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
      let app = getApp() || this;
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
            data = JSON.parse(JSON.stringify(data[0]));
            let keys = Object.keys(data);
            keys.forEach(item => {
              data[item].forEach(item => {
                if (item.read != undefined && !item.read && item.acceptId === base64.encode(unionid)) {
                  if (app.globalData) {
                    app.globalData.msgNum = parseInt(app.globalData.msgNum) + 1;
                  } else {
                    app.msgNum = parseInt(app.msgNum) + 1;
                  }
                }
              })
            })
            wx.setStorageSync('chat', data);
          } else {
            wx.removeStorageSync('chat');
          }
          if (app.globalData) {
            app.globalData.messageDone = true;
          } else {
            app.messageDone = true;
          }
          
        },
        fail: () => {
          console.error('请求失败')
        }
      })
    },
    connectSocket (unionid) {
      wx.connectSocket({
        url: 'ws://localhost/wss',
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