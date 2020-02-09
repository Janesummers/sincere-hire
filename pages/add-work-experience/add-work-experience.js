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
    cursorIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  hiredateChange (e) {
    let value = e.detail.value;
    let {
      company,
      hiredate,
      hiredateIndex
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
      olderLeavedataIndex,
      cursorIndex
    } = this.data;
    switch (key) {
      case 'industry':
        var selected = industry[value];
        company.industry = selected;
        break;
      case 'monthly_salary':
        cursorIndex = value.length;
        var val = value + ' 元/月';
        company.monthly_salary = val;
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
      olderLeavedataIndex,
      cursorIndex
    })
  }
})