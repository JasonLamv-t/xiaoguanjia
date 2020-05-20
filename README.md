# README

## 参考文档

**​**​jasonlam修改于2019年12月28日20点07分

* [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
* [腾讯位置服务](https://lbs.qq.com/qqmap_wx_jssdk/) key: OJZBZ\-FZHW6\-WUTS5\-EK3YE\-GZKC3\-3ZBEO
* [和风天气API](https://dev.heweather.com/docs/api/)  key:a0405ffd044e4bab9dbaa75a06287df3
* [vant](https://youzan.github.io/vant-weapp/#/intro)

* [weUI](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)
* [weUI第三方文档](https://www.vxzsk.com/1878.html)

### 版本更新

1.0 引入中央认证接口(appid: javaee, appsecret: b3b52e43ccfd\)  2019年12月7日

1.1 修正中央认证接口，转为代理登录学生工作系统，以获取用户信息  2019年12月10日

1.2 修正中央认证接口，转为通过javaee校验，并保存账号密码到全局，开启指纹认证后保存到本地； 重新引入vant，目前版本v1.0.1



###  文档结构说明

#### cloudfunctions-云函数

* getCas为请求中央认证接口登录页面以获取token及session
* login为默认云函数，用于获取openid
* request为服务器代理请求函数
* sendsms为短信发送云函数

#### pages-目录

主要说明请见页面说明

#### images-主要存放较大且常用的图片

#### lib-存放外部sdk或其他库

#### style-外部样式表

* iconfont-校会小程序，需要使用GitHub登录注册[iconfont](https://www.iconfont.cn/?spm=a313x.7781069.1998910419.d4d0a486a)，联系JasonLam添加到项目

#### untils-自定义js函数库

* flyio：flyio请求模块主函数，暂时不用，目前为空文件
* files：panCloud项目附属，包括两个接口，一个将B单位的文件大小格式化为合理单位并返回，一个根据传入的文件名判断文件类型并返回
* wxapi：promise化微信api，有需要可根据格式进行自定义promise化，后期可单独整理为模块

#### vant-vant组件库（详见组件说明）

#### weui-weui组件库（详见组件说明）

### 页面说明

#### 主包

##### index-首页

小程序首页

##### casLogin-中央认证登录页面

中央认证登录页面，包括部分数据请求将放在认证通过之后进行，保存到全局变量，在加载分包模块后通过全局及回调的方式访问到

##### user-用户页

user-我的页面，其他设置及用户页面入口
IDcard-电子学生证页面

##### appinfo-关于页

appinfo，小程序详情页面
userAgreement，用户协议页面

### 组件说明

自定义修改了一些模块，目前还没有整理出来，日后单独对weUI进行fork

#### vant组件

#### weUI组件

* footer

| 参数名    | 参数说明                                                     | 参数类型 | 默认值 |
| --------- | ------------------------------------------------------------ | -------- | ------ |
| title     | footer的标题                                                 | Sting    | 无     |
| link      | title上的跳转连接                                            | String   | 无     |
| url       | link的目标链接，未设置link无效                               | String   | 无     |
| body      | Copyrignht自定义字段                                         | String   | 无     |
| end       | All Rights Reserved.是否显示                                 | Boolean  | true   |
| color     | 字体及链接字体颜色，不设置时默认字体为黑色，连接为蓝色，设置则两者同为设置的颜色 | String   | black  |
| font-size | 字体大小，无法调整链接字体大小                               | String   | 22rpx  |
| isBottom  | 是否紧贴底部，默认为是                                       | Boolean  | true   |