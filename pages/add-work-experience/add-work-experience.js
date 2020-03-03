// pages/add-work-experience/add-work-experience.js
const app = getApp();
const req = require('../../utils/request');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDone: true,
    company: {
      name: '',
      position: '',
      hiredate: '',
      leavedate: '至今',
      industry: '',
      monthly_salary: '',
      job_description: ''
    },
    industry: ['移动互联网', '电子商务', '金融', '企业服务', '文化娱乐', '游戏', '招聘', '信息安全', '其他'],
    industryIndex: 0,
    hiredate: [[], []],
    hiredateIndex: [0, 0],
    olderHiredateIndex: [0, 0],
    leavedate: [[], []],
    leavedateIndex: [0, 0],
    olderLeavedataIndex: [0, 0],
    btnText: '保存'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();
    console.log(eventChannel)
    this.init();
    eventChannel.on('work', opt => {
      let {
        data,
        id
      } = opt; 
      let company = {
        name: data[0].company_name,
        position: data[0].position,
        hiredate: data[0].hiredate,
        leavedate: data[0].leavedate,
        industry: data[0].industry,
        monthly_salary: data[0].salary,
        job_description: data[0].job_description
      }
      this.setData({
        company,
        btnText: '保存修改',
        word_id: id
      })
      wx.setNavigationBarTitle({
        title: '修改经历'
      })
      this.changeInit();
    })
  },

  init () {
    let date = new Date();
    let time = date.getFullYear();
    let month = date.getMonth() + 1;
    let {
      hiredate,
      hiredateIndex,
      olderHiredateIndex,
      leavedate,
      leavedateIndex,
      olderLeavedataIndex
    } = this.data;

    for (let i = 1950; i <= time; i++) {
      hiredate[0].push(`${i} 年`);
      leavedate[0].push(`${i} 年`);
    }

    leavedate[0].push('至今');
    hiredateIndex = [hiredate[0].length - 1, 0];
    olderHiredateIndex = [hiredate[0].length - 1, 0];
    leavedateIndex = [leavedate[0].length - 1, 0];
    olderLeavedataIndex = [leavedate[0].length - 1, 0];

    for (let i = 1; i <= month; i++) {
      hiredate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
    }

    this.setData({
      hiredate,
      hiredateIndex,
      olderHiredateIndex,
      leavedate,
      leavedateIndex,
      olderLeavedataIndex
    })
  },

  changeInit () {
    let {
      company,
      leavedateIndex,
      olderLeavedataIndex,
      leavedate,
      hiredate,
      industry
    } = this.data;

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    let date = company.hiredate.match(/[^.]+/g);
    let yearIndex = hiredate[0].indexOf(`${date[0]} 年`);
    let monthIndex = parseInt(date[1]) - 1;

    if (currentYear != parseInt(date[0])) {
      hiredate[1] = [];
      for (let i = 1; i <= 12; i++) {
        hiredate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
      }
    }
    let hiredateIndex = [yearIndex, monthIndex];
    let olderHiredateIndex = [yearIndex, monthIndex];

    if (company.leavedate != '至今') {
      let leave = company.leavedate.match(/[^.]+/g);
      let yIndex = leavedate[0].indexOf(`${leave[0]} 年`);
      let mIndex = parseInt(leave[1]) - 1;
      leavedate[1] = [];
      if (currentYear != parseInt(leave[0])) {
        for (let i = 1; i <= 12; i++) {
          leavedate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
        }
      } else {
        for (let i = 1; i <= currentMonth; i++) {
          leavedate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
        }
      }
      leavedateIndex = [yIndex, mIndex];
      olderLeavedataIndex = [yIndex, mIndex];
    }

    let industryIndex = industry.indexOf(company.industry);

    this.setData({
      hiredate,
      hiredateIndex,
      olderHiredateIndex,
      leavedate,
      leavedateIndex,
      olderLeavedataIndex,
      industryIndex
    })
  },

  hiredateChange (e) {
    let value = e.detail.value;
    let {
      company,
      hiredate,
      hiredateIndex,
      olderHiredateIndex
    } = this.data;
    hiredateIndex = value.concat();
    olderHiredateIndex = value.concat();
    let year = parseInt(hiredate[0][value[0]]);
    let month = hiredate[1][value[1]].replace(' 月', '');
    company.hiredate = `${year}.${month}`;
    company.leavedate = '';
    this.setData({
      company,
      hiredateIndex,
      olderHiredateIndex
    })
  },

  hiredateColumnChange (e) {
    let {column, value} = e.detail;
    let date = new Date();
    let currentYear = `${date.getFullYear()} 年`;
    let {
      hiredate,
      hiredateIndex
    } = this.data;

    var createMonth = order => {
      hiredate[1] = [];
      switch (order) {
        case 'current':
          let t = date.getMonth() + 1;
          if (hiredateIndex[1] > t) hiredateIndex[1] = 0;
          for (let i = 1; i <= t; i++) {
            hiredate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
          }
        default:
          for (let i = 1; i <= 12; i++) {
            hiredate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
          }
      }
      this.setData({
        hiredate,
        hiredateIndex
      })
    }

    if (column == 0) {
      hiredateIndex[0] = value;
      if (hiredate[0][value] == currentYear) {
        createMonth('current');
      } else {
        createMonth('other');
      }
    } else {
      hiredateIndex[1] = value;
      this.setData({
        hiredateIndex
      })
    }

  },

  leavedateColumnChange (e) {
    let {column, value} = e.detail;
    let date = new Date();
    let currentYear = `${date.getFullYear()} 年`;
    let {
      leavedate,
      leavedateIndex
    } = this.data;

    var createMonth = order => {
      leavedate[1] = [];
      switch (order) {
        case 'current':
          let t = date.getMonth() + 1;
          if (leavedateIndex[1] > t) leavedateIndex[1] = 0;
          for (let i = 1; i <= t; i++) {
            leavedate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
          }
          break;
        case 'other':
          for (let i = 1; i <= 12; i++) {
            leavedate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
          }
          break;
        default:
          leavedateIndex[1] = 0;
      }
      this.setData({
        leavedate,
        leavedateIndex
      })
    }

    if (column == 0) {
      leavedateIndex[0] = value;
      switch (leavedate[0][value]) {
        case currentYear:
          createMonth('current');
          break;
        case '至今':
          createMonth('today');
          break;
        default:
          createMonth('other');
      }
    } else {
      leavedateIndex[1] = value;
      this.setData({
        leavedateIndex
      })
    }

  },

  changeCancel (e) {
    let key = e.target.dataset.key;
    switch(key) {
      case 'hiredate':
        let {
          hiredateIndex,
          olderHiredateIndex,
          hiredate
        } = this.data;
        hiredateIndex = olderHiredateIndex.concat();
        if (olderHiredateIndex[0] = hiredate[0].length - 1) {
          let t = new Date().getMonth() + 1;
          hiredate[1] = [];
          for (let i = 1; i <= t; i++) {
            hiredate[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
          }
        }
        this.setData({
          hiredateIndex,
          hiredate
        })
        break;
      case 'leavedate':
        let {
          leavedateIndex,
          olderLeavedataIndex
        } = this.data;
        leavedateIndex = olderLeavedataIndex.concat();
        this.setData({
          leavedateIndex
        })
        break;
    }
  },

  changeData (e) {
    let key = e.target.dataset.key;
    let value = e.detail.value;
    let {
      company,
      industry,
      industryIndex,
      leavedate,
      leavedateIndex,
      olderLeavedataIndex
    } = this.data;
    switch (key) {
      case 'industry':
        var selected = industry[value];
        company.industry = selected;
        break;
      case 'monthly_salary':
        company.monthly_salary = value;
        break;
      case 'leavedate':
        if (leavedate[0][value[0]] == '至今') {
          company.leavedate = leavedate[0][value[0]];
        } else {
          leavedateIndex = value.concat();
          olderLeavedataIndex = value.concat();
          let year = parseInt(leavedate[0][value[0]]);
          let month = leavedate[1][value[1]].replace(' 月', '');
          company.leavedate = `${year}.${month}`;
        }
        break;
      default:
        company[key] = value;
    }
    
    this.setData({
      company,
      industry,
      industryIndex,
      leavedate,
      leavedateIndex,
      olderLeavedataIndex
    })
  },

  save () {
    wx.showLoading({
      title: "保存中..."
    })
    let {
      name,
      position,
      hiredate,
      leavedate,
      industry,
      monthly_salary,
      job_description
    } = this.data.company;
    this.sendReq('/addWorkExperience', {
      name,
      position,
      hiredate,
      leavedate,
      industry,
      monthly_salary,
      job_description
    }, '添加');
  },

  change () {
    wx.showLoading({
      title: "保存修改中..."
    })
    let {
      name,
      position,
      hiredate,
      leavedate,
      industry,
      monthly_salary,
      job_description
    } = this.data.company;
    this.sendReq('/changeWorkExperience', {
      name,
      position,
      hiredate,
      leavedate,
      industry,
      monthly_salary,
      job_description,
      word_id: this.data.word_id
    }, '修改');
  },

  del () {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      confirmColor: '#49bcc0',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: "正在处理..."
          })
          this.sendReq('/delWorkExperience', {
            word_id: this.data.word_id
          }, '删除');
        }
      }
    })
  },

  sendReq (uri, data, text) {
    req.request(uri, data, 'POST', (res) => {
      if (res.data.code != 'error') {
        wx.hideLoading();
        wx.showToast({
          title: `${text}成功`,
          icon: 'success',
          duration: 1000,
          success: () => {
            setTimeout(() => {
              let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
              //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
              let prevPage = pages[pages.length - 2]; 

              prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作
                isBack: true
              });
              wx.navigateBack({
                delta: 1 // 返回上一级页面。
              });
            }, 1000);
          }
        });
      } else {
        wx.showToast({
          title: `${text}失败`,
          icon: 'none'
        });
      }
    })
  }
})