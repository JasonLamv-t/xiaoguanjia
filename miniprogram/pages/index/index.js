//index.js
// 引入qqmap sdk
var QQMapWX = require('../../libs/qqmap-wx-jssdk1.2/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'OJZBZ-FZHW6-WUTS5-EK3YE-GZKC3-3ZBEO'
})
// 引入time js
var utils = require('../../utils/time.js')


const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogined: false, // 登录态
    active: 0, // 当前活动的标签页，默认为服务

    // 以下为地理及天气信息
    city: '',
    position: '',
    nowTamp: '',
    airQuality: '',
    cond_code: '999d',

    // tabs设置
    tabs: [],
    activeTab: 0,

    hasUserData: false, // 是否有用户数据
    userData: '', // 用户数据
  },

  onTabCLick(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
    console.log(e)
  },

  onChange(e) {
    const index = e.detail.index
    this.setData({ activeTab: index })
    console.log(e)
  },

  onLoad: function (options) {
    // 设置首页tabs
    const titles = ['服务', '专区']
    const tabs = titles.map(item => ({ title: item }))
    this.setData({ tabs })

    // 更新位置和天气信息
    if (app.globalData.location.longitude) {
      this.getLocationText()
      this.getWeatherInfo()
    } else {
      app.locationReadyCallback = res => {
        this.getLocationText()
        this.getWeatherInfo()
      }
    }
  },

  onShow: function () {
    // 更新用户信息
    if (app.globalData.basicInfo) {
      this.setData({
        hasUserData: true,
        userData: app.globalData.basicInfo
      })
    } else {
      app.basicInfoReadyCallback = res => {
        this.setData({
          hasUserData: true,
          userData: res.data
        })
      }
    }

    // 获取登录态
    this.setData({
      isLogined: app.globalData.isLogined
    })
  },

  // 获取天气信息
  getWeatherInfo: function (event) {
    var time = new Date().getHours()
    time = time >= 18 || time <= 6 ? 'n' : 'd'
    // 第一次请求，获取实况天气数据
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now',
      data: {
        location: app.globalData.location.longitude + ',' + app.globalData.location.latitude,
        key: "a0405ffd044e4bab9dbaa75a06287df3"
      },
      success: res => {
        var nowWeather = res.data.HeWeather6[0].now
        this.setData({
          cond_code: nowWeather.cond_code + time,
          nowTamp: nowWeather.tmp + '℃'
        })
      }
    })
    // 第二次请求，获取空气质量信息
    // 校验城市信息是否获得，此处是因为和风天气经纬度传参失效，使用回调
    if (this.data.city != '') {
      wx.request({
        url: 'https://free-api.heweather.net/s6/air/now',
        data: {
          location: this.data.city,
          key: "a0405ffd044e4bab9dbaa75a06287df3"
        },
        success: res => {
          var air = res.data.HeWeather6[0].air_now_city.qlty
          if (air != '优' && air != '良') {
            air = '差'
          }
          this.setData({
            airQuality: air
          })
        }
      })
    } else {
      this.cityReadyCallback = res => {
        wx.request({
          url: 'https://free-api.heweather.net/s6/air/now',
          data: {
            location: res.result.address_component.city,
            key: "a0405ffd044e4bab9dbaa75a06287df3"
          },
          success: res => {
            var air = res.data.HeWeather6[0].air_now_city.qlty
            if (air != '优' && air != '良') {
              air = '差'
            }
            this.setData({
              airQuality: air
            })
          }
        })
      }
    }
  },

  //获取地理信息文本
  getLocationText: function (event) {
    qqmapsdk.reverseGeocoder({
      // 调用QQmap 地址逆解析接口
      success: res => {
        console.log(res)
        this.setData({
          city: res.result.address_component.city,
          position: res.result.address_component.street
        })
        // 回调
        if (this.cityReadyCallback) {
          this.cityReadyCallback(res)
        }
      }
    })
  },

  // // 标签页变换，用于更新显示效果
  // tabsChange: function(event) {
  //   if (event.detail.index) {
  //     this.setData({
  //       isFooterBottom: true
  //     })
  //   } else {
  //     this.setData({
  //       isFooterBottom: false
  //     })
  //   }
  // },

  // 扫码
  scan: function (event) {
    wx.showToast({
      title: '肉肉还在学哦',
      icon: 'none'
    })
  },

  onShareAppMessage(){
    
  }
})