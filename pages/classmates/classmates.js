import api from '../../utils/api'
import moment from '../../utils/moment'

Page({
    data: {
        page: 0,
        total: 0,
        peoples: []
    },
    update() {
        api.get('peoples', {page: this.data.page}, (data) => {
            data.data.list.map((e) => {
                e.created = moment(e.created).format('YYYY-MM-DD HH:mm')
            })
            this.setData({
                total:(this.data.page==0)?data.data.total:this.data.total,
                page: this.data.page+1,
                peoples: this.data.peoples.concat(data.data.list)
            })
        })
    },
    onLoad() {
        this.update()
    }
})