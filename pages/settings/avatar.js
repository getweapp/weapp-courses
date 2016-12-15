import api from '../../utils/api'
import event from '../../utils/event'

Page({
  data: {
      avatar:'',
      loading: false,
      tips:'点击头像重新设置'
  },
  chooseImage() {
      wx.chooseImage({
  success: (res) => {
    var tempFilePaths = res.tempFilePaths
 
this.setData({
    tips:'上传中，请稍候...'
})
api.upload('qiniu/upload', {file: tempFilePaths[0]}, (data) => {
    this.setData({
            avatar: 'http://'+data.url,
            tips:'点击头像重新设置'
        })
        this.save()
})

  }
})
  },
  save() {
      if(!this.data.avatar){
          wx.showModal({
  title: '提示',
  content: '上传照片不能为空',
  showCancel: false,
  success: function(res) {
    
  }
})
    return
      }

      api.post('people/update', {
          avatar: this.data.avatar
          }, (data) => {
              
          wx.showToast({
  title: '修改头像成功',
  icon: 'success',
  duration: 2000
})
    const people = wx.getStorageSync('people')
    people.basic.avatar = this.data.avatar
        wx.setStorage({
          key: 'people',
          data: people,
          success: function(res){
            // success
            event.exec('account.update')
            wx.navigateBack()
          }
        })
      })
  },
  
  onLoad() {
      const people = wx.getStorageSync('people') || null
      if(people){
          this.setData({
              avatar: people.basic.avatar
          })
      }
      
  }
})