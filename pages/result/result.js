const commonFun = require('../../utils/util.js');
const getUrl = "https://www.korjo.cn/KorjoApi/GetFootprintByID";
const deletingUrl = "https://www.korjo.cn/KorjoApi/DeleteFootprint";
Page({
  data: {
     hasRecord: false,
     playSign: "",
     notShare: true,
     sharing: "",
     images: []
  },
  onLoad: function(options) {
     const that = this;
     that.id = options.id;
     that.share = options.share;
     wx.showToast({
       title: "加载中",
       icon: "loading",
       duration: 100000
     });
     //如果是点击分享链接, 隐藏删除标志，分享按钮
     if (options.share == "y") {
        that.setData({
          notShare: false,
          sharing: "sharing",
        })
     } 
     commonFun.getRequest(getUrl, {id: options.id}, function(response) {
        wx.hideToast();
        const result = JSON.parse(response.data.footprintjson);
        const imagesArray = [];
        for (let image of result.images) {
           imagesArray.push("https://www.korjo.cn" + image);
        }
        that.audioUrl = result.audio;
        let hasRecord = false;
        if (result.audio) {
           hasRecord = true;
        }
        that.setData({
           hasRecord: hasRecord,
           date: result.date,
           name: result.name,
           address: result.address,
           lat: result.latitude,
           lon: result.longitude,
           thought: result.thought,
           images: imagesArray
        })
     })
  },
  //点击经纬度与图标显示地图位置
  openLocation: function(e) {
    wx.openLocation({
      latitude: Number(this.data.lat),
      longitude: Number(this.data.lon),
      scale: 18,
      name: this.data.name,
      address: this.data.address
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  audiotap: function(e) {
    const that = this;
    wx.downloadFile({
      url: that.audioUrl,
      success: function(res) {
        that.setData({
            playSign: "停止播放"
        })
        wx.playVoice({
          filePath: res.tempFilePath,
          complete: function(response) {
             that.setData({
                playSign: ""
             })
          }
        })
      }
    })
  },
  stop: function(e) {
    wx.stopVoice();
    this.setData({
       stopButtonHidden: true,
       playSign: ""
    })
  },
  tapDelete: function(e) {
      const that = this;
      wx.showModal({
        title: '提示',
        content: '请确实是否删除该足迹',
        success: function(res) {
          if (res.confirm) {
             wx.showToast({
               title: "加载中",
               icon: "loading",
               duration: 100000
             });
             wx.request({
               url: deletingUrl,
               data: {id: that.id},
               method: 'POST',
               header: {
                 'content-type': 'application/x-www-form-urlencoded'
               },
               success: function(response) {
                  wx.reLaunch({
                    url: "../map/map?location=y"
                  })
               }
             })
          } else if (res.cancel) {
              return
          }
        }
      })
  },
  goMap: function(e) {
    let url = ""
    if (this.share == "y") {
      url = "../map/map"
    } else {
      url = "../map/map?location=y"
    }
    wx.reLaunch({
      url: url
    })
  },
  onShareAppMessage: function(res) {
    const that = this;
    return {
       title: "地图足迹我来记",
       path: "/pages/result/result?id=" + that.id + "&share=y",
       imageUrl: "../../images/booker.jpg",
       success: function(res) {
       // 转发成功
          setTimeout(function() {
            that.setData({
              display: 'none'
            });
          }.bind(that), 1000);

       },
       fail: function(res) {
        // 转发失败
       }
     }
  },
  tapImg: function(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.images[index], // 当前显示图片的http链接
      urls: this.data.images// 需要预览的图片http链接列表
    })
  }
})