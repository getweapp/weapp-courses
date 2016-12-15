const API = 'https://api.getweapp.com/engine/'
const appId = '583ff823c1707517361e36b1'

const get = (cmd, params, callback) => {
    params.token = wx.getStorageSync('token') || ''
    params.appId = appId
    wx.showToast({
         title: '数据加载中...',
        icon: 'loading',
        duration: 2000
    })
    wx.request({
        url: API+cmd,
        data: params,
        success: (res) => {
            wx.hideToast()
            const data = res.data
            if(data.code){
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: data.message,
                    success: (res) => {
                    }
                    })
                return
            }
            if(typeof(callback) == 'function')
                callback(data)
        }
    })
}

const post = (cmd, params, callback) => {
    params.token = wx.getStorageSync('token') || ''
    params.appId = appId
    wx.request({
        url: API+cmd,
        data: params,
        method: 'POST',
        success: (res) => {
            const data = res.data
            if(data.code){
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: data.message,
                    success: (res) => {
                    }
                    })
                return
            }
            if(typeof(callback) == 'function')
                callback(data)
        }
    })
}

const upload = (cmd, params, callback) => {
     wx.uploadFile({
      url: API+cmd, //仅为示例，非真实的接口地址
      filePath: params.file,
      name: 'file',
      formData:{
        appId: appId,
        token: wx.getStorageSync('token') || ''
      },
      success: (res) => {
        var data = JSON.parse(res.data)
        //do something
        if(data.code){
            wx.showModal({
                    title: '提示',
                    showCancel: false,
                    confirmColor: 'rgb(251,93,93)',
                    content: data.message,
                    success: (res) => {
                    }
                    })
                return
        }
        if(typeof(callback) == 'function')
                callback(data)
      }
    })
}

export default {
    get: get,
    post: post,
    upload: upload
}