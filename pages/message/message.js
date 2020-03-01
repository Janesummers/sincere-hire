// pages/message/message.js
const base64 = require('../../utils/base64').Base64;
const req = require('../../utils/request');
const app = getApp();
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isDone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getData();
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
    wx.onSocketMessage(data => {
      console.log('message接收到')
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
      
      var chatList = wx.getStorageSync('chat');
      let dataLen = allData.length;

      let list = this.data.list;

      let exist = false;

      list.forEach(item => {
        if (base64.encode(item.target_id) == allData[dataLen - 1].sendId) {
          exist = true;
          item.text = allData[dataLen - 1].data;
          var d = new Date(Number(allData[dataLen - 1].time));
          item.time = util.formatNumber(d.getHours()) + ":" + util.formatNumber(d.getMinutes());
          item.originTime = `${d.toLocaleDateString()} ${d.toTimeString().match(/[^ ]+/)}.${d.getMilliseconds()}`;
        }
      })

      if (!exist) {
        var d = new Date(Number(allData[dataLen - 1].time));
        list.unshift({
          id: 1,
          ascription_id: app.globalData.unionid,
          target_id: base64.decode(allData[dataLen - 1].sendId),
          target_name: data.sendUser,
          target_company: null,
          text: allData[dataLen - 1].data,
          time: util.formatNumber(d.getHours()) + ":" + util.formatNumber(d.getMinutes()),
          originTime: `${d.toLocaleDateString()} ${d.toTimeString().match(/[^ ]+/)}.${d.getMilliseconds()}`
        })
      }

      let listSort;

      listSort = list.sort((a, b) => {
        if (a.originTime > b.originTime) {
          return -1;
        }
        if (a.originTime > b.originTime) {
          return 1;
        }
        return 0;
      })

      this.setData({
        list: listSort
      })

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
    this.getData();
  },

  toDetail (e) {
    let {
      id,
      name,
      send
    } = e.currentTarget.dataset;
    send = send ? encodeURIComponent(send) : '';
    var accept = app.globalData.userInfo.avatarUrl ? encodeURIComponent(app.globalData.userInfo.avatarUrl) : '';
    wx.navigateTo({
      url: `/pages/msg-detail/msg-detail?id=${id}&name=${name}&sendImg=${send}&acceptImg=${accept}`
    })
  },

  getData () {
    this.setData({
      isDone: false
    })
    let unionid = wx.getStorageSync('unionid');
    var chatList = wx.getStorageSync('chat');
    let keys = [];
    if (chatList) {
      keys = Object.keys(chatList);
    }
    req.request('/getMessageList', { id: base64.encode(unionid), rule: app.globalData.userInfo.rule}, 'POST', (res) => {
      console.log(res.data.data)
      let list = res.data.data;
      list.forEach(item => {
        if (keys.includes(base64.encode(item.target_id))) {
          var data = chatList[base64.encode(item.target_id)];
          item.text = data[data.length - 1].data;
          var d = new Date(Number(data[data.length - 1].time));
          item.time = util.formatNumber(d.getHours()) + ":" + util.formatNumber(d.getMinutes());
          item.originTime = `${d.toLocaleDateString()} ${d.toTimeString().match(/[^ ]+/)}.${d.getMilliseconds()}`;
        } else {
          item.text = ''
          item.time = ''
          item.originTime = ''
        }
        if (item.avatarUrl) {
          item.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}`
        }
      })

      // console.log(JSON.stringify(list))

      let listSort;

      listSort = list.sort((a, b) => {
        if (a.originTime > b.originTime) {
          return -1;
        }
        if (a.originTime > b.originTime) {
          return 1;
        }
        return 0;
      })

      // console.log(JSON.stringify(listSort))
      
      this.setData({
        list: listSort,
        isDone: true
      })
    })
  }
})