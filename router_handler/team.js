const { INVITE_MEMBER } = require('./const/team/index')

const { unique, toNumber } = require('../utils/index')
const db = require('../db')
/**
 *
 * @param {*被邀请的成员} member
 * @param {*} req
 * @param {*} res
 * @param {*用户id} id
 * @param {*团队名称} team_name
 * @param {*用户名称} username
 */
const requireMember = (member, req, res, id, team_name) => {
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
      searchRes.push(value)
    })
  }
  p.then(() => {
    for (let i = 0; i < searchRes.length; i++) {
      console.log('luelueue', INVITE_MEMBER)
      req.socketIO
        .to(searchRes[i].socket_id)
        .emit(INVITE_MEMBER, { inviter: req.username, inviter_id: id, team_name })
    }
  })
}

/**团队创建 */
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
    if (member && member.length) {
      const sql = `select username from socket where user_id = ?`
      new Promise(resolve => {
        db.query(sql, id, (err, results) => {
          if (err) {
            return res.ssend(err)
          }
          if (results.length === 1) {
            resolve(results[0].username)
          }
        })
      }).then(username => {
        requireMember(member, req, res, id, team_name)
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
//
exports.updateMember = (user, inviter) => {
  console.log(user)
  const sql = 'select member from team where creator_id =? and team_name=?'
  db.query(sql, [inviter.inviter_id, inviter.team_name], (err, results) => {
    if (err || results.length > 1) {
      console.log(err)
      throw new Error(err)
    }
    let memberArr = []
    let memberStr = user.id.toString()
    if (results[0] && results[0].member) {
      memberArr = results[0].member.split(',')
      //过滤已经存在成员
      if (!memberArr.includes(user.id.toString())) {
        memberArr.push(user.id.toString())
      }
      memberStr = memberArr.join(',')
    }
    const sql = `update team set member=? where creator_id =? and team_name= ?`
    db.query(sql, [memberStr, inviter.inviter_id, inviter.team_name], (err, results) => {
      if (err || results.length > 1) {
        throw new Error(err)
      }
    })
  })
}

exports.getTeamList = (req, res) => {
  const { id } = req
  console.log(id)
  const sql = `select * from team where creator_id = ?`
  db.query(sql, id, (err, results) => {
    if (err) {
      res.esend(err)
    }
    return res.ssend(results)
  })
}
//邀请成员加入团队
exports.inviteMember = (req, res) => {
  const { id } = req
  const { id: team_id, member, team_name } = req.body
  requireMember(member, req, res, id, team_name)
  const sql = `select * from team where creator_id = ?`
  db.query(sql, id, (err, results) => {
    if (err) {
      res.esend(err)
    }
    return res.ssend(results)
  })
}

//获取成员列表
exports.getMemberList = (req, res) => {
  const { id } = req
  const sql = `select distinct member from team where creator_id = ? and member != ''`
  const p = new Promise((resolve, reject) => {
    let member = []
    db.query(sql, id, (err, results) => {
      if (err) {
        return res.esend(err)
      }
      for (let i = 0; i < results.length; i++) {
        const arr = results[i].member.split(',')
        member.push(...arr)
      }
      member = unique(member)
      for (let i = 0; i < member.length; i++) {
        member[i] = toNumber(member[i])
      }
      resolve(member)
    })
  })
  p.then(memberArr => {
    const sql = `select id,username as name,email from user where id = ?`
    Promise.all(
      memberArr.map(item => {
        return new Promise((resolve, reject) => {
          db.query(sql, item, (err, results) => {
            if (err) {
              return reject(err)
            } else {
              resolve(results[0])
            }
          })
        })
      })
    ).then((value, err) => {
      if (err) {
        return res.esend(err)
      }
      return res.ssend(value)
    })
  })
}
