// miniprogram/pages/user/userAccount.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUseFinger: true, // 是否启用指纹
    canFingerPrintUse: false, // 是否拥有指纹能力
    basicInfo: '',    // 基本信息
    stuData: '',  // 学工系统信息
    error: '',    // 错误提示
    needBind: false,  // 需要绑定组织信息
    showDialog: false,  // 显示绑定提示

    authCode: '',       // 授权码
    isFocus: true,      // 是否聚焦
  },

  // 绑定手机号码
  bindPhone: function (e) {
    console.log(e)
    if (e.detail.cloudID) {
      wx.cloud.callFunction({
        name: 'getPhoneNumber',
        data: {
          cloudID: wx.cloud.CloudID(e.detail.cloudID)
        }
      }).then(res => {
        console.log(res)
        db.collection('userPhone').add({
          data: { phone: res.result }
        })
        app.globalData.stuData.phone = res.result
        this.setData({ stuData: app.globalData.stuData })
        wx.setStorage({
          key: 'basicInfo',
          data: app.globalData.basicInfo,
        })
      }).catch(e => {
        this.setData({error: '绑定失败'})
      })
    } else {
      this.setData({error: '绑定失败'})
    }
  },

  // 实时刷新
  typing: function (e) {
    console.log(e)
    this.setData({ authCode: e.detail.value })
  },

  // 设置聚焦
  setFocus: function (e) {
    this.setData({ isFocus: true })
  },

  // 点击dialog按钮
  tapDialogButton(e) {
    console.log(e)
    // 点击取消
    if (!e.detail.index) this.setData({ showDialog: false })
  },

  // 更改指纹设置
  setFinger: function (event) {
    console.log(event)
    if (!this.data.canFingerPrintUse) {
      wx.showToast({
        title: '您的设备不支持指纹登录',
        icon: 'none'
      })
      // 修改设置
      this.setData({ isUseFinger: false })
      // 保存到全局和本地
      app.globalData.setting.isUseFinger = false
      wx.setStorage({
        key: 'setting',
        data: app.globalData.setting,
      })
      // 移除本地的账户密码
      wx.removeStorage({
        key: 'user',
        success: function (res) { },
      })
    } else {
      // 如果已经启用了指纹
      if (this.data.isUseFinger) {
        // 修改设置
        this.setData({ isUseFinger: false })
        // 保存到全局和本地
        app.globalData.setting.isUseFinger = false
        wx.setStorage({
          key: 'setting',
          data: app.globalData.setting,
        })
        // 移除本地的账户密码
        wx.removeStorage({
          key: 'user',
          success: function (res) { },
        })
      } else {
        // 如果没有启用
        // 校验指纹
        wx.startSoterAuthentication({
          requestAuthModes: ['fingerPrint'],
          challenge: '123456',
          authContent: '请验证指纹',
          success: res => {
            this.setData({ dialogShow: false })
            wx.showToast({
              title: '验证成功',
              icon: 'success'
            })
            // 保存密码到本地
            wx.setStorage({
              key: 'user',
              data: app.globalData.user
            })
            // 保存设置
            this.setData({ isUseFinger: true })
            app.globalData.setting.isUseFinger = true
            wx.setStorage({
              key: 'setting',
              data: app.globalData.setting,
            })
          }
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.stuData)

    db.collection('userData').get()
      .then(res => {
        console.log(res)
        if (!res.data.length) wx.showModal({
          title: '绑定提示',
          content: '您尚未绑定学生组织信息，可能无法使用部分功能',
          confirmText: '立即绑定',
          success: res => {
            if (res.confirm) this.setData({ showDialog: true })
          }
        })
      }).catch(err => this.setData({ error: '网络错误' }))

    this.setData({
      isUseFinger: app.globalData.setting.isUseFinger
    })
    this.data.canFingerPrintUse = app.globalData.canFingerPrintUse

    this.setData({
      stuData: app.globalData.stuData,
      basicInfo: app.globalData.basicInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () { }
})