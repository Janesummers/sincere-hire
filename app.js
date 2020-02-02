//app.js
const base64 = require('./utils/base64').Base64;

App({
  onLaunch: function () {
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
    let unionid = wx.getStorageSync('unionid');
    unionid = base64.encode(unionid);
    wx.connectSocket({
      url: 'ws://192.168.1.104:8085', //wss://www.chiens.cn/wss
      header:{
        'content-type': 'application/json',
        'unionid': unionid
      }
    })
    //监听WebSocket连接打开事件。
    wx.onSocketOpen(function(res) {
      console.log('WebSocket连接已打开！');
    });

  },
  globalData: {
    userInfo: null,
    unionid: null,
    UrlHeadAddress: 'http://192.168.1.104/qzApi', // https://www.chiens.cn/qzApi
    selected: 0,
    list: [
      {
        "selectedIconPath": "../../images/job_selected.png",
        "iconPath": "../../images/job.png",
        "pagePath": "pages/index/index",
        "text": "职位"
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
        "selectedIconPath": "../../images/me_selected.png",
        "iconPath": "../../images/me.png",
        "pagePath": "pages/me/me",
        "text": "我的"
      }
    ]
  }
})