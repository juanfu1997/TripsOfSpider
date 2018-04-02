const commonFun = require('../../utils/util.js');
const listUrl = "https://www.korjo.cn/KorjoApi/GetFootprintList";
const $ = require('../../utils/common.js');
Page({
  data: {
    img:getApp().globalData.img,
    isLocated: true,
    hint_v: true,
    lat: "",
  	lng: "",
  	markers: [],
    arrowDeg:0,
    top_tab:[
              {txt:'行程表',style:''},
              {txt:'一日游',style:''},
    ],
    tripTable:
    [
                {table:
                  
                    {name:'2',date:'',min_time:'00:00',scenicSpot:
                      [
                        {time:'',places:'1',remarks:'1'},
                        // {time:'',places:'',remarks:''},
                      ]
                    }
                },
                {table:
                    {name:'',date:'',min_time:'00:00',scenicSpot:
                      [
                        {time:'',places:'',remarks:''},
                      ]
                    }
                },
                {table:
                    {name:'',date:'',min_time:'00:00',scenicSpot:
                      [
                        {time:'',places:'',remarks:''},
                      ]
                    }
                },


    ],
  },
  onLoad: function(options) {
  	 const that = this;
     that.loading();    
     commonFun.getRequest(listUrl, {userid: wx.getStorageSync('footprintUser')}, function(response) {
        wx.hideToast();
        const resultList = response.data;
        const userLocation = wx.getStorageSync("footprintLocation");
        let mapPrints = [];
        let markers = [];
        if (resultList.length > 0) {
           for (let list of resultList) {
             mapPrints.push({
               id: list.id,
               latitude: JSON.parse(list.footprintjson).latitude,
               longitude: JSON.parse(list.footprintjson).longitude,
               iconPath: "../../images/footprint.png",
               label:{
                              content:"text",
                              color:"#000",
                              bgColor:'#FFFFFF',
                              display:'ALWAYS',
                              borderWidth:3,
                              x:-40,
                              y:-80,
                            },

               
             })             
          }
        }
        //options.location是刚刚已经定位过
        if (options.location == "y") {
          if (resultList.length > 0) {
            markers = mapPrints;
          } else {
            markers = [{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                iconPath: "../../images/pin.png"
            }]
          }
          that.setData({
             lat: userLocation.latitude,
             lng: userLocation.longitude,
             markers: markers
          })
        } else {
       //重新定位
      	 wx.getLocation({
        	 	type: "gcj02",
        	 	success: function(response) {
        	 	   wx.hideToast();
        	 	   const latitude = response.latitude;
        	 	   const longitude = response.longitude;
               //中国的经纬度范围大约为：纬度3.86~53.55，经度73.66~135.05,如果在国外提示
               if (latitude >= 3.86 && latitude <= 53.55 && longitude >= 73.66 && longitude <= 135.05) {
          	 	   if (resultList.length > 0) {
                    mapPrints.push({
           		   	  	 latitude: latitude,
           		   	  	 longitude: longitude,
           		   	  	 iconPath: "../../images/pin.png",
                       
                    })
                    markers = mapPrints;               
          	 	   } else {
          	 	   	  markers = [{
           		   	  	 latitude: latitude,
           		   	  	 longitude: longitude,
           		   	  	 iconPath: "../../images/pin.png"
           		   	  }]
          	 	   }
           		   that.setData({
           		   	  lat: latitude,
                    lng: longitude,
           		   	  markers: markers
           		   })
               } else {
                  that.inAbroad(that);
               }
        	 	},
            fail: function() {
               that.failTolocated(that);
            }
      	 })
       }
    })
  },
  goList: function(e) {
     wx.navigateTo({
        url: "../list/list"
     })
  },
  addLocation: function(e) {
  	 const that = this;
  	 this.loading();
     wx.chooseLocation({
     	success: function(result) {
          wx.hideToast();          
          const footprint = {
            name: result.name,
           	address: result.address,
	   	  	  latitude: result.latitude,
	   	  	  longitude: result.longitude
          }
          wx.setStorageSync("footprintLocation", footprint);
          wx.navigateTo({
              url: "../footprint/footprint?name=" + footprint.name + "&adr=" + footprint.address + "&lat=" + footprint.latitude + "&lon=" + footprint.longitude
          })
     	}

     })
    // wx.navigateTo({
    //           url: "../footprint/footprint"
    //       })
  },
  markertap: function(e) {
  	const markerId = e.markerId;
    if (!markerId) {
      return
    }
  	wx.redirectTo({
  	   url: "../result/result?id=" + markerId
  	})
  },
  loading: function() {
  	wx.showToast({
       title: "加载中...",
       icon: "loading",
       duration: 100000
	  });
  },
  failTolocated: function(obj) {
     wx.hideToast();
     obj.setData({
        isLocated: false,
        hint_v: false,
        hintContent: "无法定位您当前的位置，请确认\n已经允许微信使用定位服务。检查方法如下：\n请到手机系统【设置】->【隐私】->【定位】\n服务中打开位置服务，并允许微信使用定位服务。"
     })
  },
  inAbroad: function(obj) {
     obj.setData({
        isLocated: false,
        hint_v: false,
        hintContent: "小K发现您当前身处国外，\n由于国外定位系统不稳定等原因，\n小K不能为您添加足迹，请您见谅。"
     })
  },
  showTab(){
    var that = this
    var arrowDeg = that.data.arrowDeg
    var showTab = that.data.showTab
    console.log(arrowDeg)
    if(!arrowDeg){
      arrowDeg = 180
      showTab = true
    }else{
      arrowDeg = 0
      showTab = false
    }
    that.setData({
      arrowDeg,
      showTab,
    })

  },
  tabMove(e){
    
    var left = e.detail.scrollLeft
    var num = left / 150 >>>0
    if(num >1){
    }
    
      console.log(num,left,e,)
    
    
  },
  switchTab(e){
    var index = e.target.dataset.index
    var top_tab = this.data.top_tab
    console.log(index,e)
    $.each(top_tab,(i,v) => {
      v.style = ''
    })
    top_tab[index].style = "border-bottom: 4rpx solid red;"
    this.setData({
      top_tab,
    })
  },
  tripsDay(e){
    var that = this
    var index = e.currentTarget.dataset.index
    index = index/2
    console.log(e,index)
  }

})
