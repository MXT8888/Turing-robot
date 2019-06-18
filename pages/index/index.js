var msg, token, IMEI, filePath
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userText: "",
    syas: [],
    qingkong:'',
    height: 0,
    scrollTop: 0,
    headLeft: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558694512954&di=6bc83d46fae237d5621517cc9d910371&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180410%2Fbbfda810c24f4946a15394d59c398d62.jpeg',
    headRight: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 获取各个显示器屏幕自适应高低然后减去底部的高度就会让聊天内容显示其中。
        that.setData({
          height: res.windowHeight - 90
        })
      }
    }),
    // 
    wx.getUserInfo({
      success: function (e) {
        let header = e.userInfo.avatarUrl
        that.setData({
          headRight: header
        })
      }
    }),
    // 设置定时器
      setTimeout(function () {
        var grant_type = "client_credentials"; 
        var appKey = "7A6fuVBxIgjCCMu0eMhsxyuu"; //百度语音密钥
        var appSecret = "HMxdXoT0FCGWSkgiCZQclcoHBswYyP0p";
        var url = "https://openapi.baidu.com/oauth/2.0/token"  //请求的百度语音的路径
        wx.request({
          url: url,//发送一个请求
          data: {
            grant_type: grant_type,
            client_id: appKey,
            client_secret: appSecret
          },
          method: "GET", //请求方式
          header: {
            'content-type': 'application/json'   
          },
          success: function (res) {
            token = res.data.access_token
          }
        })
      }, 0)
  },
  // 创建对话方法
  converSation: function (e) {
    let that = this
    var obj = {}, //创建一个对象
      isay = e.detail.value.says,//获取输入的文本数据
      syas = that.data.syas,//将获取到的数据存进syas数组里
      length = syas.length,//获取syas的长度
      key = '7df62848aae54641847d7e4a10e69b8b' //获取机器人的Key值
    wx.request({
      url: 'https://www.tuling123.com/openapi/api?key=' + key + '&info=' + isay,
      // 请求成功方法
      success: function (res) {
        let tuling = res.data.text;  //将机器人的回答赋值给图灵变量
        obj.robot = tuling;//将文本存进对象里
        obj.isay = isay;//将isay传给当前的对象里
        syas[length] = obj;
        that.setData({
          syas: syas,
          scrollTop: that.data.scrollTop + that.data.height,
          userText: res.data.text,
          qingkong:'',
        })
          that.voice(tuling);  //转换成语音播放
      }
    })
  },
  voice: function (e) {
    var that = this;
    if (e === that.data.userText) {
      var tex = that.data.userText;
    }
    else {
      var tex = e.currentTarget.dataset.text;
    }
    var texs = token;
    var cuid = IMEI;
    var tex = encodeURI(tex);
    var ctp = 1;
    var lan = "zh";
    var spd = 6;
    var url = "https://tsn.baidu.com/text2audio?tex=" + tex + "&lan=" + lan + "&cuid=" + cuid + "&ctp=" + ctp + "&tok=" + texs + "&spd=" + spd
    wx.downloadFile({
      url: url,
      success: function (res) {
        filePath = res.tempFilePath;
          that.play(e);
      }
    })
  },
  play: function (e) {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = filePath
  },
  delectChat: function () {
    let that = this
    that.setData({
      syas: [
      ],
    })
  }
})