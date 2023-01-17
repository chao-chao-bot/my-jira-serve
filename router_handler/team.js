const db = require("../db")
exports.createTeam = (req, res) => {
  const { id } = req
  console.log(req.body);
  const { team_name, member } = req.body
  const sql = `select * from team where creator_id = ? and team_name = ?`
  db.query(sql, [id, team_name], (err, result) => {
    if (err) {
      return res.ssend(err)
    }
    if (result.length > 1) {
      return res.esend('团队名被占用，请更换其他用户名！')
    }
    const sql = `insert into team set ?`
    let memberStr = ''
    if (member) {
      memberStr = member.join()
      //通过socket.io 向所有memeber发送团队邀请
    }
    db.query(sql, { creator_id: id, team_name: team_name, member: memberStr }, (err, results) => {
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