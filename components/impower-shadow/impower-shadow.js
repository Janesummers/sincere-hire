// var request = require('../../../utils/request.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: { a: 1 },
      observer: function (newData, oldData) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // impowerShow: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUser (e) {
      // console.log(e)
      let encryptedData = encodeURIComponent(e.detail.encryptedData);
      let iv = encodeURIComponent(e.detail.iv);
      wx.login({
        success: res => {
          wx.request({
            url: `${app.globalData.UrlHeadAddress}/login`,
            method: 'POST',
            data: { code: res.code, encryptedData, iv},
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: res => {
              console.log(res)
              let unionid = res.data.data[0].unionid || res.data.data;
              wx.setStorageSync('unionid', unionid)
              this.triggerEvent('getUser', { data: res })
            },
            fail: function() {
              // fail
            }
          })
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
      
    }
  }
})
