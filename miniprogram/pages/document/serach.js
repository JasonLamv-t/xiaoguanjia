// miniprogram/pages/document/serach.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // inputShowed: false,
    // inputVal: ""
    folders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search: this.search.bind(this),
      folders: getApp().globalData.document
    })
  },

  search: function (value) {
    console.log('search is call')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var res = this.deepFirstSearch(this.data.folders, value)
        console.log(res)
        // var res = [{ text: '搜索结果', value: 1 , url: 'test'}, { text: '搜索结果2', value: 2 }]
        resolve(res)
      }, 200)
    })
  },

  // 深度优先遍历检索
  deepFirstSearch: function (folders, target) {
    let index = 0
    var res = []
    
    for(let folder of folders){
      // 首先查找当前文件夹的名字
      if (folder.name.match(target)) {
        res.push({
          text: folder.name,
          url: folder
        })
      }
      let files = folder.files
      // 文件的查找不用递归，因为无法拷贝父文件夹的引用，而且内存开销太大
      for (let file of files) {
        if(file.name.match(target)){
          res.push({
            text: file.name,
            url: folder
          })
        }
      }
      res = res.concat(this.deepFirstSearch(folder.folders, target))
      index++
    }
    return res
  },

  selectResult: function (e) {
    console.log(e.detail)
    wx.redirectTo({
      url: './folderDetail?folder='+JSON.stringify(e.detail.item.url),
    })
  },

  cancelSearch: function () {
    wx.navigateBack({})
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