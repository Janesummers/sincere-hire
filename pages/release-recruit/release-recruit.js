// pages/release-recruit/release-recruit.js
const req = require('../../utils/request');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobInfo: {
      job_name: '',
      job_type: [],
      empl_type: '',
      working_exp: '',
      welfare: [],
      city: '',
      display: '',
      salary: '',
      skill: [],
      other_require: '',
      job_address: '',
      recruit: '',
      edu_level: ''
    },
    edu: ['初中', '高中', '中技', '中专', '大专', '本科', '硕士', 'MBA', 'EMBA', '博士'],
    empl_type: ['全职', '实习'],
    job_type: [{"choose":false,"text":"软件"},{"choose":false,"text":"互联网开发"},{"choose":false,"text":"系统集成"},{"choose":false,"text":"实习生"},{"choose":false,"text":"培训生"},{"choose":false,"text":"储备干部"},{"choose":false,"text":"咨询"},{"choose":false,"text":"顾问"},{"choose":false,"text":"调研"},{"choose":false,"text":"数据分析"},{"choose":false,"text":"IT运维"},{"choose":false,"text":"技术支持"},{"choose":false,"text":"财务"},{"choose":false,"text":"审计"},{"choose":false,"text":"税务"},{"choose":false,"text":"人力资源"},{"choose":false,"text":"其他"}],
    welfare: [{"choose":false,"text":"五险一金"},{"choose":false,"text":"定期体检"},{"choose":false,"text":"高温补贴"},{"choose":false,"text":"带薪年假"},{"choose":false,"text":"节日福利"},{"choose":false,"text":"弹性工作"},{"choose":false,"text":"加班补助"},{"choose":false,"text":"补充医疗保险"},{"choose":false,"text":"绩效奖金"},{"choose":false,"text":"定期体检"},{"choose":false,"text":"年底双薪"},{"choose":false,"text":"餐补"},{"choose":false,"text":"员工旅游"},{"choose":false,"text":"落户"},{"choose":false,"text":"大牛带队"}],
    working_exp: ['不限', '无经验', '1年以下', '1-3年', '3-5年', '5-7年', '7-10年', '10年以上'],
    low_salary: '',
    high_salary: '',
    skill: [{"choose":false,"text":"Css"},{"choose":false,"text":"Javascript"},{"choose":false,"text":"html"},{"choose":false,"text":"C语言开发"},{"choose":false,"text":"VUE"},{"choose":false,"text":"数据分析"},{"choose":false,"text":"办公表格"},{"choose":false,"text":"数据库"},{"choose":false,"text":"MySQL"},{"choose":false,"text":"WINFORM"},{"choose":false,"text":"ASP"},{"choose":false,"text":"C#/.NET"},{"choose":false,"text":"IT支持"},{"choose":false,"text":"运维开发"},{"choose":false,"text":"财务报表"},{"choose":false,"text":"office"},{"choose":false,"text":"报税"},{"choose":false,"text":"初级会计师"},{"choose":false,"text":"记账"},{"choose":false,"text":"审计"}],
    job_require: '',
    isCommit: false,
    top: 100,
    display: 'none',
    winH: 0,
    isSave: false,
    custom: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let winH = wx.getSystemInfoSync().windowHeight;
    this.setData({
      winH
    })
  },

  close () {
    if (this.data.isSave) {
      this.setData({
        top: 100,
        custom: '',
        isSave: false
      }, () => {
        setTimeout(() => {
          this.setData({
            display: 'none'
          })
        }, 400);
      })
    } else {
      this.setData({
        top: 100
      }, () => {
        setTimeout(() => {
          this.setData({
            display: 'none'
          })
        }, 400);
      })
    }
  },

  add () {
    let custom = this.data.custom;
    if (custom && custom != "") {
      let data = custom.match(/[^,|，]+/g);
      let skill = this.data.skill;
      let jobInfo = this.data.jobInfo;
      data.forEach(item => {
        skill.push({
          "choose": true,
          "text": item
        })
        jobInfo.skill.push(item)
      })
      this.setData({
        skill,
        jobInfo,
        isSave: true
      })
      this.close()
    }
    
  },

  showEdit () {
    this.setData({
      display: 'block',
      top: 0
    })
  },

  customChange (e) {
    this.setData({
      custom: e.detail.value
    })
  },

  setJobInfo (e) {
    let value = e.detail.value || '';
    let key = e.currentTarget.dataset.key;
    let item = e.currentTarget.dataset.item || '';
    let itemIndex = e.currentTarget.dataset.itemindex;
    let {
      jobInfo,
      edu,
      empl_type,
      working_exp,
      salary,
      job_type,
      welfare,
      skill
    } = this.data;
    switch (key) {
      case 'empl_type':
        jobInfo.empl_type = empl_type[value];
      break;
      case 'city':
        let [
          province,
          town,
          region
        ] = value;
        jobInfo.city = town.replace('市', '');
        jobInfo.display = `${town}-${region}`.replace('市', '');
      break;
      case 'working_exp':
        jobInfo.working_exp = working_exp[value];
      break;
      case 'salary':
        jobInfo.salary = salary[value];
      break;
      case 'edu':
        jobInfo.edu_level = edu[value];
      break;
      case 'low':
        this.setData({
          low_salary: value
        })
      break;
      case 'high':
        this.setData({
          high_salary: value
        })
      break;
      case 'job_require':
        this.setData({
          job_require: value
        })
      break;
      case 'job_name':
        jobInfo.job_name = value;
      break;
      case 'recruit':
        jobInfo.recruit = value;
      break;
      case 'job_address':
        jobInfo.job_address = value;
      break;
      case 'job_type':
        var index = jobInfo.job_type.indexOf(item);
        if (index == -1) {
          jobInfo.job_type.push(item);
          job_type[itemIndex].choose = true;
        } else {
          jobInfo.job_type.splice(index, 1);
          job_type[itemIndex].choose = false;
        }
        this.setData({
          job_type
        })
      break;
      case 'welfare':
        var index = jobInfo.job_type.indexOf(item);
        if (index == -1) {
          jobInfo.welfare.push(item);
          welfare[itemIndex].choose = true;
        } else {
          jobInfo.welfare.splice(index, 1);
          welfare[itemIndex].choose = false;
        }
        this.setData({
          welfare
        })
      break;
      case 'skill':
        var index = jobInfo.skill.indexOf(item);
        if (index == -1) {
          jobInfo.skill.push(item);
          skill[itemIndex].choose = true;
        } else {
          jobInfo.skill.splice(index, 1);
          skill[itemIndex].choose = false;
        }
        this.setData({
          skill
        })
      break;
    }
    this.setData({
      jobInfo
    })
  },

  save () {
    let {
      jobInfo,
      low_salary,
      high_salary,
      job_require
    } = this.data;
    jobInfo = JSON.parse(JSON.stringify(jobInfo));
    let {
      job_name,
      job_type,
      empl_type,
      working_exp,
      display,
      job_address,
      recruit,
      edu_level
    } = jobInfo;
    let isNull = this.checkNotPut({
      job_name,
      job_type,
      empl_type,
      display,
      working_exp,
      low_salary,
      high_salary,
      job_require,
      edu_level,
      recruit,
      job_address
    })
    if (isNull) {
      jobInfo.job_type = jobInfo.job_type.join('/');
      jobInfo.welfare = jobInfo.welfare.join('|') || null;
      jobInfo.skill = jobInfo.skill.join('|') || null;
      low_salary = parseInt(low_salary);
      high_salary = parseInt(high_salary);
      low_salary = `${low_salary / 1000}k`;
      high_salary = `${high_salary / 1000}k`;
      jobInfo.salary = `${low_salary}-${high_salary}`;
      job_require = job_require.match(/[^\n\r]+/g).join('|');
      jobInfo.other_require = job_require;
      jobInfo.company_id = app.globalData.userInfo.company_id;
      this.commitJob(jobInfo);
    }
  },

  commitJob (jobInfo) {
    this.setData({
      isCommit: true
    })
    wx.showLoading({
      title: '发布中...'
    })
    req.request('/saveJob', jobInfo, 'POST', res => {
      wx.hideLoading();
      if (res.data.code != 'error') {
        wx.showToast({
          title: '发布成功',
          success: () => {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/me/me'
              })
            }, 1500);
          }
        })
      } else {
        wx.showToast({
          title: '发布失败，请稍后再试！',
          icon: 'none'
        })
        this.setData({
          isCommit: false
        })
      }
    })
  },

  checkNotPut (check) {
    let noNull = false;
    let key = Object.keys(check);
    try {
      Object.values(check).forEach((item, index) => {
        if (item.length == 0) {
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
      case 'job_name': 
        hint = '请输入职位名称';
        break;
      case 'job_type': 
        hint = '请选择职位类型';
        break;
      case 'empl_type': 
        hint = '请选择工作类型';
        break;
      case 'working_exp': 
        hint = '请选择工作经验';
        break;
      case 'display': 
        hint = '请选择工作城市';
        break;
      case 'job_require': 
        hint = '请输入工作要求';
        break;
      case 'low_salary': 
        hint = '请输入最低薪资';
        break;
      case 'high_salary': 
        hint = '请输入最高薪资';
        break;
      case 'job_address': 
        hint = '请输入工作地址';
        break;
      case 'recruit': 
        hint = '请输入招聘人数';
        break;
      case 'edu_level': 
        hint = '请选择学历要求';
        break;
    }
    wx.showToast({
      title: hint,
      icon: 'none'
    })
  }
})