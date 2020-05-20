// pages/user/user.js
const app = getApp()
const wxapi = require('../../utils/wxapi.js')

Page({
  data: {
    basicInfo: '',
    dialogShow: false,
  },

  navigaToAccount: function(event) {
    wx.showLoading({
      title: '加载中',
    })
    if (app.globalData.stuData) {
      wx.navigateTo({
        url: 'userAccount',
      })
      wx.hideLoading()
    }else{
      app.globalData.stuDataReadyCallback = res => {
        wx.navigateTo({
          url: 'userAccount',
        })
        wx.hideLoading()
      }
    }
  },

  onLoad: function(options) {
    // 禁用页面转发
    wx.hideShareMenu({})
    // 更新用户信息
    if (app.globalData.basicInfo) {
      this.setData({
        hasbasicInfo: true,
        basicInfo: app.globalData.basicInfo
      })
    } else {
      app.basicInfoReadyCallback = res => {
        this.setData({
          hasbasicInfo: true,
          basicInfo: res.data
        })
      }
    }

    // 如果没有全局没有学工系统信息
    if (!app.globalData.stuData) {
      // 获取学工系统信息
      // 通过云函数请求获得token和session
      wxapi.callFunction({
        name: 'getCas',
        data: {
          url: 'stu'
        }
      }).then(cas => {
        // 包括token和session
        let token = cas.result.token
        let head = {
          "content-type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cas.result.PHPSESSID + "; last_oauth_appid=xgxtt; last_oauth_state=home"
        }
        // post请求得到回调携带token的回调地址
        return wxapi.request({
          url: 'https://cas.dgut.edu.cn/home/Oauth/getToken/appid/xgxtt/state/home.html',
          method: 'POST',
          header: head,
          data: {
            __token__: token,
            username: 201741404229,
            password: '990925lh'
          }
        })
      }).then(res => {
        res = JSON.parse(res.data)
        // 请求得到的回调地址,获取新的session
        return wxapi.callFunction({
          name: 'request',
          data: {
            url: res.info
          }
        })
      }).then(response => {
        // 保存新的session
        let head = {
          "content-type": "application/x-www-form-urlencoded",
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: response.result.headers['set-cookie'][1] + "; last_oauth_appid=xgxtt; last_oauth_state=home"
        }

        // 请求基本信息
        wxapi.callFunction({
          name: 'request',
          data: {
            url: 'http://stu.dgut.edu.cn/student/basicinfo/basicInfo.jsp',
            headers: head,
          }
        }).then(basicInfo => {
          basicInfo = this.reformData(basicInfo.result.body)
          // 保存打全局并设置回调
          app.globalData.stuData = basicInfo
          if (app.globalData.stuDataReadyCallback) {
            app.globalData.stuDataReadyCallback(basicInfo)
          }
          console.log(basicInfo)
        })

        // 请求证件照
        wxapi.callFunction({
          name: 'request',
          data: {
            url: 'http://stu.dgut.edu.cn/student/module/attachDownload.jsp?type=photoInfoType&path=' +
              app.globalData.basicInfo.username + '.jpg&studentId=' + app.globalData.basicInfo.username,
            headers: head,
            responseType: 'arraybuffer'
          }
        }).then(image => {
          console.log(image)
          // 保存到全局并设置回调
          app.globalData.image = 'data:image/jpeg;base64,' + wx.arrayBufferToBase64(image.result.body)
          if (app.globalData.imageReadyCallback) {
            app.globalData.imageReadyCallback('data:image/jpeg;base64,' + wx.arrayBufferToBase64(image.result.body))
          }
        })
      })
    }
  },

  // 重整学工系统数据
  reformData: function(form) {
    // 格式化表单,去除空格缩进换行
    form = form.replace(/[ ]/g, "")
    form = form.replace(/[\r\t]/g, "")
    form = form.replace(/[\r\n]/g, "")
    // console.log(form)
    var findWord = function(keyWord, front, after = '</td>', i = 4) {
      let index = form.indexOf(keyWord)
      return form.slice(form.indexOf(front, index) + i, form.indexOf(after, index))
    }

    return {
      studentType: findWord('学生类型', '"2">'),
      stuID: app.globalData.basicInfo.username,
      name: findWord('姓名', '5%">'),
      faculty: findWord('所在学院', '"2">'),
      major: findWord('所在专业', '<td>'),
      grade: findWord('年级', '<td>', '&nbsp;'),
      _class: findWord('自然班', '<td>', '&nbsp;'),
      sex: findWord('性别', '<td>'),
      nation: findWord('民族', '<td>')
    }
    // console.log(result)
  },

  // 点击数据来源
  showDialog: function(event) {
    this.setData({
      dialogShow: true
    })
  },
})