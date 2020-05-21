// pages/me/me.js
const app = getApp();
const base64 = require('../../utils/base64').Base64;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    jobTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  onShow () {
    this.selectComponent("#tabbar").getMsgNum();
    wx.onSocketMessage(data => {
      console.log('me接收到')
      app.globalData.msgNum = parseInt(app.globalData.msgNum) + 1;
      this.selectComponent("#tabbar").getMsgNum();
      data = JSON.parse(data.data);
      let allData = JSON.parse(`[${data.all}]`);
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
    });
    this.init();
  },

  init () {
    try {
      let userInfo = wx.getStorageSync('userInfo');
      
      if (userInfo.rule == 'job_seeker') {
        let birth = userInfo.birthday;
        birth = birth.match(/[^\.]+/g);
        let year = parseInt(birth[0]);
        let month = parseInt(birth[1]);
        let date = new Date();
        let age = 0;
        if (month < date.getMonth() + 1) {
          age = date.getFullYear() - year
        } else {
          age = date.getFullYear() - year - 1
        }
        userInfo.age = age
        let jobTime = userInfo.jobTime;
        if (jobTime != "无工作经验") {
          let n = 0;
          jobTime = parseInt(jobTime.match(/[^\.]+/)[0]);
          let t = date.getFullYear() - jobTime;
          if (t > 0) {
            n = t;
          }
          this.setData({
            jobTime: n
          })
        }
      }

      if (!userInfo.avatarUrl) {
        userInfo.avatarUrl = '../../images/people_man.png';
      } else {
        if (!(/http|https/.test(userInfo.avatarUrl))) {
          userInfo.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${userInfo.avatarUrl}`;
        }
      }

      this.setData({
        userInfo
      });
    } catch(e) {
      console.log(e)
    }
  },

  toPage (options) {
    let url = ''
    let {
      type,
      path
    } = options.currentTarget.dataset;
    if (type) {
      url = `/pages/${path}/${path}?type=${type}`
    } else {
      url = `/pages/${path}/${path}`;
    }
    wx.navigateTo({
      url
    })
  },

  changeAvatarUrl () {
    let userInfo = this.data.userInfo;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        console.log(res)
        userInfo.avatarUrl = res.tempFilePaths;
        this.setData({
          userInfo
        })
        // console.log(`${app.globalData.UrlHeadAddress}/qzApi/userAvatarUrl`)
        wx.uploadFile({
          url: `${app.globalData.UrlHeadAddress}/qzApi/userAvatarUrl`,
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            unionid: base64.encode(app.globalData.unionid)
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            wx.showToast({
              title: '修改成功'
            })
            userInfo.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${data.data.img}`;
            wx.setStorageSync('userInfo', userInfo);
            app.globalData.userInfo.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${data.data.img}`;
            this.setData({
              userInfo
            })
          }
        })
      }
    })
  },
})