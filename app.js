//app.js
const apiUrl = 'https://www.korjo.cn/KorjoApi/GetSessionKey';
App({
  onLaunch: function() {
  	if (!wx.getStorageSync('footprintUser')) {
      wx.login({
       success: function(res) {
       	 console.log(res.code);
       	 const code = res.code;
           if (code) {
               wx.request({
                 url: apiUrl,
                 data: {id: 18, js_code: code},//18
                 dataType: "json",
                 header: {
                   'content-type': 'application/x-www-form-urlencoded'
                 },
                 success: function(response) {
                   const result = JSON.parse(response.data);
                   console.log(result);
                   wx.setStorageSync('footprintUser', result.openid);
                 }
               });
           }
       	}
  	  });
  	}
  },
  loading: function() {
    wx.showToast({
       title: "加载中",
       icon: "loading",
       duration: 100000
    });
  },
  globalData: {
      appid: 18,
      img:'../../images/',
  }
})
