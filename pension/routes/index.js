var express = require('express');
var router = express.Router();

let comments = [
  {
      name: '张三',
      message: '今天天气不错！',
      dateTime: '2015-10-16'
  },
  {
      name: '张三2',
      message: '今天天气不错！',
      dateTime: '2015-10-16'
  },
  {
      name: '张三3',
      message: '今天天气不错！',
      dateTime: '2015-10-16'
  },
  {
      name: '张三4',
      message: '今天天气不错！',
      dateTime: '2015-10-16'
  },
  {
      name: '张三5',
      message: '今天天气不错！',
      dateTime: '2015-10-16'
  }
];

var data={
  list:comments
};


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index.html',{
    title:'首页',
    list:data
  });
  console.log(data)
})
module.exports = router;