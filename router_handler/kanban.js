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
  console.log(req.body)
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
