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
    isDone: false,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
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
          if (app.globalData.userInfo.rule == 'job_seeker') {
            if (allData[dataLen - 1].data == '对方已同意您的面试邀请') {
              item.text = '您已同意面试邀请，请认真对待每一次机会！';
            } 
            if (allData[dataLen - 1].data == '对方拒绝了您的面试邀请') {
              item.text = '您拒绝了对方的面试邀请';
            } else {
              item.text = allData[dataLen - 1].data;
            }
          } else {
            item.text = allData[dataLen - 1].data;
          }
          var d = new Date(Number(allData[dataLen - 1].time));
          item.time = util.formatNumber(d.getHours()) + ":" + util.formatNumber(d.getMinutes());
          item.originTime = `${d.toLocaleDateString()} ${d.toTimeString().match(/[^ ]+/)}.${d.getMilliseconds()}`;
          item.num += 1;
          item.timestamp = Number(allData[dataLen - 1].time);
        }
      })

      if (!exist) {
        var d = new Date(Number(allData[dataLen - 1].time));
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
        list.unshift({
          id: 1,
          ascription_id: app.globalData.unionid,
          target_id: base64.decode(allData[dataLen - 1].sendId),
          target_name: data.sendUser,
          target_company: null,
          text,
          time: util.formatNumber(d.getHours()) + ":" + util.formatNumber(d.getMinutes()),
          originTime: `${d.toLocaleDateString()} ${d.toTimeString().match(/[^ ]+/)}`,
          num: 1,
          timestamp: Number(allData[dataLen - 1].time)
        })
      }

      let listSort;

      listSort = list.sort((a, b) => {
        if (a.timestamp > b.timestamp) {
          return -1;
        }
        if (a.timestamp > b.timestamp) {
          return 1;
        }
        return 0;
      })

      this.setData({
        list: listSort
      })

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

    this.getData();
  },

  toDetail (e) {
    let {
      id,
      name,
      send,
      company,
      jobid
    } = e.currentTarget.dataset;
    let chatList = wx.getStorageSync('chat');
    chatList[base64.encode(id)].forEach(item => {
      item.read = true;
    })
    let unionid = wx.getStorageSync('unionid');
    wx.setStorageSync('chat', chatList);
    send = send ? encodeURIComponent(send) : '';
    var accept = app.globalData.userInfo.avatarUrl ? encodeURIComponent(app.globalData.userInfo.avatarUrl) : '';
    let data = JSON.stringify({
      msg: '系统任务：更新消息为已读',
      client: base64.encode(unionid),
      to: base64.encode(id)
    })
    wx.sendSocketMessage({
      data
    })
    wx.navigateTo({
      url: `/pages/msg-detail/msg-detail?id=${id}&name=${name}&sendImg=${send}&acceptImg=${accept}&company=${encodeURIComponent(company)}&jobId=${jobid}`
    })
  },

  getData () {
    this.setData({
      isDone: false
    })
    if (!app.globalData.messageDone) {
      let timer = setInterval(() => {
        this.getData();
        clearInterval(timer)
      }, 1000);
    } else {
      let unionid = wx.getStorageSync('unionid');
      var chatList = wx.getStorageSync('chat');
      let keys = [];
      if (chatList) {
        keys = Object.keys(chatList);
      }
      req.request('/getMessageList', { id: base64.encode(unionid), rule: app.globalData.userInfo.rule}, 'POST', (res) => {
        let list = res.data.data;
        list.forEach(item => {
          console.log(keys, item.target_id, base64.encode(item.target_id))
          if (keys.includes(base64.encode(item.target_id))) {
            var data = chatList[base64.encode(item.target_id)];
            let num = 0;
            data.forEach(item => {
              if (item.read != undefined && !item.read && item.acceptId === base64.encode(unionid)) {
                num += 1;
              }
            })
            if (app.globalData.userInfo.rule == 'job_seeker') {
              if (data[data.length - 1].data == '对方已同意您的面试邀请') {
                item.text = '您已同意面试邀请，请认真对待每一次机会！';
              } 
              if (data[data.length - 1].data == '对方拒绝了您的面试邀请') {
                item.text = '您拒绝了对方的面试邀请';
              } else {
                item.text = data[data.length - 1].data;
              }
            } else {
              item.text = data[data.length - 1].data;
            }
            var d = new Date(Number(data[data.length - 1].time));
            var today = new Date();
            if (d.getFullYear() < today.getFullYear() || d.getMonth() + 1 < today.getMonth() + 1 || d.getDate() < today.getDate()) {
              item.time = `${d.getFullYear()}/${util.formatNumber(d.getMonth() + 1)}/${util.formatNumber(d.getDate())}`;
            } else {
              item.time = `${util.formatNumber(d.getHours())}:${util.formatNumber(d.getMinutes())}`;
            }
            item.originTime = `${d.toLocaleDateString()} ${d.toTimeString().match(/[^ ]+/)}`;
            item.timestamp = Number(data[data.length - 1].time);
            item.num = num;
          } else {
            item.text = ''
            item.time = ''
            item.originTime = ''
          }
          item.avatarUrl = item.avatarUrl ? `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${item.avatarUrl}` : '';
        })
  
        // console.log(JSON.stringify(list))
  
        let listSort;
  
        listSort = list.sort((a, b) => {
          if (a.timestamp > b.timestamp) {
            return -1;
          }
          if (a.timestamp > b.timestamp) {
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
    
  }
})