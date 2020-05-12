const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#CCCCCC",
    selectedColor: "#515151",
    list: [],
    isNew: false,
    msgNum: 0
  },
  attached() {
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    if (userInfo.rule == 'job_seeker') {
      this.setData({
        list: app.globalData.list,
        selected: app.globalData.selected
      })
    } else {
      this.setData({
        list: app.globalData.list2,
        selected: app.globalData.selected
      })
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      app.globalData.selected = data.index;
      if (data.index == this.data.selected) {
        return;
      }
      wx.switchTab({
        url: `/${url}`
      })
    },
    getMsgNum () {
      let num = app.globalData.msgNum;
      if (num == 0) {
        this.setData({
          isNew: false,
          msgNum: num
        })
      } else {
        this.setData({
          isNew: true,
          msgNum: num
        })
      }
    }
  }
})