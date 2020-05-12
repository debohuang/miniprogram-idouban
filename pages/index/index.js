// 获取全局应用程序实例对象
const app = getApp()

Page({
  data: {
    inTheaters: [],
    tvTop: [],
    comingSoon: [],
    top250: [],
    inTheatersLoadding: true,
    tvTopLoadding: true,
    comingSoonLoadding: true,
    top250Lodding: true
  },
  onLoad() {
    wx.showNavigationBarLoading()
    // 获取正在热映
    app.douban.find('in_theaters')
      .then(data => {
        let subjects = data.subjects
        for (let subject of subjects) {
          let average = subject.rating.average
          subject.start = this.averageToStars(average)
          if (subject.title.length >5)
            subject.title = subject.title.substring(0,5) + "..."
        }
        this.setData({
          inTheaters: data.subjects,
          inTheatersLoadding: false
        })
      })
      .catch(err => {
        console.log(err)
      })

      
     // 热门电视剧
    app.douban.findTv()
    .then(data => {
      let subjects = data.subject_collection_items
      for (let subject of subjects) {
        let average = 0
        if(subject.rating!=null){
          average = subject.rating.value
        }
        subject.start = this.averageToStars(average)
        if (subject.title.length > 5)
          subject.title = subject.title.substring(0, 5) + "..."
      }
      this.setData({
        tvTop: data.subject_collection_items,
        tvTopLoadding: false
      })
    })
    .catch(err => {
      console.log(err)
    })


    // 获取即将上映
    app.douban.find('coming_soon')
      .then(data => {
        let subjects = data.subjects
        for (let subject of subjects) {
          let average = subject.rating.average
          subject.start = this.averageToStars(average)
          if (subject.title.length > 5)
            subject.title = subject.title.substring(0, 5) + "..."
        }
        this.setData({
          comingSoon: data.subjects,
          comingSoonLoadding: false
        })
      })
      .catch(err => {
        console.log(err)
      })

    // 获取top250
    app.douban.find('top250')
      .then(data => {
        let subjects = data.subjects
        for (let subject of subjects) {
          let average = subject.rating.average
          subject.start = this.averageToStars(average)
          if (subject.title.length > 5)
            subject.title = subject.title.substring(0, 5) + "..."
        }
        this.setData({
          top250: data.subjects,
          top250Lodding: false
        })
        wx.hideNavigationBarLoading()
      })
      .catch(err => {
        console.log(err)
      })
    
  },
  toDetail(e) {
    var data= e.currentTarget.dataset
    var id = data.id
    var type= data.type
    if(type==null){
      type='movie'
    }
    console.log('id='+id)
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}&type=${type}`,
    })
  },
  averageToStars(average) {
    let start = []
    for (let i = 0; i < 5; i++ , average -= 2) {
      if (average >= 2) {
        start[i] = 1
      } else if (average >= 1) {
        start[i] = 2
      } else {
        start[i] = 0
      }
    }
    return start
  },
  toMoreInteaters() {
    wx.navigateTo({
      url: '/pages/more/moreintheaters',
    })
  },
  toMoreComingSoon(){
    wx.navigateTo({
      url: '/pages/more/morecomeing',
    })
  },
  toMoreTop(){
    wx.navigateTo({
      url: '/pages/more/moretop',
    })
  },
  toMoreTvTop(){
    wx.navigateTo({
      url: '/pages/more/moreTvTop',
    })
  },
})