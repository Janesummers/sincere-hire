// pages/discover/discover.js
const req = require('../../utils/request');
const util = require('../../utils/util');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    num: 10,
    isAll: false,
    hotTopic: [],
    loadMore: false,
    selectIndex: 0,
    top: ['热点话题', '疫情动态'],
    isToDetail: false,
    epidemicDta: {},
    allSmallData: [],
    isDone: false,
    showIndex: null
  },

  onPullDownRefresh: function () {
    if (this.data.selectIndex == 0) {
      this.setData({
        page: 1,
        isAll: false
      })
      this.getData()
    } else {
      this.getEpidemic()
    }
  },

  showList (e) {
    let index = e.currentTarget.dataset.index;
    if (index == this.data.showIndex) {
      this.setData({
        showIndex: null
      })
    } else {
      this.setData({
        showIndex: index
      })
    }
  },

  getData () {
    this.setData({
      loadMore: true
    })
    wx.showLoading({
      title: '载入中'
    })
    req.request('/getHotTopic', {
      page: this.data.page,
      num: this.data.num
    }, 'POST', res => {
      if (res.data.code == 'ok') {
        console.log(res.data.data.length)
        if (res.data.data.length > 0) {
          if (this.data.page == 1) {
            let hotTopic = this.formatData(res.data.data.concat());
            this.setData({
              hotTopic,
              page: this.data.page + 1,
              loadMore: false
            })
          } else {
            let data = this.formatData(res.data.data.concat());
            let hotTopic = this.data.hotTopic.concat(data);
            this.setData({
              hotTopic,
              page: this.data.page + 1,
              loadMore: false
            })
          }
        } else {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
          this.setData({
            isAll: true,
            loadMore: false
          })
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      } else {
        console.error(res.data.data)
      }
    })
  },

  formatData (data) {
    data.forEach(item => {
      let titles = item.topic_title.match(/[^#]+/g);
      let content = item.toppic_content.split('|');
      item.toppic_content = content[0];
      item.content = content;
      if (titles.length > 1) {
        let len = titles.length - 1;
        item.topic_title = titles[len];
        item.topic = titles.slice(0, -1);
      } else {
        item.topic_title = titles[0];
      }
    })
    return data;
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
    if (!this.data.isToDetail && this.data.selectIndex == 0) {
      this.setData({
        page: 1,
        isAll: false,
        isToDetail: false,
        isDone: true
      })
      this.getData();
    } 
    if (!this.data.isToDetail && this.data.selectIndex == 1) {
      this.setData({
        isDone: false
      })
      this.getEpidemic();
    }
  },

  getEpidemic () {
    this.setData({
      isDone: false
    })
    req.request('/getEpidemic', null, 'GET', res => {
      console.log(res.data.data)
      this.setData({
        epidemicDta: res.data.data.ncov_string_list
      })
      console.log(res.data.data.ncov_string_list)
      this.formatEpidemic();
    })
  },

  formatEpidemic () {
    let data = this.data.epidemicDta;
    let allSmallData = [];
    // var keys = Object.keys(data.nation_total);
    for (let i in data.nation_total) {
      let order, text;
      switch (i) {
        case 'confirmed_total':
          order = 1;
          text = '确诊';
          break;
        case 'suspected_total':
          order = 2;
          text = '疑似';
          break;
        case 'deaths_total':
          order = 3;
          text = '死亡';
          break;
        default:
          text = '治愈';
          order = 4;
      }
      let type = i.match(/[^\_]+/)[0];
      let smallData = data.nationwide_incr[`${type}_incr`];
      allSmallData.push({
        type,
        largeData: data.nation_total[i],
        order,
        text,
        smallData
      })
    }

    data.update_time = util.formatTime(new Date(data.update_time * 1000)).replace(/\//g, '.');
    allSmallData = allSmallData.sort((a, b) => {
      return a.order - b.order;
    })

    this.setData({
      allSmallData,
      epidemicDta: data
    })

    this.formatAllData()
  },

  formatAllData () {
    let data = this.data.epidemicDta;
    console.log(data.provinces)
    let provinces = data.provinces;
    data.provinces = provinces.sort((a, b) => {
      return b.confirmed_num - a.confirmed_num
    })
    wx.stopPullDownRefresh();
    this.setData({
      isDone: true,
      epidemicDta: data
    })
  },

  onReachBottom: function () {
    if (!this.data.isAll && !this.data.loadMore && this.data.selectIndex == 0) {
      this.getData()
    }
  },

  toDetail (e) {
    let {
      id,
      idx
    } = e.currentTarget.dataset;
    idx = parseInt(idx);
    let data = this.data.hotTopic.filter(item => item.topic_id === id && item.id === idx);
    wx.navigateTo({
      url: '../discover-detail/discover-detail',
      events: {
        updateContentRead: res => {
          let hotTopic = this.data.hotTopic;
          hotTopic.forEach(item => {
            if (item.topic_id === id && item.id === idx) {
              item.topic_read = res;
            }
          });
          this.setData({
            hotTopic
          })
        },
        updateAnswerNum: res => {
          let hotTopic = this.data.hotTopic;
          hotTopic.forEach(item => {
            if (item.topic_id === id && item.id === idx) {
              item.answer_num = res;
            }
          });
          this.setData({
            hotTopic
          })
        }
      },
      success: res => {
        this.setData({
          isToDetail: true
        })
        res.eventChannel.emit('detail', {
          id,
          idx: data[0].id,
          data
        })
      }
    })
  },

  changeTab (e) {
    let selectIndex = parseInt(e.currentTarget.dataset.key);
    this.setData({
      selectIndex
    })
    if (selectIndex == 0) {
      this.setData({
        isDone: true
      })
      this.getData();
    } else {
      this.setData({
        isDone: false
      })
      this.getEpidemic();
    }
  }
})