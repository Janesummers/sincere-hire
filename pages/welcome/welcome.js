// pages/welcome/welcome.js
const base64 = require('../../utils/base64').Base64;
const req = require('../../utils/request');
const EventProxy = require('../../utils/eventproxy');
let citys = [];
let school = [];
let major = [];
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    impowerShow: false,
    isUserLogin: true,
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
      avatarUrl: '',
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
      jobTime: '无工作经验',
      rule: 0
    },
    recruiter: {
      name: '',
      email: '',
      avatarUrl: '',
      position: '',
      company: '',
      scale: '',
      type: '',
      sex: '',
      rule: 1
    },
    sexIndex: 0,
    identityIndex: 0,
    cityIndex: [0, 0],
    selectCity: [[], []],
    sex: ['男', '女'],
    identity: ['学生', '职场人士'],
    selectBirthday: [[], []],
    birthIndex: [0, 0],
    education: ['初中', '高中', '中技', '中专', '大专', '本科', '硕士', 'MBA', 'EMBA', '博士'],
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
    status: '',
    jobTime: [[], []],
    jobTimeIndex: [0, 0],
    typeArr: ['民营', '外商独资', '上市公司', '股份制企业', '外商独资', '国企'],
    typeIndex: 0,
    scaleArr: ['少于15人', '15-50人', '50-150人', '150-500人', '500-2000人', '2000人以上'],
    scaleIndex: 0
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

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (wx.getStorageSync('unionid')) {
            this.setData({
              impowerShow: false
            })
            req.request('/getUserInfo', null, 'GET', (res) => {
              if (res.statusCode == 200) {
                let isRole = false;
                let data = res.data.data;
                if (data.rule != null) {
                  isRole = true;
                  switch (data.rule) {
                    case 0:
                      data.rule = 'job_seeker'
                      break;
                    case 1:
                      data.rule = 'recruiter'
                      break;
                  }
                }
                if (data.avatarUrl) {
                  let avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${data.avatarUrl}`
                  data.avatarUrl = avatarUrl;
                  this.setData({
                    ["job_seeker.avatarUrl"]: avatarUrl,
                    ["recruiter.avatarUrl"]: avatarUrl
                  })
                }
                app.globalData.userInfo = data;
                wx.setStorageSync('userInfo', data);
                if (isRole) {
                  switch (data.rule) {
                    case 'job_seeker':
                      wx.switchTab({
                        url: '../index/index'
                      })
                      // wx.switchTab({
                      //   url: '../discover/discover'
                      // })
                      break;
                    case 'recruiter':
                      wx.switchTab({
                        url: '../message/message'
                      })
                      break;
                  }
                } else {
                  this.getData();
                  this.setData({
                    isUserLogin: false
                  })
                }
              }
            })
          } else {
            this.setData({
              impowerShow: true
            })
          }
          return;
        } else {
          this.setData({
            impowerShow: true
          })
          return;
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  getUser(e) {
    if ((e.detail.data.errMsg).indexOf('ok') != -1) {
      console.log('用户信息获取成功', JSON.parse(e.detail.data.rawData));
      this.setData({
        impowerShow: false
      })
      let user = e.detail.data;
      app.globalData.user = user;
      wx.setStorageSync('user', user);
      req.login((res) => {
        console.log(res)
        if (res == 'Illegal Buffer') {
          wx.removeStorageSync('user');
          wx.showToast({
            title: '网络异常，请重新授权',
            icon: 'none'
          })
          this.setData({
            impowerShow: true
          })
        } else {
          console.log('用户登录成功');
          let userInfo = wx.getStorageSync('userInfo');
          console.log(userInfo.rule)
          if (userInfo && !!userInfo.rule) {
            console.log(userInfo.rule)
            if (userInfo.rule == 'recruiter') {
              wx.switchTab({
                url: '../message/message'
              })
            } else {
              wx.switchTab({
                url: '../index/index'
              })
            }
          } else {
            this.getData();
          }
        }
      })
    } else {
      wx.setStorageSync('unionid', '');
    }
  },

  getData () {
    const ep = new EventProxy();
    req.request('/getCity', null, 'GET', (res) => {
      if (res.data.code == 'error') {
        ep.emit('error', '获取城市信息失败');
      } else {
        ep.emit('city', res);
      }
    })

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

    ep.all('city', 'school', 'major', (city, schools, majors) => {
      citys = city.data.data;
      school = schools.data.data;
      major = majors.data.data;
      this.setData({
        impowerShow: false
      })
      this.init()
    })
  },

  init () {
    let userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo, userInfo.rule)
    if (userInfo && !!userInfo.rule) {
      console.log(123456789)
      wx.switchTab({
        url: '../index/index'
      })
      // wx.redirectTo({
      //   url: '../live-resume/live-resume'
      // })
      this.setData({
        isUserLogin: false
      })
    } else {
      
    }

    this.setData({
      isUserLogin: false
    })
    let time = new Date().getFullYear();
    // let citys = this.data.citys;
    let {
      selectCity,
      selectBirthday,
      birthIndex,
      selectEnrollment,
      enrollmentIndex,
      selectGraduation,
      jobTime,
      jobTimeIndex
    } = this.data;
    for (let i = 1950; i <= time; i++) {
      selectBirthday[0].push(`${i} 年`);
      selectEnrollment[0].push(`${i} 年`);
      jobTime[0].push(`${i} 年`);
    }
    selectBirthday[0].splice(-16);
    jobTime[0].push("无工作经验");
    birthIndex = [selectBirthday[0].length - 1, 0];
    enrollmentIndex = [selectEnrollment[0].length - 1, 0];
    jobTimeIndex = [jobTime[0].length - 1, 0];
    for (let i = 1; i <= 12; i++) {
      selectBirthday[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
      selectEnrollment[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
      selectGraduation[1].push(i < 10 ? `0${i} 月` : `${i} 月`);
    }
    for (let i = 0, l = citys.length; i < l; i++) {
      selectCity[0].push(citys[i].name);
    }
    for (let j = 0, l = citys[0].city.length; j < l; j++) {
      let name = citys[0].city[j].name == '市辖区' ? citys[0].name : citys[0].city[j].name
      selectCity[1].push(name);
    }

    this.setData({
      selectCity,
      selectBirthday,
      birthIndex,
      selectEnrollment,
      enrollmentIndex,
      selectGraduation,
      jobTime,
      jobTimeIndex
    });
    
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
    wx.showLoading({
      title: '载入中...'
    })
    if (e.currentTarget.dataset.rule == 'job_seeker') {
      req.request('/saveJobSeeker', this.data.job_seeker, 'POST', (res) => {
        console.log(res);
        let userInfo = res.data.data;
        userInfo.avatarUrl = this.data.job_seeker.avatarUrl;
        userInfo.rule = 'job_seeker';
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: '信息保存成功',
              icon: 'success',
              duration: 3000,
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
                  wx.switchTab({
                    url: '../index/index'
                  })
                }, 3000);
              }
            })
            console.log("信息保存成功")
          }
        })
      })
    } else {
      req.request('/saveRecruiter', this.data.recruiter, 'POST', (res) => {
        console.log(res)
        let userInfo = res.data.data;
        userInfo.avatarUrl = this.data.recruiter.avatarUrl;
        userInfo.rule = 'recruiter';
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: '信息保存成功',
              icon: 'success',
              duration: 3000,
              success: () => {
                setTimeout(() => {
                  wx.hideToast();
                  wx.switchTab({
                    url: '../message/message'
                  })
                }, 3000);
              }
            })
            console.log("信息保存成功")
          }
        })
      })
    }
  },

  jobSeekerPut (e) {
    let job_seeker = this.data.job_seeker;
    let value = e.detail.value;
    let key = e.target.dataset.key;
    switch (key) {
      case 'sex':
      case 'identity':
      case 'education':
        job_seeker[key] = this.data[key][value];
        break;
      case 'birthday': 
        let age = 0;
        let selectBirthday = this.data.selectBirthday;
        var year = parseInt(selectBirthday[0][value[0]]);
        var month = selectBirthday[1][value[1]].replace(' 月', '').trim();
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
        break;
      case 'time_graduation':
        let status = "";
        let selectGraduation = this.data.selectGraduation;
        var year = parseInt(selectGraduation[0][value[0]]);
        var month = selectGraduation[1][value[1]].replace(' 月', '').trim();
        if (year == new Date().getFullYear()) {
          status = "应届毕业生"
        } else {
          status = `${year}.${month} 毕业`;
        }
        job_seeker[key] = `${year}.${month}`;
        this.setData({
          status
        })
        break;
      case 'jobTime':
        let jobTime = this.data.jobTime;
        if (jobTime[0][value[0]] == '无工作经验') {
          job_seeker[key] = '无工作经验';
        } else {
          var year = jobTime[0][value[0]].replace(' 年', '');
          var month = jobTime[1][value[1]].replace(' 月', '');
          
          job_seeker[key] = `${year}.${month}`;
          this.setData({
            jobTimeIndex: value.concat()
          })
        }
        break;
      default:
        job_seeker[key] = value.concat();
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
      case 'scale': 
        hint = '请选择公司规模';
        break;
      case 'type': 
        hint = '请选择公司类型';
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
        let name = citys[value].city[i].name == '市辖区' ? citys[value].name : citys[value].city[i].name
        selectCity[1].push(name);
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
      selectGraduation,
      graduationIndex
    } = this.data;
    let value = e.detail.value;
    let key = e.target.dataset.key;
    let year = parseInt(selectEnrollment[0][value[0]]);
    let month = selectEnrollment[1][value[1]].replace(' 月', '').trim();
    job_seeker[key] = `${year}.${month}`;
    let time = new Date().getFullYear() + 5;

    for (let i = year; i <= time; i++) {
      selectGraduation[0].push(`${i} 年`)
    }
    graduationIndex = [0, 0]
    job_seeker.time_graduation = '';

    this.setData({
      job_seeker,
      selectGraduation,
      graduationIndex
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
    switch (key) {
      case 'industry':
      case 'type':
      case 'scale':
        recruiter[key] = this.data[`${key}Arr`][value];
        recruiter[`${key}Index`] = value;
        break;
      case 'sex':
        recruiter.sex = this.data.sex[value];
        break;
      default:
        recruiter[key] = value.concat();
    }
    this.setData({
      recruiter
    })
  },

  changeAvatarUrl (e) {
    let rule = {};
    if (e.target.dataset.rule == "job_seeker") {
      rule = this.data.job_seeker;
    } else {
      rule = this.data.recruiter;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        console.log(res)
        rule.avatarUrl = res.tempFilePaths;
        this.setData({
          [e.target.dataset.rule]: rule
        })
        console.log(`${app.globalData.UrlHeadAddress}/qzApi/userAvatarUrl`)
        wx.uploadFile({
          url: `${app.globalData.UrlHeadAddress}/qzApi/userAvatarUrl`,
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            unionid: base64.encode(app.globalData.unionid)
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            rule.avatarUrl = `${app.globalData.UrlHeadAddress}/qzApi/userAvatar/${data.data.img}`;
            this.setData({
              [e.target.dataset.rule]: rule
            })
          }
        })
      }
    })
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
  }
})