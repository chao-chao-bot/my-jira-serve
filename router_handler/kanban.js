const res = require('express/lib/response')
const { swapData, reorderData } = require('./util/reorder')
const db = require('../db')
const { initialKanBanList } = require('./const/kanban')
exports.getKanbanlist = (req, res) => {
  const { id } = req
  const { projectId } = req.query
  if (projectId) {
    const sql = `select * from kanban where project_id = ? order by order_id`
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
  const countSql = `SELECT MAX(order_id) as maxOrderId  FROM kanban;`
  db.query(countSql, (err, results) => {
    if (err) {
      console.error(err)
      return res.esend(err)
    }
    const maxOrderId = results[0].maxOrderId
    const sql = `insert into kanban set ?`
    db.query(sql, { name, project_id, order_id: maxOrderId + 1 }, (err, results) => {
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
  })
}

//reorderKanBan
exports.reorderKanBan = (req, res) => {
  const { fromId, referenceId, type } = req.body
  reorderData('kanban', fromId, referenceId, type).then(() => {
    return res.ssend([])
  })
}
