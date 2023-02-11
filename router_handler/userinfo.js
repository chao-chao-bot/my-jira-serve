const db = require('../db/index')

exports.getUserInfo = (req, res) => {
  const sql = `select * from user where id=?`
  db.query(sql, req.user.id, (err, results) => {
    if (err){
      res.statusCode = 500
      return  res.esend(err)
    } 
    if (results.length !== 1){
      return res.esend('获取用户信息失败！')
    } 
    const {id,username,email,user_pic,project} = results[0]
    res.ssend({
      user:{
        status: 1,
        message: '获取用户基本信息成功！',
        data: {id,username,email,user_pic,project},
      }
    })
  })
  
}