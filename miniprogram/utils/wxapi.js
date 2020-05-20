// const utils = require('./wxapi.js');
// wxapi.login()
//   .then(res => {
//     console.log('login--->', res);
//     return wxapi.getSetting();
//   }).then(res => {
//     console.log('getSetting--->', res);
//     return wxapi.getUserInfo();
//   }).then(res => {
//     console.log('userInfo--->', res);
//   }).catch(err => {
//     console.log(err);
//   });

/**
 * promise化接口
 */
function wxPromisify(functionName, params) {
  return new Promise((resolve, reject) => {
    wx[functionName]({
      ...params,
      success: res => resolve(res),
      fail: res => reject(res)
    });
  });
}

function wxCloudPromisify(functionName, params) {
  return new Promise((resolve, reject) => {
    wx.cloud[functionName]({
      ...params,
      success: res => resolve(res),
      fail: res => reject(res)
    });
  });
}

// 获得云文件临时链接
function getTempFileURL(params = {}){
  return wxCloudPromisify('getTempFileURL', params)
}

// 调用云函数
function callFunction(params = {}) {
  return wxCloudPromisify('callFunction', params)
}

// 发起网络请求
function request(params = {}) {
  return wxPromisify('request', params)
}

// 获取用户信息
function getUserInfo(params = {}) {
  return wxPromisify('getUserInfo', params);
}

// 获取用户权限
function getSetting(params = {}) {
  return wxPromisify('getSetting', params);
}

// 发起授权请求
function authorize(params = {}){
  return wxPromisify('authorize', params)
}

function getLocation(params = {}){
  return wxPromisify('getLocation', params)
}

module.exports = {
  getTempFileURL,
  callFunction,
  request,
  getUserInfo,
  getSetting,
  authorize,
  getLocation
}