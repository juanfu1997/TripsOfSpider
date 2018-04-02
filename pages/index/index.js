Page({
  data: {
    img:getApp().globalData.img,
     show: false
  },
  onLoad: function(e) {
    if (wx.getStorageSync("footprint") !== "yes") {
      this.setData({
        show: true
      })
      wx.setStorageSync("footprint", "yes");
    }
  },
  choiceIdCard(e){
    var id = e.currentTarget.dataset.id
    if(id==1){
      //guide
    }else{
      //tourist
    }
    console.log(e)
  },
  goList: function(e) {
    wx.reLaunch({
    	url: "../tripList/tripList"
    })
  },
  tapUfo: function(e) {
    wx.previewImage({
      current: 'https://www.korjo.cn/xcx/loveImg/qrcode.jpg', // 当前显示图片的http链接
      urls: ['https://www.korjo.cn/xcx/loveImg/qrcode.jpg'] // 需要预览的图片http链接列表
    })
  },
  goIntro: function() {
    wx.navigateTo({
      url: "../faq/faq"
    })
   }
})
