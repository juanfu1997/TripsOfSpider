// pages/trip/trip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'../../images/',
    addTrip:true,
    pageIndex:3,
    tripList:[],
    tab:[
          {img:'addTable.png',txt:'添加行程'},
          {img:'deleteTable.png',txt:'删除行程'},
          {img:'creatTable.png',txt:'声称行程'},
    ],
    itool:[
          {img:'tripShare.png',txt:'分享'},
          {img:'tripEdit.png',txt:'编辑'},
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

    ],
    current:0,
    maxDate:'',
  
  },
  timeFormatTransformation(TwentyFour,Twelve){
    var that = this
    var result = parseInt(TwentyFour) - 12
    console.log(typeof TwentyFour,typeof result)

    if(result < 0){
      TwentyFour = result + 12 
      TwentyFour = 'A.M ' +TwentyFour
    }else{
      TwentyFour = 'P.M ' + result
    }
    console.log(TwentyFour)
  },
  checkDaysOfMonth(mm, yyyy) {
    var daysofmonth;
    if ((mm == 4) || (mm ==6) || (mm ==9) || (mm == 11)){
        daysofmonth = 30;
    } else {
        daysofmonth = 31;
        if (mm == 2){
            if (yyyy/4 - parseInt(yyyy/4, 10) != 0){
                daysofmonth = 28;
            } else {
                if (yyyy/100 - parseInt(yyyy/100, 10) != 0) {
                    daysofmonth = 29;
                }else{
                    if (yyyy/400 - parseInt(yyyy/400, 10) != 0) {
                        daysofmonth = 28;
                    }else{
                        daysofmonth = 29;
                    }
                }
            }
        }
    }
    return daysofmonth;
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const nextMonth = month + 1
    const day = date.getDate();
    var daysofmonth = that.checkDaysOfMonth(year,month)
    console.log('daysofmonth',daysofmonth)
    that.setData({
      date: String(year) + "-" + String(month > 9 ? month : "0" + String(month)) + "-" + String(day > 9 ? day : "0" + String(day)),
      start: String(year) + "-01-01",
      end: String(year + 2) + "-12-01",
      startDate:String(year) + "-" + String(month > 9 ? month : "0" + String(month)) + "-" + String(day > 9 ? day : "0" + String(day)),
      endDate:String(year) + "-" + String(month > 9 ? month : "0" + String(month)) + "-" + String(day > 9 ? day : "0" + String(day)),
      daysofmonth:daysofmonth,
      // isNew: true,
      // name: options.name,
      // address: options.adr,
      // lat: options.lat,
      // lon: options.lon
    })
  
  },
  chooseStartDate: function(e) {
    this.setData({
      startDate: e.detail.value,
      endDate: e.detail.value,
      maxDate:e.detail.value,
    })
  },
  chooseEndDate(e){
    this.setData({
      endDate:e.detail.value
    })
  },
  saveTrip(){
    var that = this
    var addTrip = that.data.addTrip
    that.setData({
      addTrip:!addTrip
    })
    // wx.navigateTo({
    //     url: "../footprint/footprint"
    // })
  },
  goMap(e){
    wx.navigateTo({
        url: "../map/map"
    })
},
addTrip(){
  var that = this
  var pageIndex = that.data.pageIndex
  that.setData({
    pageIndex:3,
  })
  // wx.navigateTo({
  //   url:"../"
  // })
},
tab(e){
  var that = this
  var tripTable = that.data.tripTable
  var tabindex = e.currentTarget.dataset.tabindex
  var current = e.currentTarget.dataset.current
  var scenicSpot = tripTable[current].table.scenicSpot
  console.log(tabindex,current)
  var scenicSpot_num = tripTable[current].table.scenicSpot.length
  var maxDate = that.data.maxDate
  var daysofmonth = that.data.daysofmonth
  var date = maxDate.split("-")
  date[0]=Number(date[0])
  date[1]=Number(date[1])
  date[2]=Number(date[2])
  if (date[2] < daysofmonth){
    date[2]++
  }else{
    date[2] = 1
    if(date[1] < 12){
      date[1]++
    }else{
      date[1] = 1
      date[0]++
    }
  }
  maxDate = String(date[0]) + '-' + String(date[1]) + '-' + String(date[2])
  that.setData({
    maxDate,
  })
  // console.log(typeof date[2],date)
  //检查景点内容是否填写
  // for(var i=0; i <scenicSpot_num ; i++){
  //     console.log(scenicSpot)
  //     if(scenicSpot[i].time&&scenicSpot[i].places&&scenicSpot[i].remarks){
  //       console.log('已经填写')
  //     }
  // 　　console.log(tripTable[current].table.scenicSpot[i],scenicSpot_num);

  // }
  // tripTable[current].table
  var addTable = {table:
                    {name:'',date:'',min_time:'00:00',scenicSpot:
                      [
                        {time:'',places:'',remarks:''},
                      ]
                    }
                }
  if(tabindex == 0){
    tripTable.push(addTable)
    if(tripTable.length > 4){
      console.log('最多添加七天行程')
    }
  }
  if(tabindex == 1){
    if(tripTable.length != 1){
      tripTable.splice(current,1)
    }else{
      console.log('已经最后一页行程了')
    }
    // console.log(tripTable.length)
    that.setData({
      current:0,
    })
    // console.log('current',current)
  }
  if(tabindex == 2){}
    that.setData({
      tripTable,
    })
},
min_time(index){
  var that = this
  var tripTable = that.data.tripTable

  tripTable[index].table.min_time = tripTable[index].table.scenicSpot[0].time

},
delete_Moudule(e){
  var that = this
  console.log(e)
  var index = e.currentTarget.dataset.idx
  var index2 = e.currentTarget.dataset.idxx
  var tripTable = that.data.tripTable
  // console.log(tripTable[index].table[index].scenicSpot)

  tripTable[index].table.scenicSpot.splice(index2,1)
  that.min_time(index)
  that.setData({
    tripTable,
  })
  console.log(tripTable)
},
add_Moudule(e){
  var that = this
  console.log(e)
  var index = e.currentTarget.dataset.idx
  var tripTable = that.data.tripTable
  var length = tripTable[index].table.scenicSpot.length
  console.log(tripTable[index].table.scenicSpot.length,tripTable[index].table.scenicSpot[length-1].time)
  if(tripTable[index].table.scenicSpot[length-1].time){
    tripTable[index]
    tripTable[index].table.scenicSpot.push({time:'',places:'',remarks:''},)
    that.min_time(index)
  }else{
    console.log('请先填写之前的时间')
  }
  that.setData({
    tripTable,
  })
},
ISTimeMax(time1,time2){
  var that = this
  var t1 = time1.split(':')
  var t2 = time2.split(':')
    // console.log(t1,t2)
  if(t1[0] > t2[0]){
    console.log('t1')
    return 1;
  }else if(t1 < t2){
    console.log('t2')
    return 0; 
  }else{
    if(t1[1] > t2[1]){
    return 1; 
      // console.log('t11')
    }else if(t1[1] < t2[1]){
    return 0; 
      // console.log('t22')
    }else
    return 1; 
    // console.log('0')
  }

},
scenicSpot_time(e){
  console.log(e)

  var that = this
  var value = e.detail.value
  var index = e.currentTarget.dataset.idx
  var index2 = e.currentTarget.dataset.idxx
  var tripTable = that.data.tripTable
  console.log(value,tripTable[index].table.min_time)



  
  var max = that.ISTimeMax(value,tripTable[index].table.min_time)
  console.log(max)
  if(max){
    tripTable[index].table.min_time = tripTable[index].table.scenicSpot[index2].time = value

  }else{
    console.log(不能选择更早的时间)
  }
  that.timeFormatTransformation(value)
  that.setData({
    tripTable,
  })
},
getSwiperId(e){
  var that = this
  var current = that.data.current
  var index = e.detail.current
  if(e.detail.source == 'touch'){
    that.setData({
      current:index,
    })
  }
  console.log(e,index,current)
},
scenicSpot_tips(e){
  var that = this
  var index = e.currentTarget.dataset.idx
  var index2 = e.currentTarget.dataset.idxx
  var tripTable = that.data.tripTable
  var value = e.detail.value
  // console.log(tripTable[index],e)
  tripTable[index].table.scenicSpot[index2].tips = value
  that.setData({
    tripTable,
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})