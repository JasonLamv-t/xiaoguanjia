// miniprogram/pages/document/document.js
const db = wx.cloud.database()
const app = getApp()
const cnchar = require('../../utils/cnchar')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    folders: [],
    isMenuShow: false,
    collectFolder: '',
    isDialogShow: false,
    dialogBtns: [{ text: '取消' }, { text: '前往登陆' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取全部文件
    db.collection('document').get().then(res => {
      app.globalData.document = res.data
      this.setData({
        folders: res.data
      })
    })
  },

  // 跳转收藏
  navigatoDetail: function () {
    if (!app.globalData.isLogined) this.setData({ isDialogShow: true })
    else {
      wx.navigateTo({
        url: './folderDetail?collect=true',
      })
    }
  },

  // 点击弹窗前往中央认证页面
  navigatoCas: function (event) {
    if (event.detail.index) {   // 点击前往登陆
      wx.navigateTo({
        url: '../casLogin/casLogin?callback=casCallback',
      })
    }
    this.setData({ isDialogShow: false })
  },

  // 按名称比较
  sortByName: function (event) {
    let rev = event.currentTarget.dataset.type == '1' ? true : false
    var sortedFolders = this.data.folders.sort(this.sortBy('name', rev))
    this.setData({
      isMenuShow: !this.data.isMenuShow,
      folders: sortedFolders
    })
  },

  // 按时间排序
  sortByTime: function (event) {
    var sortedFolders = this.data.folders.sort(this.sortBy('date', false))
    this.setData({
      isMenuShow: !this.data.isMenuShow,
      folders: sortedFolders
    })
  },

  // 比较函数
  sortBy: function (para, rev) {
    rev == undefined ? true : false
    return function (a, b) {
      if (rev) return a[para].spell().localeCompare(b[para].spell())
      else return b[para].spell().localeCompare(a[para].spell())
    }
  },

  // 显示菜单窗口
  showMoreMenu: function () {
    this.setData({
      isMenuShow: !this.data.isMenuShow
    })
  },

  // 监听页面滚动并关闭菜单窗口
  onPageScroll: function () {
    if (this.data.isMenuShow) {
      this.setData({
        isMenuShow: !this.data.isMenuShow
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.casCallback) {
      this.setData({casCallback:false})
      this.navigatoDetail()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

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
  onShareAppMessage: function () { }
})