import api from '../../utils/api'
import event from '../../utils/event'

Page({
  data: {
      name:'',
      loading: false,
    inputValue: ''
  },
  bindKeyInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  save() {
      if(!this.data.name){
          wx.showModal({
  title: '提示',
  content: '昵称不能为空',
  showCancel: false,
  success: function(res) {
    
  }
})
    return
      }
      this.setData({
          loading: true
      })
      api.post('people/update', {
          name: this.data.name
          }, (data) => {
              
          wx.showToast({
  title: '修改昵称成功',
  icon: 'success',
  duration: 2000
})
    const people = wx.getStorageSync('people')
    people.basic.name = this.data.name
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
              name: people.basic.name
          })
      }
      
  }
})