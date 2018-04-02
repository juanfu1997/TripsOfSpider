function getRequest(requestUrl, dataObject, callback) {
	wx.request({
        url: requestUrl,
        data: dataObject,
        dataType: "json",
        header: {
        'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(response) {
             callback(response)
        }
    });
}

function url2abs(str) {
    // img链接转换为绝对路径
    return str.replace(/<img.*?src="\//gi, '<img src="https://www.korjo.cn//').replace(/&#39;/gi, "'").replace(/<video.*?src="\//gi, '<video src="https://www.korjo.cn//').replace(/<source.*?<\/video>/gi, "</video>").replace(/<style>.*?<\/style>/gi, "");
}

module.exports = {
   getRequest,
   url2abs
}
