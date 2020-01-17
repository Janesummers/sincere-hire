// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success (res) {
        if (res.code) {
          //发起网络请求
          // wx.request({
          //   url: 'https://test.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })

          wx.request({
            url: `${app.globalData.UrlHeadAddress}api/site/login`,
            method: 'post',
            data: {
              code: code,
              rawData: app.globalData.user.rawData ? app.globalData.user.rawData : user.rawData,
              signature: app.globalData.user.signature ? app.globalData.user.signature : user.signature,
              encryptedData: app.globalData.user.encryptedData ? app.globalData.user.encryptedData : user.encryptedData,
              iv: app.globalData.user.iv ? app.globalData.user.iv : user.iv
            },
            success(res) {
              app.globalData.unionid = res.data.unionid
              console.log(res.data.unionid)
              try {
                wx.setStorageSync('unionid', res.data.unionid)
              } catch (e) {
              }
              console.log('set', wx.getStorageSync('unionid'))
              ep.emit('unionid', res.data.unionid)
            },
            fail() {
              ep.emit('error', '获取用户信息失败')
            }
          })

          // console.log('ok')
          // wx.getUserInfo({
          //   success: function(res) {
          //     var userInfo = res.userInfo
          //     var nickName = userInfo.nickName
          //     var avatarUrl = userInfo.avatarUrl
          //     var gender = userInfo.gender //性别 0：未知、1：男、2：女
          //     var province = userInfo.province
          //     var city = userInfo.city
          //     var country = userInfo.country
          //     console.log(userInfo)
          //   }
          // })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
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

  }
})