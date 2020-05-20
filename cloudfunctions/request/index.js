// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {

  let getRes = await axios({
    url: event.url, 
    headers: event.headers ? event.headers : {},
    responseType: event.responseType ? event.responseType : '',
  })

  return {
    headers: getRes.headers,
    body: getRes.data
  }
}