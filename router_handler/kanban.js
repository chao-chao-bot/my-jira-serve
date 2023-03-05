const res = require('express/lib/response')
const mysql = require('mysql2/promise')
const db = require('../db')
const { initialKanBanList } = require('./const/kanban')
exports.getKanbanlist = (req, res) => {
  const { id } = req
  const { projectId } = req.query
  if (projectId) {
    const sql = `select * from kanban where project_id = ?`
    db.query(sql, projectId, (err, results) => {
      if (err) {
        return res.esend(err)
      }
      return res.ssend(results)
    })
  } else {
    return res.ssend(initialKanBanList.map((kanban, index) => ({ ...kanban, id: index + 1 })))
  }
}

///kanban/create
exports.createKanBan = (req, res) => {
  const { name, projectId: project_id } = req.body
  const sql = `insert into kanban set ?`
  db.query(sql, { name, project_id }, (err, results) => {
    if (err) {
      return res.ssend(err)
    }
    const sql = `select * from kanban where project_id =?`
    db.query(sql, project_id, (err, results) => {
      if (err) {
        return res.esend(err)
      }
      return res.ssend(results)
    })
  })
}

//reorderKanBan
exports.reorderKanBan = (req, res) => {
  const { fromId, referenceId, type } = req.body
  console.log(fromId, referenceId, type)
  swapData('kanban', fromId, referenceId).then(() => {
    return res.ssend([])
  })
}

const swapData = async (table, fromId, referenceId) => {
  try {
    const db = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'jira_db'
    })
    // 获取原始数据
    const [fromData] = await db.query(`SELECT * FROM ${table} WHERE id = ${fromId}`)
    const [referenceData] = await db.query(`SELECT * FROM ${table} WHERE id = ${referenceId}`)
    console.log(referenceData[0], fromId)
    // 交换数据的位置
    await db.query(`UPDATE ${table} SET id = ? WHERE id = ?`, [-1, referenceId])
    await db.query(`UPDATE ${table} SET ? WHERE id = ?`, [referenceData[0], fromId])
    await db.query(`UPDATE ${table} SET ? WHERE id = ?`, [fromData[0], -1])
    db.end() // 关闭连接
  } catch (error) {
    console.error(error)
  }
}
