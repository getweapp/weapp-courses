import api from '../../utils/api'
import moment from '../../utils/moment'

Page({
    data:{
        total: 0,
        page: 0,
        score: 0,
        scores:[]
    },
    update() {
        api.get('scores', {page: this.data.page}, (data) => {
            console.log('scores:', data)
            data.data.list.map((e) => {
                e.created = moment(e.created).format('YYYY-MM-DD')
            })
            this.setData({
                page: this.data.page+1,
                score: (this.data.page == 0)?data.data.score: this.data.score,
                total: (this.data.page==0)?data.data.total: this.data.total,
                scores: this.data.scores.concat(data.data.list)
            })
        })
    },
    onLoad() {
        this.update()
    }
})