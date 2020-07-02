// miniprogram/pages/casLogin/casLoginNew.js
const wxapi = require('../../utils/wxapi.js')
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 账户名及密码
    username: '',
    password: '',
    // toptip提示内容
    error: '',
    // 指纹弹窗显示控制
    dialogShow: false,
    // 帮助说明显示控制
    helpShow: false,
    // 指纹弹窗按钮
    buttons: [{
      text: '暂不开启'
    }, {
      text: '立即开启'
    }],
    // 密码是否聚焦
    isPwdFocus: false,
    needCallback: false, // 需要设置回调，告诉上一个页面我返回了
  },

  // 输入账户完成后自动聚焦密码
  setPwdFocus: function () {
    this.setData({ isPwdFocus: true })
  },

  // 显示帮助窗口
  showHelp: function () {
    this.setData({ helpShow: true })
  },

  // 监听输入框输入，实时更新输入框数据
  bindinput: function (event) {
    if (event.target.dataset.index == 'username') {
      this.setData({ username: event.detail.value })
    } else {
      this.setData({ password: event.detail.value })
    }
  },

  // 点击弹窗按钮
  tapDialogButton: function (event) {
    // console.log(event) 
    if (event.detail.index) {
      wx.startSoterAuthentication({
        requestAuthModes: ['fingerPrint'],
        challenge: '123456',
        authContent: '请验证指纹',
        success: res => {
          this.setData({ dialogShow: false })
          wx.showToast({ title: '验证成功' })
          // 保存密码到本地
          wx.setStorage({
            key: 'user',
            data: app.globalData.user
          })
          // 保存设置
          app.globalData.setting.isUseFinger = true
          wx.setStorage({
            key: 'setting',
            data: app.globalData.setting,
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 1500)
        }
      })
    } else {
      this.setData({ dialogShow: false })
      wx.navigateBack({})
    }
  },

  // 登录
  async login(event) {
    wx.showLoading({ title: '登录中' })

    // 通过云函数获取token和session
    wxapi.callFunction({
      name: 'getCas',
      data: {
        url: 'cas'
      }
    }).then(cas => {
      let token = cas.result.token
      let head = {
        "content-type": "application/x-www-form-urlencoded",
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        Cookie: cas.result.PHPSESSID + "; last_oauth_appid=xgxtt; last_oauth_state=home"
      }

      // 验证并获取回调地址
      return wxapi.request({
        url: 'https://cas.dgut.edu.cn/home/Oauth/getToken/appid/javaee/state/miniprogram.html',
        method: 'POST',
        header: head,
        data: {
          __token__: token,
          username: this.data.username,
          password: this.data.password
        }
      }).then(res => {
        res = JSON.parse(res.data)
        console.log(res)
        // 如果验证通过
        if (res.code == 1) {
          // 取得回调携带的Token
          var Token = res.info.slice(res.info.indexOf('token=') + 6, res.info.indexOf('&'))
          wxapi.request({
            url: 'https://cas.dgut.edu.cn/ssoapi/v2/checkToken',
            method: 'POST',
            data: {
              appid: 'javaee',
              appsecret: 'b3b52e43ccfd',
              token: Token,
              userip: '129.204.45.70' //这里应该是随便都可以除了服务器的ip
            },
            header: head
          }).then(res => {
            console.log(res)
            // 如果没有错误
            if (!res.data.error) {
              // 第四次请求，获取用户信息
              wxapi.request({
                url: 'https://cas.dgut.edu.cn/oauth/getUserInfo',
                method: 'POST',
                data: {
                  openid: res.data.openid,
                  access_token: res.data.access_token
                },
                header: head,
              }).then(response => {
                wx.hideLoading()
                console.log(response.data)
                // 设置登录态
                app.globalData.isLogined = true
                // 保存账户密码到全局变量
                app.globalData.user = {
                  username: this.data.username,
                  password: this.data.password
                }
                // 保存个人信息到全局变量和本地
                app.globalData.basicInfo = response.data
                wx.setStorage({
                  key: 'basicInfo',
                  data: response.data,
                })

                // 根据绑定学校中央认证的wx_openid来查询是否填写了学生组织信息
                db.collection('userData').where({
                  wx_openid: response.data.wx_openid
                }).get().then(res => {
                  // console.log(res)
                  // 如果数据库没有数据
                  if (res.data.length == 0) {
                    app.globalData.userData = ''
                  } else {
                    app.globalData.userData = res.data[0]
                    app.globalData.hasUserData = true
                  }
                })

                // 根据指纹能力提示弹窗
                if (app.globalData.canFingerPrintUse && !app.globalData.setting.isUseFinger) {
                  this.setData({ dialogShow: true })
                } else {
                  wx.showToast({ title: '登录成功' })
                  setTimeout(function () {
                    wx.navigateBack({})
                  }, 1500)
                }
              })
            } else {
              // 如果有错误
              wx.hideLoading()
              this.setData({ error: res.data.message })
            }
          })
        } else {
          // 如果验证不通过，显示错误信息
          wx.hideLoading()
          this.setData({ error: res.message })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if (app.globalData.basicInfo) {
      this.setData({
        username: app.globalData.basicInfo.username
      })
    }
    if (app.globalData.setting.isUseFinger) {
      wx.startSoterAuthentication({
        requestAuthModes: ['fingerPrint'],
        challenge: '123456',
        authContent: '请验证指纹',
        success: res => {
          let user = wx.getStorageSync('user')
          this.setData({
            username: user.username,
            password: user.password
          })
          this.login()
        }
      })
    }
    if (options.callback) this.setData({ callback: options.callback })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 监听页面卸载
   */
  onUnload: function () {
    if (this.data.callback) {
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      prevPage.setData({
        [this.data.callback]: true
      })
    }
  }
})