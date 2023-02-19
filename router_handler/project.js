const db = require('../db')
const { getMemberList } = require('./team')
/**项目列表 */
exports.getProjectList = (req, res) => {
  const { id } = req
  const { commander } = req.query
  const project_name = req.query.project_name || ''
  let sql = `select u.username  as commander_name,p.* from project p join user u on p.creator_id = ? and u.id =  p.commander `
  if (project_name) {
    sql += `and project_name like "%${project_name}%"`
  }
  if (commander) {
    sql += `and p.commander = ${commander}`
  }
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.esend(err)
    }

    return res.ssend(results)
  })
}

exports.createProject = (req, res) => {
  const { id } = req
  const dataInfo = req.body
  const { project_prefix, project_name } = dataInfo

  if (!id || !project_prefix || !project_name) {
    return res.esend('创建人信息或者项目前缀不可以为空')
  }

  const sql = 'select * from project where creator_id = ?'
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.esend(err)
    }
    if (
      results.length !== 1 &&
      results.find(
        item => item.project_name === project_name || item.project_prefix === project_prefix
      )
    ) {
      return res.esend('项目名称已存在，请重试')
    }
    const insertSql = 'insert into project set ?'
    db.query(
      insertSql,
      {
        ...(dataInfo || '')
      },
      (err, results) => {
        if (err) return res.esend(err)
        if (results.affectedRows !== 1) {
          return res.esend('创建项目失败，请稍后再试！')
        }
      }
    )
    const searchSql = `select p.*, username as commmander_name from user u join project p on creator_id = ? and u.id =  p.commander`
    db.query(searchSql, id, (err, results) => {
      if (err) {
        return res.esend(err)
      }
      return res.ssend(results)
    })
  })
}
/**项目删除 */
exports.deleteProject = (req, res) => {
  // console.log(req.query);
  console.log(req.params)
  console.log(req.body)
  //TODO：删除某个项目的时候需要检查当前项目下是否有任务要删除
  //给出二次提示
  return res.ssend([])
}

//项目编辑
exports.editProject = (req, res) => {
  const updateProject = (project, id) => {
    const sql = `update project set ? where id =?`
    db.query(sql, [project, id], (err, results) => {
      if (err) {
        return res.esend(err)
      }
      return res.ssend(results[0])
    })
  }

  const project_info = req.body
  const { id } = req.params
  let p = null
  if (project_info.project_name) {
    p = new Promise(resolve => {
      const { project_name, creator_id, project_prefix } = project_info
      const sql = `select * from (select * from project where creator_id = ?) as b where id != ? and (project_name = ? or project_prefix = ?);`
      db.query(sql, [creator_id, id, project_name, project_prefix], (err, results) => {
        if (err) {
          return res.esend(err)
        }
        if (results.length > 0) {
          return res.ssend('项目名称或前缀重复')
        }
        resolve()
      })
    })
  }
  if (p) {
    p.then(() => {
      updateProject(project_info, id)
    })
  } else {
    updateProject(project_info, id)
  }
}

/**负责人列表 */
exports.getCommanderList = (req, res) => {
  const { id } = req
  const sql =
    'select  p.commander,u.username from project p join user u where p.commander = u.id and creator_id =? group by p.commander;'
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.esend(err)
    }
    return res.ssend(
      results.map(item => ({
        id: item.commander,
        username: item.username
      }))
    )
  })
}
/**项目删除 */

exports.deleteProject = (req, res) => {
  const { project_id } = req.body
  const sql = `delete from project where id =?`
  //todo判断当下项目的关联任务的进度如何 再次确定是否要删除
  db.query(sql, project_id, (err, results) => {
    if (err) {
      res.esend(err)
    }
    if (results.affectedRows !== 1) {
      res.esend('删除失败，请稍后再试！')
    }
    return res.ssend(results)
  })
}

exports.getInfoProject = (req, res) => {
  const { project_id } = req.query
  const sql = `select * from project where id =?`
  db.query(sql, project_id, (err, results) => {
    if (err) {
      return res.esend(err)
    }
    if (results.length !== 1) {
      return res.esend('查询失败，请稍后再试！')
    }
    return res.ssend(results[0])
  })
}
