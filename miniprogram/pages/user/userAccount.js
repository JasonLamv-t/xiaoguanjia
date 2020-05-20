// miniprogram/pages/user/userAccount.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUseFinger: true, // 是否启用指纹
    canFingerPrintUse: false, // 是否拥有指纹能力
    stuData: '', // 学工系统信息
  },

  setFinger: function(event) {
    if (!this.data.canFingerPrintUse) {
      wx.showToast({
        title: '您的设备不支持指纹登录',
        icon: 'none'
      })
    } else {
      // 如果已经启用了指纹
      if (this.data.isUseFinger) {
        // 修改设置
        this.setData({
          isUseFinger: false
        })
        // 保存到全局和本地
        app.globalData.setting.isUseFinger = false
        wx.setStorage({
          key: 'setting',
          data: app.globalData.setting,
        })
        // 移除本地的账户密码
        wx.removeStorage({
          key: 'user',
          success: function(res) {},
        })
      } else {
        // 如果没有启用
        // 校验指纹
        wx.startSoterAuthentication({
          requestAuthModes: ['fingerPrint'],
          challenge: '123456',
          authContent: '请验证指纹',
          success: res => {
            this.setData({
              dialogShow: false
            })
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
            this.setData({
              isUseFinger: true
            })
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
  onLoad: function(options) {
    console.log(app.globalData.stuData)

    this.setData({
      isUseFinger: app.globalData.setting.isUseFinger
    })
    this.data.canFingerPrintUse = app.globalData.canFingerPrintUse

    this.setData({
      stuData: app.globalData.stuData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})