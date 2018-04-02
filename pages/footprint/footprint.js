const commonFun = require('../../utils/util.js');
const appInstance = getApp();
const saveUrl = "https://www.korjo.cn/KorjoApi/SaveFootprint";
const watermarkUrl = "https://www.korjo.cn/KorjoApi/GetFootprintWaterImage";
const addMarkUrl = "https://www.korjo.cn/KorjoApi/MarkWaterImage";
Page({
  data: {
    audioDeleteHidden: "none",
    audiotap: "record",
    audioPic: "interview",
    stopButtonHidden: true,
    textShowing: "block",
  	lightboxDisplay: "none",
  	addingArray: [{
      buttonValue: "加个水印",
  		bgColor: "#999"
  	}],
  	img_list: [{
        src: 'https://www.korjo.cn/xcx/loveImg/box.jpg',
        hide: true
    }],
    waterMarkArray: [],
    savedImgArray: []
  },
  onLoad: function(options) {
  	const that = this;
    that.mapInfo = {
      name: options.name,
      address: options.adr,
      latitude: options.lat,
      longitude: options.lon
    }
  	const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    that.setData({
      date: String(year) + "-" + String(month > 9 ? month : "0" + String(month)) + "-" + String(day > 9 ? day : "0" + String(day)),
      start: String(year) + "-01-01",
      end: String(year + 2) + "-12-01",
      isNew: true,
      name: options.name,
      address: options.adr,
      lat: options.lat,
      lon: options.lon
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
  record: function(e) {
    const that = this;
    that.setData({
      stopButtonHidden: false
    })
    wx.startRecord({
       success: function(res) {
        wx.showToast({
          title: '音频录制成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
           audiotap: "listenTab",
           audioPic: "listen",
           audioDeleteHidden: "inline-block",
           stopButtonHidden: true
         })
          that.audioTempFilePath = res.tempFilePath;
       }
    });
    setTimeout(function() {
      //结束录音  
      wx.stopRecord()
    }, 60000)
  },
  deleteAudio: function() {
     this.audioTempFilePath = "";
     this.setData({
        audioDeleteHidden: "none",
        audiotap: "record",
        audioPic: "interview",
     })
  },
  listenTab: function(e) {
    console.log(this.audioLink)
    wx.playVoice({
      filePath: this.audioTempFilePath,
      complete: function(){
      }
    })
  },
  stop: function(e) {
    wx.stopRecord();
    this.setData({
       stopButtonHidden: true
    })
  },
  selectImg: function(e) {
    const data = e.currentTarget.dataset
    const idx = data.idx;
    const _this = this
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            wx.showToast({
               title: "加载中",
               icon: "loading",
               duration: 100000
            });
            var tempFilePaths = res.tempFilePaths
            // 上传
            wx.uploadFile({
                url: 'https://www.korjo.cn/KorjoApi/AdminUpload',
                filePath: tempFilePaths[0],
                name: 'file',
                formData: {
                    path: "korjo",
                    type: "image"
                },
                success: function (res) {
                    wx.hideToast();
                    const img_list = _this.data.img_list;
                    const savedImgArray = _this.data.savedImgArray;
                    const addingArray = _this.data.addingArray;
                    addingArray[idx].bgColor = "rgba(121,181,46,.8)";
                    img_list[idx].src = `https://www.korjo.cn${res.data}`
                    savedImgArray.push(res.data);
                    img_list[idx].hide = false
                    if (img_list.length < 3) {
                        img_list.push({
                            src: 'https://www.korjo.cn/xcx/loveImg/box.jpg',
                            hide: true
                        })
                        addingArray.push({
                          buttonValue: "加个水印",
                        	bgColor: "#999"
                        })
                    }
                    _this.setData({ img_list, addingArray, savedImgArray })
                },
                fail: function (e) {
                    $.alert(JSON.stringify(e))
                }
            })
        }
    })
  },
  delImg: function(e) {
      const data = e.currentTarget.dataset
      const idx = data.idx
      const img_list = this.data.img_list
      const savedImgArray = this.data.savedImgArray;
      const addingArray = this.data.addingArray;
      img_list.splice(idx, 1)
      savedImgArray.splice(idx, 1)
      addingArray.splice(idx, 1)
      if (!img_list[img_list.length - 1].hide) {
          img_list.push({
              src: 'https://www.korjo.cn/xcx/loveImg/box.jpg',
              hide: true
          })
      }
      this.setData({ img_list, savedImgArray , addingArray})
  },
  addWatermark: function(e) {
  	 const index = e.currentTarget.dataset.index;
     this.choosenImgIndex = index;
     const that = this;
  	 if (this.data.addingArray[index].bgColor == "#999") {
  	 	return
  	 }
     if (this.data.addingArray[index].buttonValue == "查看水印效果") {
        wx.previewImage({
          current: "https://www.korjo.cn" + that.data.savedImgArray[index], // 当前显示图片的http链接
          urls: ["https://www.korjo.cn" + that.data.savedImgArray[index]] // 需要预览的图片http链接列表
        })
        return
     } 
     //如果第一次点击加个水印获取水印图片
     let firstTime = true;
     if (firstTime) {
       firstTime = false;
       appInstance.loading();
       commonFun.getRequest(watermarkUrl, {}, function(response) {
          wx.hideToast();
          const waterMarkArray = [];
          that.originalwaterMarkArray = response.data;
          for (let oneImg of response.data) {
             waterMarkArray.push({
               icon: "../../images/check.png",
               img: "https://www.korjo.cn" + oneImg
             })
          }
          that.setData({
             waterMarkArray: waterMarkArray
          })
       })
     }
     this.setData({
  	 	 lightboxDisplay: "block",
       textShowing: "none"
  	 })
  },
  chooseWarterMark: function(e) {
  	 const index = Number(e.currentTarget.dataset.index);
     this.warterMarkIndex = index;
     const waterMarkArray = this.data.waterMarkArray;
     if (waterMarkArray[index].icon == "../../images/checked.png") {
        waterMarkArray[index].icon = "../../images/check.png";
     } else {
        for (let item of waterMarkArray) {
           item.icon = "../../images/check.png";
        }
        waterMarkArray[index].icon = "../../images/checked.png";
     }
     this.setData({
     	 waterMarkArray: waterMarkArray
     })
  },
  conformButton: function(e) {
     const that = this;
  	 this.hide_box();
     appInstance.loading();
     wx.request({
       url: addMarkUrl,
       data: {filePath: that.data.savedImgArray[that.choosenImgIndex], waterFile: that.originalwaterMarkArray[this.warterMarkIndex]},
       method: 'POST',
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: function(response) {
         wx.hideToast();
         const addingArray = that.data.addingArray;
         addingArray[that.choosenImgIndex].buttonValue = "查看水印效果";
         that.setData({
            addingArray: addingArray
         })
       }
     });
  },
  hide_box: function() {
  	 this.setData({
  	 	lightboxDisplay: "none",
      textShowing: "block"
  	 })
  },
  chooseDate: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  inputThoughts: function(e) {
     this.thought = e.detail.value
  },
  inputFocus: function(e) {
     this.setData({
        textBorder: "#79b52e"
     })
  },
  inputBlur: function(e) {
     this.setData({
        textBorder: "#d1d1d1"
     })
  },
  upLoadAudio: function(jsonData) {
    const that = this;
    appInstance.loading();
    wx.uploadFile({
          url: 'https://www.korjo.cn/KorjoApi/AdminUpload',
          filePath: that.audioTempFilePath,
          name: 'file',
          formData: {
              path: "korjo",
              type: "audio"
          },
          success: function (res) {
              wx.hideToast();
              console.log(res.data);
              jsonData.audio = "https://www.korjo.cn"+ res.data; 
              that.saveData(jsonData);
          },
          fail: function (res) {
              console.log("上传失败：", res);
          }
    })
  },
  saveData: function(jsonData) {
      const footprintjson = {
        userid: wx.getStorageSync('footprintUser'),
        footprintjson: JSON.stringify(jsonData)
      }
      wx.request({
         url: saveUrl,
         data: {footprintjson: JSON.stringify(footprintjson)},
         method: 'POST',
         header: {
           'content-type': 'application/x-www-form-urlencoded'
         },
         success: function(response) {
            const result =  response.data;   
            const id = JSON.parse(result.replace(/[()]/g,'')).data;
            wx.reLaunch({
               url: "../result/result?id=" + id
            })
         }
      });
  },
  save: function(e) {
    const that = this;
    const jsonData = {
         date: that.data.date,
         name: that.mapInfo.name,
         address: that.mapInfo.address,
         latitude: that.mapInfo.latitude,
         longitude: that.mapInfo.longitude,
         thought: that.thought,
         images: that.data.savedImgArray
    }
    appInstance.loading();
    if (that.audioTempFilePath) {
       that.upLoadAudio(jsonData);

    } else {
      that.saveData(jsonData);
    }
    
  }
})