const db = require('../db')
const {
  updateMember
} = require('../router_handler/team.js')
module.exports = socketIO => {
  socketIO.on('connection', socket => {
    console.log(`⚡: ${socket.id} 用户连接!`)
    socket.on('on_online', userInfo => {
      const { id, username } = userInfo
      if (id && username) {
        // console.log('user-id', id, socket.id);
        //将用户的id和socketid进行关联存储到sql表中
        const sql =
          'select * from socket where user_id =?'
        db.query(sql, id, (err, results) => {
          if (err) {
            return console.log(err)
          }
          if (results.length === 0) {
            const insertSql = `insert into socket set?`
            db.query(
              insertSql,
              {
                user_id: id,
                username: username,
                socket_id: socket.id
              },
              (err, results) => {
                if (err) {
                  return console.log(err)
                }
                if (results.affectedRows !== 1) {
                  return console.log(
                    '连接失败，请稍后'
                  )
                }
              }
            )
          } else if (results.length === 1) {
            //更新团队成员
            const updateSql = `update socket set socket_id =? where user_id = ?`
            db.query(
              updateSql,
              [socket.id, id],
              (err, results) => {
                if (err) {
                  return console.log(err)
                }
                if (results.affectedRows !== 1) {
                  return console.log(
                    '连接失败，请稍后'
                  )
                }
              }
            )
          }
        })
      }
      socket.on('agree_to_join', data => {
        updateMember(userInfo, data)
      })
    })
    socket.on('disconnect', () => {
      console.log('🔥: 一个用户已断开连接')
    })
  })
}
