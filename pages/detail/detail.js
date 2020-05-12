const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subject: {},
    comments: [],
    reviews: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    // const {
    //   id
    // } = options
    let id=options.id
    let type=options.type
    this.getInfo(id,type)
    wx.hideNavigationBarLoading()
  },
  getInfo(id,type) {

    app.douban.findTvDetail(type,id)
    .then(data => {
      let subject = data
      // 电影评分处理
      let average=0
      if(subject.rating!=null){
        average = subject.rating.value
      }
     
      subject.start = this.averageToStars2(average)
      if (subject.title.length > 5)
        subject.title = subject.title.substring(0, 5) + "..."

      this.setData({
        subject
      })

    })
    .catch(err => {
      console.log(err)
    })

    app.douban.findTvDetailComment(type,id)
    .then(data => {
      let subject = data
      // 短评处理
      let comments1 = subject.interests
      for (let comment of comments1) {
        let rete=0
        if(comment.rating!=null){
          rete = comment.rating.value
        }
        comment.start = this.averageToStars(rete)
      }
      let comments = subject
      this.setData({
        comments
      })

    })
    .catch(err => {
      console.log(err)
    })
    

    // app.douban.findOne(id)
    //   .then(data => {
    //     let subject = data
    //     // 电影评分处理
    //     let average = subject.rating.average
    //     subject.start = this.averageToStars2(average)
    //     if (subject.title.length > 5)
    //       subject.title = subject.title.substring(0, 5) + "..."

    //     // 短评处理
    //     let comments = subject.popular_comments
    //     for (let comment of comments) {
    //       let rete = comment.rating.value
    //       comment.start = this.averageToStars(rete)
    //     }
    //     // 影评处理
    //     let reviews = subject.popular_reviews.slice(2)
    //     for (let review of reviews) {
    //       let rete = review.rating.value
    //       review.start = this.averageToStars(rete)
    //     }
    //     this.setData({
    //       subject,
    //       comments,
    //       reviews
    //     })
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  },
  averageToStars(average) {
    let start = []
    for (let i = 0; i < 5; i++, average -= 1) {
      if (average >= 1) {
        start[i] = 1
      } else if (average >= 0.5) {
        start[i] = 2
      } else {
        start[i] = 0
      }
    }
    return start
  },
  averageToStars2(average) {
    let start = []
    for (let i = 0; i < 5; i++, average -= 2) {
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
  toMoreComment() {
    const { id } = this.data.subject
    const { type } = this.data.subject
    wx.navigateTo({
      url: `/pages/more/morecomment?id=${id}&type=${type}`,
    })
  },
  toMoreReview() {
    const { id } = this.data.subject
    wx.navigateTo({
      url: `/pages/more/morereview?id=${id}`,
    })
  },
  toReviewDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail/reviewdetail?id=${id}`,
    })
  }
})