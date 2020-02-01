// pages/welcome/welcome.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    impowerShow: false,
    top: '100%',
    height: '',
    rec_top: '100%',
    isShow: false,
    slide_current: 0,
    isShow2: false,
    slide_current2: 0,
    nextText: '下一步',
    nextText2: '下一步'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.init();
    let height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height
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
    let unionid = wx.getStorageSync('unionid');
    let isUserInfo = () => {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"] && !unionid) {
            getUnionid();
          } else if (res.authSetting["scope.userInfo"] && unionid) {
            this.init();
          } else {
            this.setData({
              impowerShow: true
            })
          }
        }
      })
    } 

    isUserInfo();

    var getUnionid = () => {
      wx.login({
        success: logs => {
          wx.request({
            url: `${app.globalData.UrlHeadAddress}/login`,
            method: 'POST',
            data: { code: logs.code},
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: uni => {
              let unionid = uni.data.data[0].unionid;
              wx.setStorageSync('unionid', unionid);
              this.init();
            },
            fail: function() {
              // fail
            }
          })
        },
        fail: function() {
          // fail
        }
      })
    }
    
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

  getUser(e) {
    if ((e.detail.data.errMsg).indexOf('ok') != -1) {
      // console.log('用户信息获取成功', JSON.parse(e.detail.data.rawData));
      this.setData({
        impowerShow: false
      })
      // wx.setStorageSync('user', JSON.parse(e.detail.data.rawData))
      // app.globalData.eventMgr.emit('user', e.detail.data );
 
      this.init()
    }else{
      wx.setStorageSync('unionid', '')
    }
  },

  init () {
    this.setData({
      impowerShow: false
    })
    // let unionid = wx.getStorageSync('unionid');
    // let rule = wx.getStorageSync('rule');
    // console.log(unionid, rule)
    // wx.switchTab({
    //   url: '/pages/index/index'
    // })
  },

  showBox (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      this.setData({
        isShow: true
      })
      setTimeout(() => {
        this.setData({
          top: '0%'
        })
      }, 200);
    } else {
      this.setData({
        isShow2: true
      })
      setTimeout(() => {
        this.setData({
          rec_top: '0%'
        })
      }, 200);
    }
  },

  close (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      this.setData({
        top: '100%'
      })
      setTimeout(() => {
        this.setData({
          isShow: false
        })
      }, 200);
    } else {
      this.setData({
        rec_top: '100%'
      })
      setTimeout(() => {
        this.setData({
          isShow2: false
        })
      }, 200);
    }
  },

  toPage (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },

  nextStep (e) {
    if (e.currentTarget.dataset.rule == 'job_seeker') {
      let slide_current = parseInt(this.data.slide_current);
      slide_current < 2 ? slide_current += 1 : slide_current;
      this.setData({
        slide_current
      })
    } else {
      let slide_current2 = parseInt(this.data.slide_current2);
      slide_current2 < 1 ? slide_current2 += 1 : slide_current2;
      this.setData({
        slide_current2
      })
    }
  },

  changeCurrent (e) {
    if (e.target.dataset.rule == 'job_seeker') {
      this.setData({
        slide_current: e.detail.current
      })
      if (e.detail.current == 2) {
        this.setData({
          nextText: '完成'
        })
      } else {
        this.setData({
          nextText: '下一步'
        })
      }
    } else {
      this.setData({
        slide_current2: e.detail.current
      })
      if (e.detail.current == 1) {
        this.setData({
          nextText2: '创建'
        })
      } else {
        this.setData({
          nextText2: '下一步'
        })
      }
    }
  },

  editDone (e) {
    if (e.currentTarget.dataset.rule == 'job_seeker') {
      wx.showToast({
        title: '载入中...',
        icon: 'loading',
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index'
            })
          }, 3000);
        }
      })
    } else {
      wx.showToast({
        title: '载入中...',
        icon: 'loading',
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index'
            })
          }, 3000);
        }
      })
    }
  }
})