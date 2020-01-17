
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
function login(loginCallback, actions, datas, methods){
  
  var that = this
  const ep = new EventProxy()

  ep.all('code', 'unionid', (code, unionid) => {
    loginCallback();
    wx.request({
      url: `${app.globalData.UrlHeadAddress}api/user/keep-alive?unionid=${unionid}`,
    })
  })

  ep.fail(function(err){
    console.error(err)

    login(loginCallback, actions, datas, methods)
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
    console.log(app.globalData.user)
    var user = wx.getStorageSync('user')
    wx.request({
      url: `${app.globalData.UrlHeadAddress}api/site/login`,
      method: 'post',
      data: {
        code: code,
        rawData: app.globalData.user.rawData ? app.globalData.user.rawData : user.rawData,
        signature: app.globalData.user.signature ? app.globalData.user.signature : user.signature,
        encryptedData: app.globalData.user.encryptedData ? app.globalData.user.encryptedData : user.encryptedData,
        iv: app.globalData.user.iv ? app.globalData.user.iv : user.iv
      },
      success(res) {
        app.globalData.unionid = res.data.unionid
        console.log(res.data.unionid)
        try {
          wx.setStorageSync('unionid', res.data.unionid)
        } catch (e) {
        }
        console.log('set', wx.getStorageSync('unionid'))
        ep.emit('unionid', res.data.unionid)
      },
      fail() {
        ep.emit('error', '获取用户信息失败')
      }
    })

  })

  if (!app.globalData.user){
    console.error('Userinfo is not ready!!!');
  }


}

function request(action, query, data, method = 'get', reqesutCallback){
  
  if ( !app.globalData.unionid ){
    console.log('暂无')
    login(function(){
      _request(action, query, data, method, reqesutCallback )
    }, action, data, method)
  }else{
    console.log('已在')

    _request(action, query, data, method, reqesutCallback);
  }

}

function _request(action, query, data, method , reqesutCallback){
  wx.request({
    url: `${app.globalData.UrlHeadAddress}api/${action}?unionid=${app.globalData.unionid}`,
    headler: {
      'content-type': 'application/json'
    },
    method,
    success: function (res) {
      reqesutCallback(res)
    },
    data,
    fail: function () {
      console.log("失败")
      request(ction, query, data, method, reqesutCallback)
    }
  })
}

module.exports = {
  request: request,
  login: login
}