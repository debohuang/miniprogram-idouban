const URI = 'https://douban.uieee.com/v2/movie'
const MOBILE_URI = 'https://m.douban.com/rexxar/api/v2/subject_collection/tv_domestic/items?os=android&for_mobile=1'
const fetch = require('./fetch')

/**
 * 抓取豆瓣电影特定类型的API
 * https://developers.douban.com/wiki/?title=movie_v2
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(type, params) {
  return fetch(URI, type, params)
}

/**
 * 获取列表类型的数据
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       包含抓取任务的Promise
 */
function find(type, page = 1, count = 20, search = '') {
  const params = { start: (page - 1) * count, count: count, city: getApp().data.currentCity }
  return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
    .then(res => res.data)
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     电影ID
 * @return {Promise}       包含抓取任务的Promise
 */
function findOne(id) {
  return fetchApi('subject/' + id)
    .then(res => res.data)
}

function findComments(id, start = 0, count = 20) {
  const params = { start: start, count: count}
  return fetchApi('subject/' + id + '/comments', params)
    .then(res => res.data)
}

function findReviews(id, start = 0, count = 20) {
  const params = { start: start, count: count }
  return fetchApi('subject/' + id + '/reviews', params)
    .then(res => res.data)
}

function findReview(id) {
  return fetchApi('review/' + id)
    .then(res => res.data)
}


// ----------------对接m.douban.com网页接口 start---------------------------
/**
 * m.douban.com网页接口调用出口
 * @param {*} URI 
 * @param {*} params 
 */
function fetchMobileApi(URI, params) {
  return fetch.fetchByMobile(URI, params)
}

/**
 * 获取热门TV数据列表
 * @param {*} type 
 * @param {*} page 
 * @param {*} count 
 */
function findTv(page = 1, count = 20) {
  const params = { start: (page - 1) * count, count: count }
  return fetchMobileApi(MOBILE_URI, params)
    .then(res => res.data)
}



// -----------------对接m.douban.com网页接口 end--------------------------

module.exports = { find, findOne, findComments, findReviews, findReview,findTv }