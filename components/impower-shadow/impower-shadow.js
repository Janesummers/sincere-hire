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
      console.log(e)
      this.triggerEvent('getUser', { data: e.detail })
    }
  }
})
