const commonFun = require('../../utils/util.js');
const listUrl = "https://www.korjo.cn/KorjoApi/GetFootprintList";
const appInstance = getApp();
Page({
  data: {
     listArray: []
  },
  onLoad: function() {
      const that = this;
      appInstance.loading();
      commonFun.getRequest(listUrl, {userid: wx.getStorageSync('footprintUser')}, function(response) {
        wx.hideToast();
        const resultList = response.data;
        const listArray = [];
        if (resultList.length > 0) {
          for (let list of resultList) {
              const footprintData = JSON.parse(list.footprintjson);
              console.log(footprintData)
              listArray.push({
                 id: list.id,
                 date: footprintData.date,
                 name: footprintData.name,
                 address: footprintData.address
              })       
          }
          that.setData({
             listArray: listArray
          })
        }
      })
  },
  goResult: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
       url: "../result/result?id=" + id
    })
  },
  book: function(e) {
    wx.navigateBack({
      delta: 1
    })
  }
})