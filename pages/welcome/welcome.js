// pages/welcome/welcome.js
const citys = require('../../utils/city.js').city;
const school = require('../../utils/school.js');
const major = require('../../utils/major.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    impowerShow: false,
    top: '100%',
    height: '',
    rec_top: '100%',
    isShow: false,
    slide_current: 0,
    isShow2: false,
    slide_current2: 0,
    nextText: '下一步',
    nextText2: '下一步',
    job_seeker: {
      name: '',
      birthday: '',
      sex: '',
      email: '',
      city: '',
      identity: '',
      school: '',
      major: '',
      education: '',
      time_enrollment: '',
      time_graduation: '',
      advantage: '',
      synthetic_ability: ''
    },
    recruiter: {
      name: '陈立权',
      email: '1752321720@qq.com',
      position: '经理',
      company: '福建探极贸易有限公司',
      industry: '电子商务',
      scale: '15-50人',
      progress: '天使轮',
      industryArr: ['不限', '移动互联网', '电子商务', '金融', '企业服务', '文化娱乐', '游戏', '招聘', '信息安全', '其他'],
      industryIndex: 0,
      scaleArr: ['少于15人', '15-50人', '50-150人', '150-500人', '500-2000人', '2000人以上'],
      scaleIndex: 0,
      progressArr: ['未融资', '天使轮', 'A轮', 'B轮', 'C轮', 'D轮及以上', '上市公司', '不需要融资'],
      progressIndex: 0
    },
    sexIndex: 0,
    identityIndex: 0,
    cityIndex: [0, 0],
    selectCity: [[], []],
    sex: ['男', '女'],
    identity: ['学生', '职场人士'],
    selectBirthday: [[], []],
    birthIndex: [0, 0],
    education: ['大专', '本科', '硕士', '博士'],
    educationIndex: 0,
    enrollmentIndex: 0,
    selectEnrollment: [[], []],
    enrollmentIndex: [0, 0],
    graduationIndex: [0, 0],
    selectGraduation: [[], []],
    schoolFilter: [],
    chooseSchool: true,
    chooseMajor: true,
    majorFilter: [],
    age: 0,
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.init();
    let height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      height
    })
    let time = new Date().getFullYear();

    // let citys = this.data.citys;
    let {
      selectCity, 
      selectBirthday, 
      birthIndex, 
      selectEnrollment,
      enrollmentIndex,
      selectGraduation
    } = this.data;
    for (let i = 1950; i <= time; i++) {
      selectBirthday[0].push(`${i} 年`);
      selectEnrollment[0].push(`${i} 年`)
    }
    selectBirthday[0].splice(-16);
    birthIndex = [selectBirthday[0].length - 1, 0];
    enrollmentIndex = [selectEnrollment[0].length - 1, 0];
    for (let i = 1; i <= 12; i++) {
      selectBirthday[1].push(i < 10 ? `0${i} 月` : `${i} 月`)
      selectEnrollment[1].push(i < 10 ? `0${i} 月` : `${i} 月`)
      selectGraduation[1].push(i < 10 ? `0${i} 月` : `${i} 月`)
    }
    for (let i = 0, l = citys.length; i < l; i++) {
      selectCity[0].push(citys[i].name);
    }
    for (let j = 0, l = citys[0].city.length; j < l; j++) {
      selectCity[1].push(citys[0].city[j].name);
    }
    
    this.setData({
      selectCity,
      selectBirthday,
      birthIndex,
      selectEnrollment,
      enrollmentIndex,
      selectGraduation
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let unionid = wx.getStorageSync('unionid');
    let isUserInfo = () => {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"] && !unionid) {
            getUnionid();
          } else if (res.authSetting["scope.userInfo"] && unionid) {
            this.init();
          } else {
            this.setData({
              impowerShow: true
            })
          }
        }
      })
    } 

    isUserInfo();

    var getUnionid = () => {
      wx.login({
        success: logs => {
          wx.request({
            url: `${app.globalData.UrlHeadAddress}/login`,
            method: 'POST',
            data: { code: logs.code},
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: uni => {
              let unionid = uni.data.data[0].unionid;
              wx.setStorageSync('unionid', unionid);
              this.init();
            },
            fail: function() {
              // fail
            }
          })
        },
        fail: function() {
          // fail
        }
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getUser(e) {
    if ((e.detail.data.errMsg).indexOf('ok') != -1) {
      // console.log('用户信息获取成功', JSON.parse(e.detail.data.rawData));
      this.setData({
        impowerShow: false
      })
      // wx.setStorageSync('user', JSON.parse(e.detail.data.rawData))
      // app.globalData.eventMgr.emit('user', e.detail.data );
 
      this.init()
    }else{
      wx.setStorageSync('unionid', '')
    }
  },

  init () {
    this.setData({
      impowerShow: false
    })
    // let unionid = wx.getStorageSync('unionid');
    // let rule = wx.getStorageSync('rule');
    // console.log(unionid, rule)
    // wx.switchTab({
    //   url: '/pages/index/index'
    // })
  },

  showBox (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      this.setData({
        isShow: true
      })
      setTimeout(() => {
        this.setData({
          top: '0%'
        })
      }, 200);
    } else {
      this.setData({
        isShow2: true
      })
      setTimeout(() => {
        this.setData({
          rec_top: '0%'
        })
      }, 200);
    }
  },

  close (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      this.setData({
        top: '100%'
      })
      setTimeout(() => {
        this.setData({
          isShow: false
        })
      }, 200);
    } else {
      this.setData({
        rec_top: '100%'
      })
      setTimeout(() => {
        this.setData({
          isShow2: false
        })
      }, 200);
    }
  },

  toPage (e) {
    let rule = e.currentTarget.dataset.rule;
    if (rule === 'job_seeker') {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },

  nextStep (e) {
    if (e.currentTarget.dataset.rule == 'job_seeker') {
      let slide_current = parseInt(this.data.slide_current);
      if (slide_current == 0) {
        let emailCheck = false;
        let {name, birthday, sex, email, city, identity} = this.data.job_seeker
        let notPut = this.checkNotPut('job_seeker', {name, birthday, sex, email, city, identity})
        if (notPut) {
          emailCheck = this.checkEmail(email);
          if (emailCheck) {
            slide_current < 2 ? slide_current += 1 : slide_current;
            this.setData({
              slide_current
            })
          }
        }
      } else {
        if (slide_current == 2) {
          return;
        }
        let {school, major, education, time_enrollment, time_graduation} = this.data.job_seeker
        let notPut = this.checkNotPut('job_seeker', {school, major, education, time_enrollment, time_graduation})
        if (notPut) {
          slide_current < 2 ? slide_current += 1 : slide_current;
          this.setData({
            slide_current
          })
        }
      }
    } else {
      let slide_current2 = parseInt(this.data.slide_current2);
      let emailCheck = false;
      let {name, email, position, company} = this.data.recruiter
      let notPut = this.checkNotPut('job_seeker', {name, email, position, company})
      if (notPut) {
        emailCheck = this.checkEmail(email);
        if (emailCheck) {
          slide_current2 < 1 ? slide_current2 += 1 : slide_current2;
          this.setData({
            slide_current2
          })
        }
      }
    }
  },

  prev (e) {
    if (e.currentTarget.dataset.rule == 'job_seeker') {
      let slide_current = parseInt(this.data.slide_current);
      slide_current >= 1 ? slide_current -= 1 : slide_current;
      this.setData({
        slide_current
      })
    } else {
      let slide_current2 = parseInt(this.data.slide_current2);
      slide_current2 > 0 ? slide_current2 -= 1 : slide_current2;
      this.setData({
        slide_current2
      })
    }
  },

  changeCurrent (e) {
    if (e.target.dataset.rule == 'job_seeker') {
      this.setData({
        slide_current: e.detail.current
      })
      if (e.detail.current == 2) {
        this.setData({
          nextText: '完成'
        })
      } else {
        if (e.detail.current != 0) {

        }
        this.setData({
          nextText: '下一步'
        })
      }
    } else {
      this.setData({
        slide_current2: e.detail.current
      })
      if (e.detail.current == 1) {
        this.setData({
          nextText2: '创建'
        })
      } else {
        this.setData({
          nextText2: '下一步'
        })
      }
    }
  },

  editDone (e) {
    if (e.currentTarget.dataset.rule == 'job_seeker') {
      wx.showToast({
        title: '载入中...',
        icon: 'loading',
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index'
            })
          }, 3000);
        }
      })
    } else {
      wx.showToast({
        title: '载入中...',
        icon: 'loading',
        duration: 3000,
        success: () => {
          setTimeout(() => {
            wx.switchTab({
              url: '../index/index'
            })
          }, 3000);
        }
      })
    }
  },

  jobSeekerPut (e) {
    let job_seeker = this.data.job_seeker;
    let value = e.detail.value;
    let key = e.target.dataset.key;
    if (key == 'sex' || key == 'identity' || key == 'education') {
      job_seeker[key] = this.data[key][value];
    } else if (key == 'birthday') {
      let age = 0;
      let selectBirthday = this.data.selectBirthday;
      let year = parseInt(selectBirthday[0][value[0]]);
      let month = selectBirthday[1][value[1]].replace('月', '');
      job_seeker[key] = `${year}.${month}`;
      let date = new Date();
      if (parseInt(month) < date.getMonth() + 1) {
        age = new Date().getFullYear() - year;
      } else {
        age = new Date().getFullYear() - year - 1;
      }
      this.setData({
        age
      })
    } else if (key == 'time_graduation') {
      let status = "";
      let selectGraduation = this.data.selectGraduation;
      let year = parseInt(selectGraduation[0][value[0]]);
      let month = selectGraduation[1][value[1]].replace('月', '');
      if (year == new Date().getFullYear()) {
        status = "应届毕业生"
      } else {
        status = `${year}.${month} 毕业`;
      }
      job_seeker[key] = `${year}.${month}`;
      this.setData({
        status
      })
    } else {
      job_seeker[key] = value;
    }
    this.setData({
      job_seeker
    })
  },

  checkEmail (email) {
    let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(email)) {
      return true;
    } else {
      wx.showToast({
        title: '请填写正确的邮箱号',
        icon: 'none'
      })
      return false;
    }
  },

  checkNotPut (rule, check) {
    if (rule == 'job_seeker') {
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
    }
    
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

  catchTouchMove () {
    return false;
  },

  cityChange (e) {
    let value = e.detail.value;
    let city = citys[value[0]].city[value[1]].name == '市辖区' ? citys[value[0]].name : citys[value[0]].city[value[1]].name;
    let job_seeker = this.data.job_seeker;
    job_seeker.city = city;
    this.setData({
      job_seeker
    })
  },

  cityColumnChange (e) {
    let {column, value} = e.detail;
    let selectCity = this.data.selectCity;
    if (column == 0) {
      selectCity[1] = [];
      for (let i = 0, l = citys[value].city.length; i < l; i++) {
        selectCity[1].push(citys[value].city[i].name);
      }
      this.setData({
        selectCity,
        cityIndex: [value, 0]
      });
    }
  },

  enrollmentChange (e) {
    let {
      job_seeker, 
      selectEnrollment, 
      selectGraduation
    } = this.data;
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let year = parseInt(selectEnrollment[0][value[0]]);
    let month = selectEnrollment[1][value[1]].replace('月', '');
    job_seeker[key] = `${year}.${month}`;
    let time = new Date().getFullYear() + 5;

    for (let i = year; i <= time; i++) {
      selectGraduation[0].push(`${i} 年`)
    }

    this.setData({
      job_seeker,
      selectGraduation
    })
  },

  schoolFilterFn (e) {
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let job_seeker = this.data.job_seeker;
    job_seeker[key] = value;
    this.setData({
      job_seeker
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
    let job_seeker = this.data.job_seeker;
    job_seeker[key] = value;
    this.setData({
      job_seeker
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
    let job_seeker = this.data.job_seeker;
    job_seeker[key] = word;
    this.setData({
      job_seeker
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

  recruiterPut (e) {
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let recruiter = this.data.recruiter;
    if (key == 'industry' || key == 'scale' || key == 'progress') {
      recruiter[key] = recruiter[`${key}Arr`][value];
      recruiter[`${key}Index`] = value;
    } else {
      recruiter[key] = value;
    }
    this.setData({
      recruiter
    })
  }
})