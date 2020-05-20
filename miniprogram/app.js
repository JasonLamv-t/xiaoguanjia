//app.js
import wxapi from './utils/wxapi.js'

App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'main-dgutsu',
        traceUser: true,
      })
    }

    this.globalData = {
      isLogined: false, // 登录态
      // 位置信息
      location: {
        latitude: '',
        longitude: ''
      },
      canFingerPrintUse: false, // 是否有指纹能力
      basicInfo: '', // 中央认证返回的基本信息，包括了绑定学校认证系统的wx_openid
      // 用户账户及密码
      user: {
        username: '',
        password: ''
      },
      stuData: '', // 用户学工系统信息
      image: '', //用户证件照
      // 用户设置
      setting: {
        isUseFinger: false,
      },
      hasUserData: false,   // 是否有登记学生组织信息和联系方式
      userData: undefined,  // 学生组织信息和联系方式

      document: [],   // 常用文档根数据目录

      safeArea: [],   // 设备安全区域
      system: '',     // 设备系统
      windowHeight: '', // 窗口高度
    }

    // 获取用户授权设置
    wxapi.getSetting({}).then(res => {
      // 如果没有地理位置授权
      if (!res.authSetting['scope.userLocation']) {
        // 先请求授权
        wxapi.authorize({
          scope: 'scope.userLocation'
        }).then(res => {
          // 再获取经纬度
          wxapi.getLocation({
            isHighAccuracy: true,
            highAccuracyExpireTime: 3500,
          }).then(res => {
            this.globalData.location.latitude = res.latitude
            this.globalData.location.longitude = res.longitude
            // getlocation 回调
            if (this.locationReadyCallback) {
              this.locationReadyCallback(res)
            }
          })
        })
      } else {
        // 直接获取经纬度
        wxapi.getLocation({
          isHighAccuracy: true,
          highAccuracyExpireTime: 3500,
        }).then(res => {
          this.globalData.location.latitude = res.latitude
          this.globalData.location.longitude = res.longitude
          // getlocation 回调
          if (this.locationReadyCallback) {
            this.locationReadyCallback(res)
          }
        })
      }
    })

    // 校验指纹能力
    wx.checkIsSupportSoterAuthentication({
      success: res => {
        if (res.supportMode[0] == 'fingerPrint') {
          wx.checkIsSoterEnrolledInDevice({
            checkAuthMode: 'fingerPrint',
            success: res => {
              this.globalData.canFingerPrintUse = res.isEnrolled
            }
          })
        }
      }
    })

    // 获取储存在本地的用户基本信息
    wx.getStorage({
      key: 'basicInfo',
      success: res => {
        this.globalData.basicInfo = res.data

        if (this.basicInfoReadyCallback) {
          this.basicInfoReadyCallback(res)
        }
      },
    })

    // 获取储存在本地的用户设置
    wx.getStorage({
      key: 'setting',
      success: res => {
        this.globalData.setting = res.data
      },
    })

    // 获取设备信息
    wx.getSystemInfo({
      complete: (res) => {
        console.log(res)
        this.globalData.safeArea = res.safeArea,
        this.globalData.system = res.system,
        this.globalData.windowHeight = res.windowHeight
      },
    })
  }
})