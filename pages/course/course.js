import api from '../../utils/api'
import moment from '../../utils/moment'
import event from '../../utils/event'

Page({
    data: {
        course: {},
        tips:"立即报名",
        show: false
    },
    payment() {
        if(this.data.tips != '立即报名'){
            return
        }
        const token = wx.getStorageSync('token') || null
        
        if(!token){
             wx.showModal({
                title: '提示',
                content: '你还没有登录，立即登录？',
                confirmColor: 'rgb(251,93,93)',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                        url: '../account/account'
                        })
                    }
                }
                })
            return
        }
            if(moment().valueOf()> moment(this.data.course.startTime).valueOf()-5*60000){
                    wx.showModal({
                    title: '提示',
                    content: '很遗憾，超过报名截止时间了',
                    confirmColor: 'rgb(251,93,93)',
                    showCancel: false,
                    success: function(res) {
                      
                    }
                    })
                    return
                }
                this.setData({
                    tips:'处理中，请稍候...'
                })
            api.post('order/create', {
                courseId: this.data.course.courseId,
                channel: 'weapp',
                token: token
            }, (data) => {
               this.setData({
                   tips: '支付中，请稍候...'
               })
                wx.requestPayment({
                    'timeStamp': data.data.timeStamp,
                    'nonceStr': data.data.nonceStr,
                    'package': 'prepay_id='+data.data.prepayId,
                    'signType': 'MD5',
                    'paySign': data.data.paySign,
                    'complete': (res) => {
                        if(res.errMsg == 'requestPayment:ok'){
                            event.exec('purchased.refresh')
                            this.setData({
                                tips: '立即报名',
                                show: false
                            })
                            wx.redirectTo({
                            url: '../order/order?courseId='+this.data.course.courseId
                            })
                        }else{
                            this.setData({
                                tips: '立即报名'
                            })   
                        }
                         
                    }
                    })
            })
        
    },
    onLoad(options) {
        api.get('course/findById', {courseId: options.id}, (data) => {
            data.avatar = 'http:'+data.avatar
            data.startTime = moment(data.startTime-5*60000).format('YYYY-MM-DD HH:mm')
            data.texts = data.text.split('\n')
            let show = true
            const people = wx.getStorageSync('people') || null
            data.members.map((e)=>{
                
                if(people && e.peopleId == people.peopleId){
                    show = false
                }
            })
            this.setData({
                course: data,
                show: show
            })
        })
    }
})