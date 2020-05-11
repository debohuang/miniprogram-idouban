module.exports = function (api, path, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${api}/${path}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}

module.exports.fetchByMobile = function (url, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'json','Referer': 'https://m.douban.com/tv/chinese' },
      success: resolve,
      fail: reject
    })
  })
}
