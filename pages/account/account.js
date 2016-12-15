import api from '../../utils/api'
import event from '../../utils/event'

Page({
    data:{
        avatar: '../../images/avatar.png',
        name: '',
        tips: '微信登录'
    },
    loginFun(){
        const people = wx.getStorageSync('people') || null

        if(people){
            this.setData({
                avatar: people.basic.avatar,
                name: people.basic.name
            })
            return
        }

        wx.showToast({
            title: '登录中...',
            icon: 'loading',
            duration: 3000
        })
        
        wx.login({
            success: (loginRes) => {
        
                if(!loginRes.code) {
                    wx.hideToast()
                    return
                }
                 wx.getUserInfo({
                    success: (res) => {
                        if(!res.encryptedData){
                            wx.hideToast()
                            return
                        }
                    api.post('people/signInByWeapp', {code: loginRes.code, encryptedData: res.encryptedData, iv: res.iv}, (data) => {
                        wx.hideToast()
                        wx.setStorageSync('token', data.data.token)
                        wx.setStorageSync('people', data.data.people)
                        this.setData({
                            avatar: data.data.people.basic.avatar,
                            name: data.data.people.basic.name
                        })
                        event.exec('purchased.refresh')
                    })            
                        
                    }
                    })   
            }
        });

    },
    logout() {
        wx.clearStorageSync()
        this.setData({
            avatar: '../../images/avatar.png',
            name: ''
        })
        event.exec('purchased.refresh')
    },
    update() {
      const people = wx.getStorageSync('people') || null
      if(!people){
          return
      }
      this.setData({
          name: people.basic.name,
          avatar: people.basic.avatar
      })
  },
    onLoad() {
        this.loginFun()
        event.on('account.update', this.update)
    }
})