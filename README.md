# miniprogram-idouban

* 界面主要模仿豆瓣评分
* 数据来源[https://douban.uieee.com ](https://github.com/zce/douban-api-proxy )(感谢@zce搭的nginx代理 有需求的同学可以参照自己搭一下)
* 其他好像也没什么了(￣▽￣)"


## 自定义功能

- 电视剧、详情、短评，对接m.douban.com接口。接口信息通过浏览器访问 m.douban.com，F12查看请求信息获得。

- 搜索功能返回为html页面信息，通过htmlParser 组件，实现html转换为json，以便在页面输出.
    
   源码：[github](https://github.com/henryluki/html-parser)
   
   使用方法：将dist 下的htmlParser.min.js 引入小程序，htmlParser(html) 转换成json
