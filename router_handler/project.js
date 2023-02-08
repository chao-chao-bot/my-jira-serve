const db = require("../db")

/**项目列表 */
exports.getProjectList = (req, res) => {
  const { id } = req
  const { creator_id } = req.query
  const project_name = req.query.project_name || ""
  let sql = `select j.username,p.* from project p join jira_user j on p.creator_id = j.id having creator_id = ? `
  if (project_name) {
    sql += `and project_name like "%${project_name}%"`
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
    return res.esend("创建人信息或者项目前缀不可以为空")
  }

  const sql = 'select * from project where creator_id = ?'
  db.query(sql, id, (err, results) => {
    if (err) {
      return res.esend(err)
    }
    if (results.length !== 1 && results.find((item) =>
      item.project_name === project_name || item.project_prefix === project_prefix
    )) {
      return res.esend("项目名称已存在，请重试")
    }
    const insertSql = 'insert into project set ?'
    db.query(insertSql, { creator_id: id, project_name, project_prefix, introduction: dataInfo.introduction || "" }, (err, results) => {
      if (err) return res.esend(err)
      if (results.affectedRows !== 1) {
        return res.esend('创建项目失败，请稍后再试！')
      }
    })
    const searchSql = `select project_name, project_prefix,introduction from project where creator_id = ? `
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
  console.log(req.params);
  console.log(req.body);
  //TODO：删除某个项目的时候需要检查当前项目下是否有任务要删除
  //给出二次提示
  return res.ssend([])
}

//项目编辑
exports.editProject = (req, res) => {
  const {id:project_id,...projectInfo} = req.body
  const { id } = req
  const sql = `select * from project where creator_id = ?`
  db.query(sql, id, (err, results) => {
    if (err) {
     return  res.esend(err)
    }
    for (let i = 0; i < results.length; i++) {
      if ( projectInfo['project_name'] && results[i].project_name === project_name) {
        return res.esend("当前项目名称已存在")
      } else if (projectInfo['project_prefix'] && results[i].project_prefix === project_prefix) {
        return res.esend("当前项目关键字已存在")
      }
    }
    console.log(projectInfo);
    const sql = `update project set ? where id = ?`
    db.query(sql, [projectInfo,project_id], (err, results) => {
      if (err) {
       return res.esend(err)
      }
      const sql = `select * from project where id =?`
      db.query(sql,project_id,(err,results)=>{
        if (err) {
          return res.esend(err)
         }
         return res.ssend(results[0]) 
      })
    })
  })
  
}