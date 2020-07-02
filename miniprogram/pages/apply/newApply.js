// miniprogram/pages/apply/newApply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '点击获取手机号',
    isSMS: true,
    slideButtons: [{
      text: '普通'
    }, {
      type: 'warn',
      text: '警示'
    }],
  },

  changeSMS: function (e) {
    if (!e.target.dataset.id && this.data.isSMS) this.setData({
      isSMS: false
    })
    else if (e.target.dataset.id && this.data.isSMS) this.setData({
      isSMS: false
    })
    else this.setData({
      isSMS: true
    })
  },

  getPhoneNumber: function (e) {
    console.log(e.detail.cloudID)
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        cloudID: wx.cloud.CloudID(e.detail.cloudID)
      },
      success: res => {
        // console.log(res)
        this.setData({
          phoneNumber: res.result
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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

  }
})