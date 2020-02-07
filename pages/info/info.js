// pages/info/info.js
const request = require('../../utils/request');
let citys;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    sex: ['男', '女'],
    jobTime: [[], []],
    sexIndex: 0,
    jobTimeIndex: [0, 0],
    selectBirthday: [[], []],
    birthIndex: [0, 0],
    selectCity: [[], []],
    cityIndex: [0, 0],
    defaultCityIndex: [0, 0],
    defaultSexIndex: 0,
    defaultBirthIndex: [0, 0],
    defaultJobTimeIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo
      });
      this.getData();
    } catch(e) {

    }
  },

  getData () {
    request.request('/getCity', null, 'GET', (res) => {
      if (res.data.code == 'error') {
        console.log('获取城市信息失败')
      } else {
        console.log('获取城市信息成功', res);
        citys = res.data.data;
        this.init();
      }
    })
  },

  init () {
    let {
      userInfo, 
      sex, 
      sexIndex,
      defaultSexIndex
    } = this.data;

    sexIndex = sex.indexOf(userInfo.sex);
    defaultSexIndex = sex.indexOf(userInfo.sex);

    this.setData({
      sexIndex,
      defaultSexIndex
    })
    this.initTimeData();
    this.initCityData();
  },

  initTimeData () {
    let {
      selectBirthday, 
      birthIndex, 
      defaultBirthIndex,
      jobTimeIndex,
      defaultJobTimeIndex,
      jobTime,
      userInfo
    } = this.data;
    let time = new Date().getFullYear();
    let yearIndex = 0;
    let monthIndex = 0;
    let year = userInfo.birthday.match(/[^\.]+/g)[0];
    let month = userInfo.birthday.match(/[^\.]+/g)[1];
    

    for (let i = 1950; i <= time; i++) {
      selectBirthday[0].push(`${i} 年`);
      jobTime[0].push(`${i} 年`);
    }
    for (let i = 1; i <= 12; i++) {
      selectBirthday[1].push(i < 10 ? `0${i} 月` : `${i} 月`)
      jobTime[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
    }
    jobTime[0].push('无工作经验');

    selectBirthday[0].splice(-16);
    yearIndex = selectBirthday[0].indexOf(`${year} 年`);
    monthIndex = selectBirthday[1].indexOf(`${month} 月`);
    birthIndex = [yearIndex, monthIndex];
    defaultBirthIndex = [yearIndex, monthIndex];
    
    if (userInfo.jobTime != "无工作经验" && userInfo.jobTime) {
      let jobYear = userInfo.jobTime.match(/[^\.]+/g)[0];
      let jobMonth = userInfo.jobTime.match(/[^\.]+/g)[1];
      let jobYearIndex = jobTime[0].indexOf(`${jobYear} 年`);
      let jobMonthIndex = jobTime[1].indexOf(`${jobMonth} 月`);
      jobTimeIndex = [jobYearIndex, jobMonthIndex];
      defaultJobTimeIndex = [jobYearIndex, jobMonthIndex];
    } else {
      jobTimeIndex = [jobTime[0].length - 1, 0];
      defaultJobTimeIndex = [jobTime[0].length - 1, 0];
      jobTime[1] = [];
    }

    this.setData({
      selectBirthday,
      birthIndex,
      defaultBirthIndex,
      jobTimeIndex,
      defaultJobTimeIndex,
      jobTime
    })

  },

  initCityData () {
    let {
      selectCity, 
      cityIndex,
      defaultCityIndex,
      userInfo
    } = this.data;

    citys.forEach((item, index) => {
      selectCity[0].push(item.name);
      if (item.city) {
        item.city.forEach(city => {
          if (city.name == userInfo.city) {
            cityIndex[0] = index;
            defaultCityIndex[0] = index;
          }
        })
      }
    })
    
    citys[cityIndex[0]].city.forEach((item, index) => {
      selectCity[1].push(item.name);
      if (item.name == userInfo.city) {
        cityIndex[1] = index;
        defaultCityIndex[1] = index;
      }
    })

    this.setData({
      selectCity, 
      cityIndex,
      defaultCityIndex
    })

  },

  changeInfo (e) {
    let key = e.target.dataset.key;
    let value = e.detail.value;
    let {userInfo, selectBirthday, jobTime, sex} = this.data;

    switch(key) {
      case 'sex':
        this.setData({
          sexIndex: value,
          defaultSexIndex: value
        })
        userInfo.sex = sex[value]
        break;
      case 'birth':
        var year = selectBirthday[0][value[0]].replace(' 年', '');
        var month = selectBirthday[1][value[1]].replace(' 月', '');
        userInfo.birthday = `${year}.${month}`;
        this.setData({
          birthIndex: value.concat(),
          defaultBirthIndex: value.concat()
        })
        break;
      case 'jobTime':
        var year = jobTime[0][value[0]].replace(' 年', '');
        var month = jobTime[1][value[1]].replace(' 月', '');
        userInfo.jobTime = `${year}.${month}`;
        this.setData({
          jobTimeIndex: value.concat(),
          defaultJobTimeIndex: value.concat()
        })
        break;
      default:
        userInfo[key] = value;
    }
    this.setData({
      userInfo
    })
  },

  cityColumnChange (e) {
    let {column, value} = e.detail;
    let {selectCity, cityIndex} = this.data;
    if (column == 0) {
      selectCity[1] = [];
      citys[value].city.forEach(item => selectCity[1].push(item.name));
      cityIndex = [value, 0];
      this.setData({
        selectCity, 
        cityIndex
      })
    }
  },

  JobColumnChange (e) {
    let {column, value} = e.detail;
    let {jobTime, jobTimeIndex} = this.data;
    if (column == 0) {
      if (jobTime[0][value] != "无工作经验") {
        for (let i = 1; i <= 12; i++) {
          jobTime[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
        }
      } else {
        jobTime[1] = [];
      }
      jobTimeIndex[0] = value;
      
      this.setData({
        jobTime, 
        jobTimeIndex
      })
    }
  },

  cityChange (e) {
    let value = e.detail.value;
    let {
      cityIndex,
      userInfo,
      defaultCityIndex
    } = this.data;
    cityIndex = value.concat();
    defaultCityIndex = value.concat();
    let city = citys[value[0]].city[value[1]].name == '市辖区' ? citys[value[0]].name : citys[value[0]].city[value[1]].name;
    userInfo.city = city;
    
    this.setData({
      cityIndex,
      defaultCityIndex,
      userInfo
    })
  },

  cancelChange (e) {
    let key = e.target.dataset.key;
    switch (key) {
      case 'birth': 
        let birthIndex = this.data.defaultBirthIndex.concat();
        this.setData({
          birthIndex
        })
        break;
      case 'jobTime': 
        let {
          defaultJobTimeIndex,
          jobTime
        } = this.data
        let jobTimeIndex = defaultJobTimeIndex.concat();
        if (jobTime[0][jobTimeIndex[0]] == "无工作经验") {
          jobTime[1] = [];
        }
        this.setData({
          jobTimeIndex,
          jobTime
        })
        break;
      case 'city': 
        let {defaultCityIndex, selectCity} = this.data;
        let cityIndex = defaultCityIndex.concat();
        selectCity[1] = [];
        citys[defaultCityIndex[0]].city.forEach(item => {
          selectCity[1].push(item.name);
        })
        this.setData({
          cityIndex,
          selectCity
        })
        break;
    }
  },

  save () {
    
  }
})