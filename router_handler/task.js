const db = require('../db')
const { TaskTypes, TaskPriorities } = require('./const/task')

exports.getTasklist = (req, res) => {
  const { id: user_id } = req
  const { projectId, name, typeId, processorId } = req.query
  let sql = `select * from task where creator = ?`
  if (name) {
    sql += ` and name like "%${name}%"`
  }
  if (typeId) {
    sql += ` and type_id = ${typeId}`
  }
  if (processorId) {
    sql += ` and commander = ${processorId}`
  }
  if (projectId) {
    sql += ` and project_id  = ${projectId}`
  }
  db.query(sql, user_id, (err, results) => {
    if (err) {
      throw new Error(err)
      return res.esend(err)
    }

    const forMatRes = results.map(({ project_id, kanban_id, end_date, type_id, ...reset }) => ({
      projectId: project_id,
      kanbanId: kanban_id,
      endDate: end_date,
      typeId: type_id,
      ...reset
    }))
    return res.ssend(forMatRes)
  })
}

exports.getTaskTypelist = (req, res) => {
  res.ssend(TaskTypes)
}

exports.getTaskPriorities = (req, res) => {
  res.ssend(TaskPriorities)
}
/**创建项目 */
exports.createTask = (req, res) => {
  const { id: userId } = req
  const {
    name,
    projectId: project_id,
    kanbanId: kanban_id,
    endDate: end_date,
    taskType: type_id,
    describe,
    priority,
    commander
  } = req.body
  const sql = `insert into task  set ?`
  db.query(
    sql,
    {
      name,
      project_id,
      kanban_id,
      end_date,
      type_id,
      describe: describe || '',
      priority: priority || TaskPriorities[0].id,
      commander,
      creator: userId
    },
    (err, results) => {
      if (err) {
        return res.esend(err)
      }
      if (results.affectedRows !== 1) {
        return res.esend('创建团队失败，请稍后再试！')
      }
      return res.ssend({})
    }
  )
}

exports.reorderTask = (req, res) => {
  console.log(req.body)
  const { fromId, referenceId, fromKanbanId, toKanbanId } = req.body
  if (fromKanbanId && toKanbanId) {
    console.log('nenne')
  }

  return res.ssend([])
}
