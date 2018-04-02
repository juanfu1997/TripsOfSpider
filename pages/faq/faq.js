const WxParse = require('../../wxParse/wxParse.js');
const commonFun = require('../../utils/util.js');
const url = "/KorjoApi/GetFansIntro";
Page({
	data: {
		img: 'https://www.korjo.cn/xcx/orderImg/',
		list: [],
		domain: 'https://www.korjo.cn'
	},
	onLoad(options) {
		const that = this;
		const list = [];
		for (let i = 0; i < 20; i +=1) {
			list.push([]);
		}
		this.setData({list})
		commonFun.getRequest(that.data.domain + url, {wxpublic_id: getApp().globalData.appid}, (result) => {
			// 详情
			const res = result.data;
			if (!res.content) {
				return
			}
			const content = commonFun.url2abs(res.content)
			WxParse.wxParse('content', 'html', content, that, 5)
		});
	},
	onShareAppMessage() {
		return { title: 'FM小程序知识普及' }
	}
})
