// miniprogram/pages/wantDGUTbatter/wantDGUTbetter.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs设置
    tabs: [],
    activeTab: 0,
    swiperHeight: '',   // 窗口高度
    isShow: false,
  },

  onTabCLick(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
    // console.log(e)
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
    // console.log(e)
  },

  showAction: function (e) {
    wx.showActionSheet({
      itemList: ['物资申请', '展板申请'],
      success(res) {
        // console.log(res)
        wx.navigateTo({ url: './newApply?type=' + res.tapIndex })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.setData({
      swiperHeight: app.globalData.windowHeight - app.globalData.homeBarHeight - 100
    })

    // 设置首页tabs
    const titles = ['全部', '跟进中', '待我处理']
    const tabs = titles.map(item => ({ title: item }))
    this.setData({ tabs })

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