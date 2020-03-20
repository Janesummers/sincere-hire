// pages/live-resume/live-resume.js
const app = getApp();
const req = require('../../utils/request');
const EventProxy = require('../../utils/eventproxy');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    userEducation: null,
    isBack: false,
    userWork: null,
    evaluate: '',
    top: 100,
    display: 'none',
    winH: 0,
    textLen: 0,
    oldEvaluate: '',
    jump: false,
    isLook: false,
    isSave: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('jump', opt => {
      this.setData({
        jump: opt
      })
    })
    try {
      let winH = wx.getSystemInfoSync().windowHeight;
      let userInfo = wx.getStorageSync('userInfo');
      if (userInfo.rule != 'recruiter') {
        let textLen = userInfo.advantage.length;
        this.setData({
          userInfo,
          evaluate: userInfo.advantage,
          winH,
          textLen,
          oldEvaluate: userInfo.advantage
        });
        this.getData()
      } else {
        this.setData({
          userInfo,
          evaluate: '',
          winH,
          textLen: 0,
          oldEvaluate: '',
          isLook: true
        });
        this.getUserResume(options.id);
      }
    } catch(e) {
      console.error(e)
    }
  },

  onShow () {
    let isBack = this.data.isBack;
    if (isBack) {
      this.getData();
    }
    if (this.data.jump) {
      wx.onSocketMessage(data => {
        console.log('面试详情受到消息')
        data = JSON.parse(data.data);
        let allData = JSON.parse(`[${data.all}]`);
        this.saveStorage(allData);
      })
    }
  },

  saveStorage (allData) {
    var chatList = wx.getStorageSync('chat');
    let dataLen = allData.length;
    if (allData[dataLen - 1].type == 'sendFile') {
      this.setData({
        resumeFile: true
      })
    }
    let sendId = base64.encode(this.data.data.invite_user_id);
    let acceptId = base64.encode(this.data.data.unionid);
    
    if (chatList) {
      if (sendId != allData[dataLen - 1].sendId) { // 如果收到消息时候当前聊天窗口不是接收用户则将数据存到 LocalStorage
        console.log('不是我的聊天界面')
        console.log(allData)
        if (chatList[allData[dataLen - 1].sendId]) { // 如果已有在本地则 push
          console.log('聊天记录有在本地')
          chatList[allData[dataLen - 1].sendId].push({
            data: allData[dataLen - 1].data,
            sendId: allData[dataLen - 1].sendId,
            acceptId: allData[dataLen - 1].acceptId,
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: allData[dataLen - 1].read,
            invite_id: allData[dataLen - 1].invite_id
          });
          
        } else { // 不在本地则新增本地数据
          console.log('聊天记录不在本地')
          chatList[allData[dataLen - 1].sendId] = allData;
        }
        this.setList(allData[dataLen - 1]);
        // wx.setStorageSync('chat', chatList);
      } else {
        if (chatList[sendId]) {
          chatList[sendId].push({
            data: allData[dataLen - 1].data,
            sendId,
            acceptId,
            time: allData[dataLen - 1].time,
            type: allData[dataLen - 1].type,
            read: allData[dataLen - 1].read,
            invite_id: allData[dataLen - 1].invite_id
          });
        } else {
          chatList[sendId] = allData;
        }
        
      }
      this.setList(allData[dataLen - 1]);
      wx.setStorageSync('chat', chatList);
    } else {
      
      var obj = {};
      obj[sendId] = allData;
      wx.setStorageSync('chat', obj);
      if (sendId == allData[dataLen - 1].sendId) {
        this.setList(allData[dataLen - 1]);
      }

    }
  },

  setList (msg) {
    let sendId = base64.encode(this.data.data.invite_user_id);
    let acceptId = base64.encode(this.data.data.unionid);
    const eventChannel = this.getOpenerEventChannel();
    let data = {
      data: msg.data,
      sendId,
      acceptId,
      time: new Date(Number(msg.time)),
      avatarUrl: this.data.avatarUrl,
      type: msg.type,
      invite_id: msg.invite_id
    };
    
    eventChannel.emit('updateMessage', data);

  },

  getData () {
    let ep = new EventProxy();

    req.request('/getUserEducation', null, 'GET', (res) => {
      if (res.data.code == 'ok') {
        let education = res.data.data;
        ep.emit('edu', education);
      } else {
        ep.emit('error', res.data.data);
      }
    })

    req.request('/getUserWork', null, 'GET', (res) => {
      if (res.data.code == 'ok') {
        let work = res.data.data;
        ep.emit('work_experience', work);
      } else {
        ep.emit('error', res.data.data);
      }
    })

    ep.all('edu', 'work_experience', (edu, work) => {
      this.setData({
        userEducation: edu,
        userWork: work,
        isBack: false
      })
    })
  },

  getUserResume (id) {
    req.request('/getUserResume', {
      uid: id
    }, 'GET', (res) => {
      if (res.data.code == 'ok') {
        let {
          edu,
          work,
          adv
        } = res.data.data;
        this.setData({
          userEducation: edu,
          userWork: work,
          evaluate: adv,
          oldEvaluate: adv,
          isBack: false
        })
      } else {
        console.error(res.data.data)
      }
    })
  },

  toPage (e) {
    let path = e.target.dataset.path;
    wx.navigateTo({
      url: `../${path}/${path}`
    })
  },

  evaluateChange (e) {
    let value = e.detail.value;
    this.setData({
      evaluate: value,
      textLen: value.length
    })
  },

  close () {
    if (!this.data.isSave) {
      this.setData({
        top: 100,
        evaluate: this.data.oldEvaluate
      }, () => {
        setTimeout(() => {
          this.setData({
            display: 'none'
          })
        }, 400);
      })
    } else {
      this.setData({
        top: 100,
        isSave: false,
        oldEvaluate: this.data.evaluate
      }, () => {
        setTimeout(() => {
          this.setData({
            display: 'none'
          })
        }, 400);
      })
    }
  },

  save () {
    wx.showLoading({
      title: '保存中'
    })
    let {
      userInfo,
      evaluate,
      oldEvaluate
    } = this.data;
    req.request('/saveEvaluate', {
      text: evaluate
    }, 'POST', res => {
      if (res.data.code != 'error') {
        userInfo.advantage = evaluate;
        oldEvaluate = evaluate;
        this.setData({
          userInfo,
          oldEvaluate,
          isSave: true
        })
        wx.showToast({
          title: '保存成功',
          success: () => {
            wx.setStorageSync('userInfo', userInfo);
            this.close();
          }
        })
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    })
  },

  showEdit () {
    this.setData({
      display: 'block',
      top: 0
    })
  },

  changeWorkExperience (e) {
    let id = e.currentTarget.dataset.id;
    let userWork = this.data.userWork;
    let data = userWork.filter(item => item.id == id);
    wx.navigateTo({
      url: '../add-work-experience/add-work-experience',
      success: res => {
        res.eventChannel.emit('work', {
          id,
          data: data.concat()
        })
      }
    })
  },

  changeEducation (e) {
    let id = e.currentTarget.dataset.id;
    let userEdu = this.data.userEducation;
    let data = userEdu.filter(item => item.id == id);
    wx.navigateTo({
      url: '../add-education/add-education',
      success: res => {
        res.eventChannel.emit('edu', {
          id,
          data: data.concat()
        })
      }
    })
  }
})