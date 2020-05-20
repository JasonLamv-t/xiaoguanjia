// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  SmsClient
} = require('sms-node-sdk');


const AppID = 1400287924; // SDK AppID是1400开头

// 短信应用SDK AppKey ，替换为你自己的 AppKey
const AppKey = '2a9a13412d9a756ee74e353305b60b7d';

// 需要发送短信的手机号码
const phoneNumber = '13717357911';

// 短信模板ID，需要在短信应用中申请
const templId = 479829;
// 签名，替换为你自己申请的签名
const smsSign = '校会小莞家';

// 实例化smsClient

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  let smsClient = new SmsClient({
    AppID,
    AppKey
  });
  return await smsClient.init({
    action: 'SmsSingleSendTemplate',
    data: {
      nationCode: '86',
      phoneNumber: event.mobile,
      templId: templId,
      params: event.code,
      sign: smsSign // 签名参数未提供或者为空时，会使用默认签名发送短信
    }
  })
}