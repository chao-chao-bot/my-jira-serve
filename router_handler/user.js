/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 判断数据是否合法
  if (!userinfo.username || !userinfo.password) {
    return res.esend('用户名或密码不能为空！')
  }
  const sql = `select * from user where username=?`
  db.query(sql, [userinfo.username], function (err, results) {
    if (err) {
      return res.esend(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.esend('用户名被占用，请更换其他用户名！')
    }
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    //注册用户
    const sql = 'insert into user set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      // 执行 SQL 语句失败
      if (err) return res.esend('用户名或密码不能为空！')

      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.esend('注册用户失败，请稍后再试！')
      }
      const user = { ...results[0], id: results.insertId, password: '' }
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: '10h',
      })
      res.ssend({
        token: 'Bearer ' + tokenStr,
        username: userinfo.username,
        id: results.insertId,
      })
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 判断数据是否合法
  if (!userinfo.username || !userinfo.password) {
    return res.esend('用户名或密码不能为空！')
  }
  const sql = `select * from user where username=?`
  db.query(sql, userinfo.username, function (err, results) {
    if (err) return res.esend(err)
    if (results.length !== 1) return res.esend('登录失败,请检查账号和密码')
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) {
      return res.esend('登录失败,请检查账号和密码')
    }
    const user = { ...results[0], password: '' }
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '40h',
    })
    setTimeout(() => {
      res.ssend({
        token: 'Bearer ' + tokenStr,
        username: results[0].username,
        id: results[0].id,
      })
    }, 2000)

  })
}

exports.getUser = (req, res) => {
  const users = [
    {
      "id": 2,
      "username": "张三"
    },
    {
      "id": 1,
      "username": "李四"
    },
    {
      "id": 3,
      "username": "王五"
    },
    {
      "id": 4,
      "username": "赵六"
    }
  ]
  res.ssend(users)

}

exports.getAllUsers = (req, res) => {
  const param = req.query
  const { id } = req
  const data = []
  const sql = `select id,username from user where username like  "%${param.code}%" and id!=${id}`
  db.query(sql, (err, results) => {
    if (err) {
      return res.esend(err)
    }
    for (let i = 0; i < results.length; i++) {
      const { username, id } = results[i]
      data.unshift({ value: String(id), label: username })
    }
    res.ssend(data)
  })
}