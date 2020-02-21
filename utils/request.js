
const EventProxy = require('./eventproxy.js')

const app = getApp();
try {
  var value = wx.getStorageSync('unionid')
  if (value) {
    app.globalData.unionid = value
  }
} catch (e) {
}
try {
  var value = wx.getStorageSync('userInfo')
  if (value) {
    console.log(value)
    app.globalData.userInfo = value
  }
} catch (e) {
}
try {
  var user = wx.getStorageSync('user');
  if (user) {
    app.globalData.user = user;
  }
} catch (e) {
}
function login(loginCallback){

  const ep = new EventProxy()

  ep.all('code', 'unionid', (code, unionid) => {
    loginCallback();
    // wx.request({
    //   url: `${app.globalData.UrlHeadAddress}/api/user/keep-alive?unionid=${unionid}`,
    // })
  })

  ep.fail(function(err){
    console.error(err)
    login(loginCallback)
  })


  wx.login({
    success: function (res){
      if (res.code) {
        ep.emit('code', res.code)
      } else {
        console.log('登录失败！' + res.errMsg)
        ep.emit('error', res.errMsg);
      }
    },
    fail:function(){
      ep.emit('error', 'login failed');
    }
  })



  ep.all('code', (code) => {
    console.log(app.globalData.user);
    var user = wx.getStorageSync('user');
    console.log(user)
    wx.request({
      url: `${app.globalData.UrlHeadAddress}/qzApi/login`,
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        code: code,
        rawData: app.globalData.user.rawData ? app.globalData.user.rawData : user.rawData,
        signature: app.globalData.user.signature ? app.globalData.user.signature : user.signature,
        encryptedData: app.globalData.user.encryptedData ? app.globalData.user.encryptedData : user.encryptedData,
        iv: app.globalData.user.iv ? app.globalData.user.iv : user.iv
      },
      success(res) {
        console.log(res)
        let unionid = res.data.data.unionid || res.data.data[0].unionid;
        try {
          if (res.data.data[0].unionid) {
            try {
              let userInfo = res.data.data[0];
              switch (userInfo.rule) {
                case 0:
                  res.data.data[0].rule = 'job_seeker';
                  break;
                case 1:
                  res.data.data[0].rule = 'recruiter';
                  break;
                default:
                  res.data.data[0].rule = '';
              }
              wx.setStorageSync('userInfo', userInfo);
            } catch (e) {
            }
          }
        } catch (e) {
        }
        app.globalData.unionid = unionid;
        try {
          wx.setStorageSync('unionid', unionid);
        } catch (e) {
        }
        console.log('set', wx.getStorageSync('unionid'));
        ep.emit('unionid', unionid);
      },
      fail() {
        ep.emit('error', '获取用户信息失败');
      }
    })

  })

  // if (!app.globalData.user){
  //   console.error('Userinfo is not ready!!!');
  // }


}

function request(action, data, method, reqesutCallback){
  
  if (!app.globalData.unionid ){  // 调用请求时候查看用户unionid是否已获取
    console.log('暂无 unionid')
    login(function(){
      _request(action, data, method, reqesutCallback )
    }, action, data, method)
  }else{
    console.log('unionid 已存在')

    _request(action, data, method, reqesutCallback);
  }

}

function _request(action, data, method, reqesutCallback){
  let url = `${app.globalData.UrlHeadAddress}/qzApi/${action}?unionid=${app.globalData.unionid}`;
  wx.request({
    url,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method,
    success: function (res) {
      console.log(res)
      reqesutCallback(res)
    },
    data,
    fail: function () {
      console.log("失败")
      request(action, data, method, reqesutCallback)
    }
  })
}

module.exports = {
  request: request,
  login: login
}