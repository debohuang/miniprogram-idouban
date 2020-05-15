const app = getApp()
let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subject: {},
    comments: [],
    reviews: [],
    isLoaded:false,
    type:'movie'
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

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-a495ee69369991e2'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    wx.hideNavigationBarLoading()
  },
  getInfo(id,type) {
    var that = this
    this.setData({
      type:type
    })
    var promise = new Promise(function(resolve,reject){
      app.douban.findTvDetail(type,id)
      .then(data => {
        let subject = data
  
        if(subject.title==null){
          that.getDetailAgain(id,type);
          return;
        }

        // 电影评分处理
        let average=0
        if(subject.rating!=null){
          average = subject.rating.value
        }
       
        subject.start = that.averageToStars2(average)
        if (subject.title.length > 5)
          subject.title = subject.title.substring(0, 5) + "..."
  
        that.setData({
          subject
        })
        
        resolve(that.data.type);

      })
      .catch(err => {
        console.log(err)
        that.getDetailAgain(id,type);
        return;
      })
   })

   promise.then(function(res){
    app.douban.findTvDetailComment(res,id,2,4)
    .then(data => {
      let subject = data
      // 短评处理
      let comments1 = subject.interests
      for (let comment of comments1) {
        let rete=0
        if(comment.rating!=null){
          rete = comment.rating.value
        }
        comment.start = that.averageToStars(rete)
      }
      let comments = subject
      that.setData({
        comments
      })

    })
    .catch(err => {
      console.log(err)
    })
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

  getDetailAgain(id,type){
    var that = this
    if(!this.data.isLoaded){
      if(type=='tv'){
        type='movie'
      }else{
        type='tv'
      }
      this.setData({
        isLoaded:true,
        type:type
      })
      that.getInfo(id,type);
    }
  },

  copyBtn(){
    var that = this;
    var id = this.data.subject.id
    var type = this.data.type
    wx.setClipboardData({
      //去找上面的数据
      data:'pages/detail/detail?id='+id+'&type='+type ,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
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
  },

  onReady: function(options) {
    setTimeout(function () {
      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }, 2000);

  }

})
