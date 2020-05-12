// pages/addEducation/addEducation.js
const req = require('../../utils/request');
const EventProxy = require('../../utils/eventproxy');
let school;
let major;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDone: false,
    education: {
      school: '',
      edu: '',
      major: '',
      time_enrollment: '',
      time_graduation: ''
    },
    edu: ['初中', '高中', '中技', '中专', '大专', '本科', '硕士', 'MBA', 'EMBA', '博士'],
    eduIndex: 0,
    selectEnrollment: [[], []],
    enrollmentIndex: [0, 0],
    selectGraduation: [[], []],
    graduationIndex: [0, 0],
    schoolFilter: [],
    majorFilter: [],
    chooseSchool: true,
    chooseMajor: true,
    btnText: '保存',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBaseData();
    const eventChannel = this.getOpenerEventChannel();
    console.log(eventChannel)
    eventChannel.on('edu', opt => {
      let {
        data,
        id
      } = opt; 
      let education = {
        school: data[0].school,
        edu: data[0].education,
        major: data[0].major,
        time_enrollment: data[0].time_enrollment,
        time_graduation: data[0].time_graduation
      }
      this.setData({
        education,
        btnText: '保存修改',
        edu_id: id
      })
      wx.setNavigationBarTitle({
        title: '修改学历'
      })
    })
  },

  getBaseData () {
    let ep = new EventProxy();
    req.request('/getSchool', null, 'GET', (res) => {
      if (res.data.code == 'error') {
        ep.emit('error', '获取学校信息失败');
      } else {
        ep.emit('school', res);
      }
    })
    req.request('/getMajor', null, 'GET', (res) => {
      if (res.data.code == 'error') {
        ep.emit('error', '获取专业信息失败');
      } else {
        ep.emit('major', res);
      }
    })
    ep.all('school', 'major', (schools, majors) => {
      school = schools.data.data;
      major = majors.data.data;
      this.init();
    })
  },

  init () {
    let time = new Date();
    let year = time.getFullYear();
    let {
      selectEnrollment,
      selectGraduation,
      enrollmentIndex,
      graduationIndex
    } = this.data;
    for (let i = 1950; i <= year; i++) {
      selectEnrollment[0].push(`${i} 年`);
    }
    for (let i = 1950; i <= year + 6; i++) {
      selectGraduation[0].push(`${i} 年`);
    }
    enrollmentIndex = [selectEnrollment[0].length - 1, 0];
    graduationIndex = [selectGraduation[0].length - 1, 0];
    for (let i = 1; i <= 12; i++) {
      selectEnrollment[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
      selectGraduation[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
    }
    this.setData({
      selectEnrollment,
      selectGraduation,
      enrollmentIndex,
      graduationIndex
    })
    if (this.data.btnText == '保存') {
      this.setData({
        isDone: true
      })
    } else {
      this.changeInit();
    }
  },

  changeInit () {
    let {
      education,
      selectEnrollment,
      selectGraduation,
      enrollmentIndex,
      graduationIndex,
      edu
    } = this.data;

    let enrollment = education.time_enrollment.match(/[^.]+/g);
    let yearIndex = selectEnrollment[0].indexOf(`${enrollment[0]} 年`);
    let monthIndex = parseInt(enrollment[1]) - 1;

    enrollmentIndex = [yearIndex, monthIndex];

    let graduation = education.time_graduation.match(/[^.]+/g);

    let startYearIndex = selectGraduation[0].indexOf(`${enrollment[0]} 年`);
    selectGraduation[0] = selectGraduation[0].splice(startYearIndex);
    let yIndex = selectGraduation[0].indexOf(`${graduation[0]} 年`);
    let mIndex = parseInt(graduation[1]) - 1;
    
    graduationIndex = [yIndex, mIndex];

    let eduIndex = edu.indexOf(education.edu);

    this.setData({
      selectEnrollment,
      selectGraduation,
      enrollmentIndex,
      graduationIndex,
      eduIndex,
      isDone: true
    })
  },

  changeData (e) {
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let {
      education,
      edu,
      eduIndex
    } = this.data;

    switch(key) {
      case 'edu':
        education.edu = edu[value];
        eduIndex = value;
        this.setData({
          eduIndex
        })
        break;
    }

    this.setData({
      education
    })
  },

  schoolFilterFn (e) {
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let education = this.data.education;
    education[key] = value;
    this.setData({
      education
    })
    if (value != "") {
      let schoolFilter = school.filter(item => item.includes(value));
      this.setData({
        schoolFilter
      })
    } else {
      this.setData({
        schoolFilter: []
      })
    }
  },

  schoolPutFocus () {
    if (this.data.schoolFilter.length > 0) {
      this.setData({
        chooseSchool: true
      })
    }
  },

  majorFilterFn (e) {
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let education = this.data.education;
    education[key] = value;
    this.setData({
      education
    })
    if (value != "") {
      let majorFilter = major.filter(item => item.includes(value));
      this.setData({
        majorFilter
      })
    } else {
      this.setData({
        majorFilter: []
      })
    }
  },

  chooseWord (e) {
    let {word, key} = e.target.dataset;
    let education = this.data.education;
    education[key] = word;
    this.setData({
      education
    })
    if (key == 'school') {
      this.setData({
        chooseSchool: false
      })
    } else {
      this.setData({
        chooseMajor: false
      })
    }
  },

  majorPutFocus () {
    if (this.data.majorFilter.length > 0) {
      this.setData({
        chooseMajor: true
      })
    }
  },

  enrollmentChange (e) {
    let {
      education, 
      selectEnrollment, 
      selectGraduation,
      graduationIndex
    } = this.data;
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let year = parseInt(selectEnrollment[0][value[0]]);
    let month = selectEnrollment[1][value[1]].replace(' 月', '').trim();
    education[key] = `${year}.${month}`;
    let time = year + 6;
    selectGraduation[0] = [];
    for (let i = year; i <= time; i++) {
      selectGraduation[0].push(`${i} 年`)
    }
    graduationIndex = [0, 0];
    education.time_graduation = '';
    this.setData({
      education,
      selectGraduation,
      graduationIndex
    })
  },

  graduationChange (e) {
    let {
      education,
      selectGraduation,
      graduationIndex
    } = this.data;
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let year = parseInt(selectGraduation[0][value[0]]);
    let month = selectGraduation[1][value[1]].replace(' 月', '').trim();
    education[key] = `${year}.${month}`;
    graduationIndex = value;
    this.setData({
      education,
      graduationIndex
    })
  },

  checkNotPut (check) {
    let noNull = false;
    let key = Object.keys(check);
    try {
      Object.values(check).forEach((item, index) => {
        if (item == "") {
          noNull = true;
          throw new Error(key[index]);
        }
      })
    } catch (e) {
      this.showFail(e.message);
    }
    return !noNull;
  },

  showFail (key) {
    let hint = '';
    switch (key) {
      case 'name': 
        hint = '请输入用户名';
        break;
      case 'birthday': 
        hint = '请选择生日';
        break;
      case 'sex': 
        hint = '请选择性别';
        break;
      case 'email': 
        hint = '请输入邮箱';
        break;
      case 'city': 
        hint = '请选择城市';
        break;
      case 'identity': 
        hint = '请选择身份';
        break;
      case 'school': 
        hint = '请输入学校';
        break;
      case 'major': 
        hint = '请输入专业';
        break;
      case 'education': 
        hint = '请选择学历';
        break;
      case 'time_enrollment': 
        hint = '请选择入学时间';
        break;
      case 'time_graduation': 
        hint = '请选择毕业时间';
        break;
      case 'position': 
        hint = '请输入职位';
        break;
      case 'company': 
        hint = '请输入公司名称';
        break;
      case 'industry_field': 
        hint = '请输入行业领域';
        break;
      case 'scale': 
        hint = '请输入公司规模';
        break;
      case 'progress': 
        hint = '请输入发展阶段';
        break;
    }
    wx.showToast({
      title: hint,
      icon: 'none'
    })
  },

  save () {
    wx.showLoading({
      title: "保存中。。。"
    })
    let {
      school,
      edu,
      major,
      time_enrollment,
      time_graduation
    } = this.data.education;
    this.sendReq('/addEducation', {
      school,
      edu,
      major,
      time_enrollment,
      time_graduation
    }, '添加');
  },

  change () {
    wx.showLoading({
      title: "保存修改中..."
    })
    let {
      school,
      edu,
      major,
      time_enrollment,
      time_graduation
    } = this.data.education;
    this.sendReq('/changeEducation', {
      school,
      edu,
      major,
      time_enrollment,
      time_graduation,
      edu_id: this.data.edu_id
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
          this.sendReq('/delEducation', {
            edu_id: this.data.edu_id
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