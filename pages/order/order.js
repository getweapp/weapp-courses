import api from '../../utils/api'
import countdown from '../../utils/countdown'
import moment from '../../utils/moment'

Page({
    data: {
        course: {},
        show: false
    },
    countDown() {
        setInterval(()=>{
           const course = this.data.course
           course._countdown = countdown(course.startTime)
            this.setData({
                course: course
            })
        }, 1000)  
    },
    onLoad(options) {
        api.get('course/findById', {courseId: options.courseId}, (data) => {
            data.members.map((e) => {
                e.created = moment(e.created).format('YYYY-MM-DD HH:mm:ss')
            })
            const people = wx.getStorageSync('people') || null
            let show = true
            data.members.map((e) => {
                if(people && e.peopleId == people.peopleId)
                show = false
            })
            data.avatar = 'http:'+data.avatar
            this.setData({
                course: data,
                show: show
            })
        })
        this.countDown()
    }
})