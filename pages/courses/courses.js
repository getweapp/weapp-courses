import api from '../../utils/api'
import moment from '../../utils/moment'

Page({
  data: {
    fixed: "fixed",              // 是否吸顶
    tags: [],
    curTab: 0,
    total: 0,
    page: 0,
    list: []                // 商品数据
  },

  init() {
    api.get('course/findTags', {page:0}, (data) => {
      data.list.sort((first, second) => {
        return second.power - first.power
      })
       this.setData({
          tags: data.list
        })
        this.update(1)
    })
  },

  update(mode) {  
    api.get('course/findByStep', {
      tag: (this.data.tags[this.data.curTab])?this.data.tags[this.data.curTab].title:'',
      page: this.data.page,
      step: 1
    }, (data) => {
      data.list.map((e) => {
        e.avatar = 'http:'+e.avatar+'-marked3'
        e.startTime = moment(e.startTime).format('YYYY-MM-DD HH:mm')
      })
      this.setData({
        total: (this.data.page == 0)?data.total:this.data.total,
        page: this.data.page+1,
        list: (mode==1)?data.list:this.data.list.concat(data.list)
      })  
      })

  },

  navLink(e) {    // nav导航栏切换
    const index = e.currentTarget.dataset
    this.setData({
      curTab: e.currentTarget.dataset.index,
      page: 0
    })

  this.update(1)    

  },

 onLoad: function(e) {     // 首次加载
      this.init()
  }
})