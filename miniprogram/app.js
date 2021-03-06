//app.js
import wxapi from './utils/wxapi.js'
import { promisifyAll, promisify } from 'miniprogram-api-promise';

// promisify all wx's api
const wxp = {}
promisifyAll(wx, wxp)

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

    const db = wx.cloud.database()

    // 全局变量
    this.globalData = {
      wxp: wxp,         // promise API
      isLogined: false, // 登录态
      // 位置信息
      location: {
        latitude: '',
        longitude: ''
      },
      canFingerPrintUse: false, // 是否有指纹能力
      basicInfo: {}, // 中央认证返回的基本信息，包括了绑定学校认证系统的wx_openid
      // 用户账户及密码
      user: {
        username: '',
        password: ''
      },
      stuData: '', // 用户学工系统信息+用户绑定的手机号
      image: '', //用户证件照
      // 用户设置
      setting: {
        isUseFinger: false,
      },
      hasUserData: false, // 是否有登记学生组织信息和联系方式
      userData: undefined, // 学生组织信息和联系方式

      document: [], // 常用文档根数据目录

      safeArea: [], // 设备安全区域
      system: '', // 设备系统
      windowHeight: '', // 窗口高度
      statusBarHeight: '', // 状态栏高度
      homeBarHeight: '', // home区域高度
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

    // 获取用户绑定的手机号
    db.collection('userPhone').get().then(res => {
      console.log(res)
      if (res.data.length) {
        this.globalData.basicInfo.phone = res.data[0].phone
      }
    }).catch(err => {
      console.error('get DB user phone fail', err)
    })

    // 校验指纹能力
    wxp.checkIsSupportSoterAuthentication().then(res => {
      if (res.supportMode == undefined) return
      if (res.supportMode[0] == 'fingerPrint') {
        wx.checkIsSoterEnrolledInDevice({
          checkAuthMode: 'fingerPrint',
          success: res => {
            this.globalData.canFingerPrintUse = res.isEnrolled
          }
        })
      }
    }).catch(err => {
      console.error('check finger fail', err)
    })

    // 获取储存在本地的用户基本信息
    wxp.getStorage({ key: 'basicInfo' }).then(res => {
      this.globalData.basicInfo = res.data

      if (this.basicInfoReadyCallback) {
        this.basicInfoReadyCallback(res)
      }
    }).catch(err => {
      console.error('get basicInfo fail', err)
    })

    // 获取储存在本地的用户设置
    wxp.getStorage({ key: 'setting' }).then(res => {
      this.globalData.setting = res.data
    }).catch(err => {
      console.error('get setting err', err)
      wx.setStorage({
        key: 'setting',
        data: this.globalData.setting,
      })
    })

    // 获取设备信息
    wx.getSystemInfo({
      complete: res => {
        console.log(res)
        this.globalData.safeArea = res.safeArea
        this.globalData.system = res.system
        this.globalData.windowHeight = res.windowHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.homeBarHeight = res.screenHeight - res.safeArea.bottom
      },
    })
  }
})