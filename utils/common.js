function request(url, data, method, callback) {
    wx.request({
        url: url,
        data: data,
        method: method,
        header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        dataType: 'json',
        success: function (res) {
            callback && callback(res.data)
        },
        fail: function (res) {
            console.error('request fail:' + url)
            console.error(res)
        },
        complete: function () {

        }
    })
}

function getArrayItems(arr, num) {
    var temp_array = new Array()
    for (var index in arr) {
        temp_array.push(arr[index])
    }
    var return_array = new Array()
    for (var i = 0; i < num; i++) {
        if (temp_array.length > 0) {
            var arrIndex = Math.floor(Math.random() * temp_array.length)
            return_array[i] = temp_array[arrIndex]
            temp_array.splice(arrIndex, 1)
        } else {
            break
        }
    }
    return return_array
}
// function each(arr, fn) {
//     if (arr instanceof Array) {
//         for (let i = 0, len = arr.length; i < len; i++) {
//             if (fn(i, arr[i]) === false) { break; }
//         }
//     } else {
//         for (let i in arr) {
//             if (fn(i, arr[i]) === false) { break; }
//         }
//     }
// }

function each(object, callback) {
    var name, i = 0,
        length = object.length,
        isObj = length === undefined

    if (isObj) {
        for (name in object) {
            if (callback.call(object[name], name, object[name]) === false) {
                break
            }
        }
    } else {
        for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
    }
    return object
}

String.prototype.find = function (str) {
    if (this.indexOf(str) > -1) {
        return true
    }
    return false
}

function alert(s) {
    // 提示弹层
    wx.showModal({
        title: '提示',
        content: s,
        showCancel: false,
        success: function (res) {

        }
    })
}

function loading() {
    if (wx.showLoading) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
    } else {
        wx.showToast({
            title: "加载中...",
            icon: "loading",
            duration: 100000
        })
    }
}

function hideLoading() {
    if (wx.showLoading) {
        wx.hideLoading()
    } else {
        wx.hideToast()
    }
}

function trim(s) {
    // 去除首尾空格
    return s.replace(/(^\s*)|(\s*$)/g, "")
}

function getText(str) {
    // html提取纯文本
    // return str.replace(/<\/?div.*?>|<\/?section.*?>|<\/?p.*?>|<img.*?>|<br.*?\/>|&nbsp;|<\/?span.*?>|<\/?a.*?>|<\/?em.*?>|<\/?strong.*?>|<\/?ul.*?>|<\/?li.*?>|<\/?dl.*?>|<\/?dt.*?>|<\/?dd.*?>|<\/?b.*?>|<\/?h\d.*?>/gi, '').replace(/&#39;/ig, "'")
    return str.replace(/&#39;/ig, "'").replace(/<\/?[^>]*>|&[^;]*;/ig, '')
}

function unique(array) {
    // 数组去重
    const res = []
    const json = {}
    for (let i = 0; i < array.length; i++) {
        if (!json[array[i]]) {
            res.push(array[i])
            json[array[i]] = 1
        }
    }
    return res
}

function log(...s) {
    if (s.length == 1) {
        console.log(s[0])
    } else {
        console.log(s)
    }
}

function extend(target, options) {
    for (let name in options) {
        target[name] = options[name]
    }
    return target
}

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function url2abs(str) {
    // img链接转换为绝对路径
    return str.replace(/<img.*?src="\//gi, '<img src="https://www.korjo.cn/').replace(/&#39;/gi, "'").replace(/<video.*?src="\//gi, '<video src="https://www.korjo.cn/').replace(/<source.*?>/ig, '')

}

function param(json) {
    const arr = []
    each(json, (i, v) => {
        arr.push(`${i}=${v}`)
    })
    return arr.join('&')

    // return '?' +
    //     Object.keys(json).map(function (key) {
    //         return encodeURIComponent(key) + '=' +
    //             encodeURIComponent(json[key]);
    //     }).join('&');
}

function goPage(e) {
    const data = e.currentTarget.dataset
    wx.navigateTo({
        url: `/pages/${data.page}/${data.page}`
    })
}

module.exports = {
    server: 'https://www.korjo.cn/',
    data:getApp().globalData,
    get: function (url, data, callback) {
        let server = this.server
        if (url.indexOf('https://') > -1) {
            server = ''
        }
        request(server + url, data, 'GET', callback)
    },
    post: function (url, data, callback) {
        let server = this.server
        if (url.indexOf('https://') > -1) {
            server = ''
        }
        request(server + url, data, 'POST', callback)
    },
    each,
    trim,
    alert,
    getText,
    unique,
    loading,
    hideLoading,
    log,
    extend,
    getArrayItems,
    formatTime,
    url2abs,
    param,
    goPage
}