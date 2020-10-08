// miniprogram/pages/apply/newApply.js
const app = getApp()
const gb = app.globalData
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '点击获取手机号',  // 手机号码
    isSMS: true,          // 是否发送短信
    slideButtons: [{      // 滑动cell侧边按钮
      text: '普通'
    }, {
      type: 'warn',
      text: '警示'
    }],
    flash: true,      // 用于刷新置底新增按钮

    type: '',         // 申请类型
    basicInfo: '',    // 基本信息
    org: '',          // 学生组织信息
    stuffs: [         // 物品列表
      { name: '', value: 1 }
    ],
    loanDate: '',     // 领取时间
    returnDate: '',   // 归还日期
  },

  // picker修改日期
  dateChange: function (e) {
    console.log(e)
    this.setData({ [e.target.id]: e.detail.value })
  },

  // 输入物品数量
  typingStuffValue: function (e) {
    let target = 'stuffs[' + e.target.dataset.index + '].value'
    if (e.detail.value > 0 || e.detail.value == '') {
      this.setData({ [target]: e.detail.value })
    } else {
      this.setData({ [target]: 1 })
    }
  },

  // 减少物品数量
  mimusValue: function (e) {
    if (this.data.stuffs[e.target.dataset.index].value == 1) {
      this.data.stuffs.splice(e.target.dataset.index, 1)
      let stuffs = this.data.stuffs
      this.setData({ stuffs })
    } else {
      let target = 'stuffs[' + e.target.dataset.index + '].value'
      this.setData({ [target]: this.data.stuffs[e.target.dataset.index].value - 1 })
    }
  },

  // 增加物品数量
  addValue: function (e) {
    let target = 'stuffs[' + e.target.dataset.index + '].value'
    this.setData({ [target]: this.data.stuffs[e.target.dataset.index].value + 1 })
  },

  // 输入物品名称
  typingStuffName: function (e) {
    let target = 'stuffs[' + e.target.dataset.index + '].name'
    this.setData({ [target]: e.detail.value })
  },

  // 新增一项
  addStuff: function (e) {
    this.data.stuffs.push({ name: '', value: 1 })
    this.setData({
      stuffs: this.data.stuffs
    })
    this.flash()
  },

  // 刷新置底
  flash: function (e) {
    this.setData({ flash: false })
    this.setData({ flash: true })
  },

  // 取消申请
  cancel: function (e) {
    wx.redirectTo({ url: '../index/index' })
  },

  // 切换短信选项
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

  // 获取手机号码
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
    console.log(gb)
    this.setData({
      type: parseInt(options.type),
      basicInfo: gb.basicInfo
    })
    // 获取学生组织信息
    db.collection('userData').get().then(res => {
      if (res.data.length) this.setData({ org: res.data[0] })
      else this.setData({ org: null })
    })
    // 获取手机号
    db.collection('userPhone').get().then(res => {
      if (res.data.length) this.setData({ phoneNumber: res.data[0].phone })
    })
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