// miniprogram/pages/document/folderDetail.js
const app = getApp()
// const wxapi = require('../../utils/wxapi')
const cnchar = require('../../utils/cnchar')
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    folders: [], // 文件夹列表
    files: [], // 文件列表
    selectList: [], // 选择列表，全bool，和文件列表下标对应
    isMenuShow: false, // 是否展示更多菜单
    isSelect: false,  // 是否有文件被选择了，用于展示底部actionsheet菜单
    selectCount: 0,   // 选择计数器
    isDialogShow: false,  // 是否显现跳转登陆弹窗
    dialogBtns: [{ text: '取消' }, { text: '前往登陆' }], // 登陆弹窗按钮
    isCollect: false, // 是否是收藏页面
  },

  // 下载文件
  download: function () {
    // 必须先选择了文件
    if (!this.data.selectCount) return;
    wx.showToast({
      title: '小程序暂不支持此功能, 请复制链接再下载',
      icon: 'none'
    })
  },

  // 取消收藏
  delCollect: function () {
    // 必须先选择了文件
    if (!this.data.selectCount) return

    // 未登陆则先登陆，并传递需要回调，在onshow读取回调再次调用本函数
    if (!app.globalData.isLogined) {
      this.setData({ isDialogShow: true })
      return
    }
    else {
      // 先根据学号读取是否有信息
      db.collection('doc_collect').where({
        username: app.globalData.basicInfo.username
      }).get().then(res => {
        console.log(res)
        // 先筛选出本次要删除的信息
        var targetList = []
        for (let i = 0; i < this.data.selectList.length; i++) {
          if (this.data.selectList[i]) targetList.push(this.data.files[i])
        }
        // 原来有收藏需要进行排除
        let cloudFiles = res.data[0].files
        for (let item of targetList) {
          for (let index = 0; index < cloudFiles.length; index++) {
            if (cloudFiles[index].name == item.name) {
              cloudFiles.splice(index, 1)
              index--
            }
          }
        }
        return db.collection('doc_collect').doc(res.data[0]._id).update({
          data: {
            files: cloudFiles
          }
        })
      }).then(res => {
        console.log(res)
        if (res.errMsg == "document.update:ok") {
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          })
          this.setData({
            isSelect: false,
            selectList: this.data.selectList.fill(false),
            selectCount: 0
          })
          this.onLoad({ 'collect': true })
        }
      })
    }
  },

  // 收藏文件
  addCollect: function () {
    // 必须先选择了文件
    if (!this.data.selectCount) return

    // 未登陆则先登陆，并传递需要回调，在onshow读取回调再次调用本函数
    if (!app.globalData.isLogined) {
      this.setData({ isDialogShow: true })
      return
    }
    else {
      // 先根据学号读取是否有信息
      db.collection('doc_collect').where({
        username: app.globalData.basicInfo.username
      }).get().then(res => {
        console.log(res)
        // 先筛选出本次要添加的信息
        var targetList = []
        for (let i = 0; i < this.data.selectList.length; i++) {
          if (this.data.selectList[i]) targetList.push(this.data.files[i])
        }
        // 如果原来没有收藏则直接添加
        if (0 == res.data.length) {
          return db.collection('doc_collect').add({
            data: {
              username: app.globalData.basicInfo.username,
              files: targetList
            }
          })
        }
        // 原来有收藏需要进行排除
        else {
          let cloudFiles = res.data[0].files
          for (let item of cloudFiles) {
            for (let index = 0; index < targetList.length; index++) {
              if (targetList[index].name == item.name) {
                targetList.splice(index, 1)
                index--
              }
            }
          }
          if (!targetList.length) return undefined
          else cloudFiles = cloudFiles.concat(targetList)
          return db.collection('doc_collect').doc(res.data[0]._id).update({
            data: {
              files: cloudFiles
            }
          })
        }
      }).then(res => {
        console.log(res)
        if (res == undefined) {
          wx.showToast({
            title: '已存在相同文件',
            icon: 'none'
          })
        } else if (res.errMsg == "collection.add:ok" || res.errMsg == "document.update:ok") {
          wx.showToast({
            title: '收藏成功',
            icon: 'success'
          })
          this.setData({
            isSelect: false,
            selectList: this.data.selectList.fill(false),
            selectCount: 0
          })
        }
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

  // 复制链接
  async copyUrl() {
    if (!this.data.selectCount) return;
    wx.showLoading({
      title: '获取链接中',
    })
    let str = '校会小莞家-文件分享链接\n'
    let selectList = this.data.selectList
    for (let i = 0; i < selectList.length; i++) {
      if (selectList[i]) {
        str = str + this.data.files[i].name + ': ' + this.data.files[i].short + '\n'
      }
    }

    // let flag = false
    // for (let i = 0; i < srcList.length / 50; i++) {
    //   let res = await wxapi.getTempFileURL({
    //     fileList: srcList.slice(i * 50, (i + 1) * 50),
    //   })
    //   res.fileList.map((value, key) => str = str + targetList[i * 50 + key].name + ': ' + value.tempFileURL + '\n')
    // }

    wx.setClipboardData({
      data: str,
      success: res => {
        wx.hideLoading({
          complete: (res) => {
            wx.showToast({
              title: '复制成功',
              icon: 'success'
            })
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果是根文件夹，根据穿进来的下标读取文件夹信息
    if (options.index) {
      this.setData({
        folder: app.globalData.document[parseInt(options.index)],
        folders: app.globalData.document[parseInt(options.index)].folders,
        files: app.globalData.document[parseInt(options.index)].files,
        selectList: new Array(app.globalData.document[parseInt(options.index)].files.length).fill(false)
      })
      wx.setNavigationBarTitle({
        title: app.globalData.document[parseInt(options.index)].name
      })
    }
    // 如果是普通文件夹，格式化后读取信息
    else if (options.folder) {
      let folder = JSON.parse(options.folder)
      console.log(folder)
      this.setData({
        folder: app.globalData.document[parseInt(options.index)],
        folders: folder.folders,
        files: folder.files,
        selectList: new Array(folder.files.length).fill(false)
      })
      wx.setNavigationBarTitle({
        title: folder.name
      })
    }
    // 如果是分享类型，格式化后读取文件信息
    else if (options.share) {
      let folder = JSON.parse(options.share)
      console.log(folder)
      this.setData({
        folder: folder,
        folders: folder.folders,
        files: folder.files,
        selectList: new Array(folder.files.length).fill(false)
      })
      wx.setNavigationBarTitle({
        title: '分享文件',
      })
    }
    // 如果是收藏文件夹，读取数据库信息
    else if (options.collect) {
      db.collection('doc_collect').where({
        username: app.globalData.basicInfo.username
      }).get().then(res => {
        let files = res.data[0].files
        this.setData({
          folder: { 'folders': '', 'files': files },
          files: files,
          selectList: new Array(files.length).fill(false),
          isCollect: true
        })
      })
      wx.setNavigationBarTitle({
        title: '我的收藏'
      })
      wx.hideShareMenu({
        complete: (res) => { },
      })
    }
  },

  // 按名称比较
  sortByName: function (event) {
    let rev = event.currentTarget.dataset.type == '1' ? true : false
    var sortedFolders = this.data.folders.sort(this.sortBy('name', rev))
    var sortedFiles = this.data.files.sort(this.sortBy('name', rev))
    this.setData({
      isMenuShow: !this.data.isMenuShow,
      folders: sortedFolders,
      files: sortedFiles
    })
  },

  // 按时间排序
  sortByTime: function (event) {
    var sortedFolders = this.data.folders.sort(this.sortBy('date', false))
    var sortedFiles = this.data.files.sort(this.sortBy('date', false))
    this.setData({
      isMenuShow: !this.data.isMenuShow,
      folders: sortedFolders,
      files: sortedFiles
    })
  },

  // 比较函数
  sortBy: function (para, rev) {
    rev == undefined ? true : false
    if(para == 'time'){
      return function (a, b) {
        if (rev) return a[para].localeCompare(b[para], 'zh')
        else return b[para].localeCompare(a[para], 'zh')
      }
    }else{
      return function (a, b) {
        if (rev) return a[para].spell().localeCompare(b[para].spell())
        else return b[para].spell().localeCompare(a[para].spell())
      }
    }
  },

  // 预览文件，如果没有缓存则下载缓存到本地 
  previewFile: function (event) {
    console.log(event)
    let index = event.currentTarget.dataset.index
    if (undefined == this.data.files[index].tempUrl) {
      wx.showLoading({
        title: '加载文件中',
      })
      wx.cloud.downloadFile({
        fileID: this.data.files[index].src,
        success: res => {
          wx.hideLoading({})
          wx.openDocument({
            filePath: res.tempFilePath,
          })
          let target = 'files[' + String(index) + '].tempUrl'
          this.setData({
            [target]: res.tempFilePath
          })
        }
      })
    } else {
      wx.openDocument({
        filePath: this.data.files[index].tempUrl,
      })
    }
  },

  // 选择文件
  selectFile: function (event) {
    let target = 'selectList[' + String(event.currentTarget.dataset.index) + ']'
    this.setData({
      [target]: !this.data.selectList[String(event.currentTarget.dataset.index)],
      selectCount: !this.data.selectList[String(event.currentTarget.dataset.index)] ? this.data.selectCount + 1 : this.data.selectCount - 1
    })
    for (let i = 0; i < this.data.selectList.length; i++) {
      if (this.data.isSelect && this.data.selectList[i]) return
      else if (!this.data.isSelect && this.data.selectList[i]) {
        this.setData({
          isSelect: true
        })
        return
      }
    }
    this.setData({
      isSelect: false
    })
    return
  },

  // 全选文件
  fullSelect: function () {
    this.setData({
      selectCount: this.data.files.length,
      selectList: this.data.selectList.fill(true)
    })
  },

  // 取消选择文件
  cancelSelect: function () {
    this.setData({
      selectCount: 0,
      selectList: this.data.selectList.fill(false),
      isSelect: false
    })
  },

  // 显示菜单窗口
  showMoreMenu: function () {
    this.setData({
      isMenuShow: !this.data.isMenuShow
    })
  },

  // 点击选择文件
  setSelect: function () {
    this.setData({
      isSelect: true,
      isMenuShow: false
    })
  },

  // 监听页面滚动，绑定页面点击事件，关闭菜单窗口
  onPageScroll: function () {
    if (this.data.isMenuShow) {
      this.setData({
        isMenuShow: !this.data.isMenuShow
      })
    }
  },

  // 跳转到其他文件夹
  navigatoDetail: function (e) {
    wx.navigateTo({
      url: './folderDetail?folder=' + JSON.stringify(this.data.folders[e.currentTarget.dataset.index]),
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
    if (this.data.casCallback) this.addCollect()
  },

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
  onShareAppMessage: function (value) {
    if (value.target.dataset.type == 'file') {
      var targetList = []
      for (let i = 0; i < this.data.selectList.length; i++) {
        if (this.data.selectList[i]) targetList.push(this.data.files[i])
      }
      let share = { 'folders': '', 'files': targetList }
      return {
        path: '/pages/document/folderDetail?share=' + JSON.stringify(share)
      }
    } else return { path: '/pages/document/folderDetail?folder=' + JSON.stringify(this.data.folder) }
  }
})