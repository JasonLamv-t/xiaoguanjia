// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got')
const casURL = {
  cas: 'https://cas.dgut.edu.cn/?appid=javaee&state=miniprogram',
  stu: 'https://cas.dgut.edu.cn/home/Oauth/getToken/appid/xgxtt/state/home.html'
}

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let getRes = await got(casURL[event.url])

  return {
    token: getRes.body.slice(getRes.body.indexOf('var token = "') + 13, getRes.body.indexOf('"', getRes.body.indexOf('var token = "') + 20)),
    PHPSESSID: getRes.headers['set-cookie'][2].slice(0, getRes.headers['set-cookie'][2].indexOf(';'))
  }
}