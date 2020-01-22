const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#CCCCCC",
    selectedColor: "#515151",
    list: []
  },
  attached() {
    // let rule = wx.getStorageSync('rule');
    let rule = 'job_seeker';
    if (rule == 'job_seeker') {
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
    }
  }
})