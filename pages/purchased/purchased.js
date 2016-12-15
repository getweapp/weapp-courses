import Util from "../../utils/util"
import api from '../../utils/api'
import countdown from '../../utils/countdown'
import event from '../../utils/event'

Page({
    data: {     
        page: 0,                // 当前分页
        total: 0,
        orders: []
    },
    refresh() {
  
         const token = wx.getStorageSync('token') || null

        if(!token){
            this.setData({
                page: 0,
                total: 0,
                orders: []
            })
   
            return
        }

        api.get('order/findByStep', {
            page: 0
        }, (data) => {
            data.data.list.map((e, k)=>{
                if(e.course)
                    e.course.avatar = 'http:'+e.course.avatar
                else
                    data.data.list.splice(k, 1)
            })
            this.setData({
                page: 1,
                total: data.data.total,
                orders: data.data.list
            })
        })
    },
    // 上拉加载跟多数据
    update() {
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

        api.get('order/findByStep', {
            page: this.data.page
        }, (data) => {
            data.data.list.map((e, k)=>{
                if(e.course)
                    e.course.avatar = 'http:'+e.course.avatar
                else
                    data.data.list.splice(k, 1)
            })
            this.setData({
                page: this.data.page+1,
                total: (this.data.page == 0)?data.data.total:this.data.total,
                orders: this.data.orders.concat(data.data.list)
            })
        })
    },

    // 倒计时方法
    countDown() {
        setInterval(()=>{
            const orders = this.data.orders
            orders.map((e)=>{
                if(e.course)
                    e.course._countdown = countdown(e.course.startTime)
            })
            this.setData({
                orders: orders
            })
        }, 1000)  
    },
    onLoad() {
        this.update()
        this.countDown()
        event.on('purchased.refresh', this.refresh)
    }
})