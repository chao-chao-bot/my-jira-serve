const { INVITE_MEMBER } = require('./const')
const db = require("../db");



const requireMember = (member, req, res, id, team_name, inviter) => {
  //通过socket.io 向所有memeber发送团队邀请
  const searchSql = `select user_id,socket_id,username from socket where user_id = ?`
  const searchRes = []
  let p = null
  for (let i = 0; i < member.length; i++) {
    p = new Promise((resolve, reject) => {
      db.query(searchSql, Number(member[i]), (err, results) => {
        if (err) {
          return res.esend(err)
        } else if (results.length === 1) {
          resolve(results[0])
        }
      })
    }).then(value => {
      console.log(value);
      searchRes.push(value)
    })
  }
  p.then(() => {
    for (let i = 0; i < searchRes.length; i++) {
      console.log("luelueue", INVITE_MEMBER);
      req.socketIO.to(searchRes[i].socket_id).emit(INVITE_MEMBER,{inviter,inviter_id:id,team_name})
    }
  })
}


exports.createTeam = (req, res) => {
  const { id } = req
  const { team_name, member } = req.body
  const sql = `select * from team where creator_id = ? and team_name = ?`
  db.query(sql, [id, team_name], (err, result) => {
    if (err) {
      return res.ssend(err)
    }
    if (result.length >= 1) {
      return res.esend('团队名被占用，请更换其他用户名！')
    }
    if (member.length) {
      const sql = `select username from socket where user_id = ?`
      new Promise((resolve) => {
        db.query(sql, id, (err, results) => {
          if (err) {
            return res.ssend(err)
          }
          if (results.length === 1) {
            resolve(results[0].username)
          }
        })
      }).then((username) => {
        requireMember(member, req, res, id, team_name, username)
      })
    }
    const sql = `insert into team set ?`
    db.query(sql, { creator_id: id, team_name: team_name, member: '' }, (err, results) => {
      if (err) {
        return res.ssend(err)
      }
      if (results.affectedRows !== 1) {
        return res.esend('创建团队失败，请稍后再试！')
      }
      const sql = `select team_name,creator_id,member from team where creator_id = ?`
      db.query(sql, id, (err, results) => {
        if (err) {
          res.esend(err)
        }
        return res.ssend(results)
      })
    })
  })
}