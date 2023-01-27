
const db = require('../db')
module.exports = (socketIO) => {
  socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} 用户连接!`);
    socket.on('online', (id) => {
      if (id) {
        console.log('user-id', id, socket.id);
        //将用户的id和socketid进行关联存储到sql表中 
        const sql = 'select * from socket where user_id =?'
        db.query(sql, id, (err, results) => {
          if (err) {
            return console.log(err);
          }
          if (results.length === 0) {
            //插入
            const insertSql = `insert into socket set?`
            db.query(insertSql, { user_id: id, socket_id: socket.id }, (err, results) => {
              if (err) {
                return console.log(err);
              }
              if (results.affectedRows !== 1) {
                return console.log("连接失败，请稍后");
              }
            })
          } else if (results.length === 1) {
            //更新
            const updateSql = `update socket set socket_id =? where user_id = ?`
            db.query(updateSql, [socket.id, id], (err, results) => {
              if (err) {
                return console.log(err);
              }
              if(results.affectedRows !==1){
                return console.log("连接失败，请稍后");
              }
            })
          } 
        })
      }
    })
    socket.on('disconnect', () => {
      console.log('🔥: 一个用户已断开连接');
    });
  });
}