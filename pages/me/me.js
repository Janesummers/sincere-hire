// pages/me/me.js
const app = getApp();
const base64 = require('../../utils/base64').Base64;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      } else {

      }

      this.setData({
        userInfo
      });
    } catch(e) {
      console.log(e)
    }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        console.log(`${app.globalData.UrlHeadAddress}/qzApi/userAvatarUrl`)
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
            wx.setStorageSync('userInfo', userInfo)
            this.setData({
              userInfo
            })
          }
        })
      }
    })
  },
})