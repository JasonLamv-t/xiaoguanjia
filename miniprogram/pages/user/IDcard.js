// miniprogram/pages/user/IDcard.js
const wxapi = require('../../utils/wxapi.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    stuData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.stuData) {
      this.setData({
        stuData: JSON.stringify(app.globalData.stuData)
      })
    } else {
      app.globalData.stuDataReadyCallback = stuData => {
        this.setData({
          stuData: JSON.stringify(stuData)
        })
      }
    }

    if(app.globalData.image){
      this.setData({
        image: app.globalData.image
      })
    }else {
      app.globalData.imageReadyCallback = image =>{
        this.setData({
          image: image
        })
      }
    }
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
})