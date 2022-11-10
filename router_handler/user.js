/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 判断数据是否合法
  if (!userinfo.username || !userinfo.password) {
    return res.cc('用户名或密码不能为空！')
  }
  const sql = `select * from jira_user where username=?`
  db.query(sql, [userinfo.username], function (err, results) {
    if (err) {
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    //注册用户
    const sql = 'insert into jira_user set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      // 执行 SQL 语句失败
      if (err) return res.cc('用户名或密码不能为空！')
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试！')
      }
      // 注册成功
      res.cc('注册成功！', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  res.send('login OK')
}