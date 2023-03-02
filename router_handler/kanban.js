const db = require('../db')
exports.getKanbanlist = (req, res) => {
  const { id } = req
  const { projectId } = req.query
  const sql = `select * from kanban where project_id = ?`
  db.query(sql, projectId, (err, results) => {
    if (err) {
      return res.esend(err)
    }
    return res.ssend(results)
  })
}
