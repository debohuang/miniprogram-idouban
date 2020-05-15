// 获取全局应用程序实例对象
const app = getApp()
const htmlParser = require('../../utils/htmlParser.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    resultData: [],
    searchLoadding: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**清空输入框 */
  bindSearchDelete: function (event) {
    var readyData = { searchValue: "", showDelete: false, resultData: [] };
    this.setData(readyData);
  },
  search: function(e) {
    var that = this
    var keyword = e.detail.value
    if (keyword == '') {
      return
    } else {

      var readyData = { showDelete: true, resultData: [] };
      this.setData(readyData);

      wx.showNavigationBarLoading()
      app.douban.findTvSerach(keyword)
      .then(data => {
        let html = data.html
       
        let htmlJson=htmlParser(html)
        // console.log(htmlJson.children)
        let childs=htmlJson.children
        childs.forEach(element => {
          if(element.tagName=='li'){
            console.log(element.children[1])
            let elementObj=element.children[1]
            let movieId=elementObj.attributes.href.replace('/movie/subject/','').replace('/','')
            elementObj.id=movieId
            console.log(movieId)

            this.setData({
              resultData: that.data.resultData.concat(elementObj),
            })

          }
        });

        // this.setData({
        //   resultData: this.data.resultData+html,
        //   searchLoadding: false
        // })
  
        wx.hideNavigationBarLoading()
  
      })
      .catch(err => {
        console.log(err)
      })


    }
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {


  }

})