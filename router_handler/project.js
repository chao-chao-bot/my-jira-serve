const db = require("../db")


exports.getProjectList = (req,res) =>{
  const {id} = req
  const {creator_id} = req.query
  const project_name = req.query.project_name || ""
  let sql = `select j.username,p.* from projects p join jira_user j on p.creator_id = j.id having creator_id = ? `
  if(project_name){
    sql += `and project_name like "%${project_name}%"`
  }
  db.query(sql,id,(err,results)=>{
    if(err){
      return res.esend(err)
    }
    return res.ssend(results)
  })
}



exports.createProject = (req,res)=>{
  const {id} = req
  const dataInfo = req.body
  const {project_prefix,project_name} = dataInfo

  if(!id || !project_prefix || !project_name) {
    return res.esend("创建人信息或者项目前缀不可以为空")
  }
  
  const sql = 'select * from projects where creator_id = ?'
  db.query(sql,id,(err,results)=>{
    if(err){
      return res.esend(err)
    }
    if(results.length !== 1 && results.find((item) => 
       item.project_name === project_name || item.project_prefix === project_prefix
    )){
    return  res.esend("项目名称已存在，请重试")
    }
    const insertSql = 'insert into projects set ?'
    db.query(insertSql,{creator_id:id,project_name,project_prefix,introduction:dataInfo.introduction || ""},(err,results) => {
      if(err) return res.esend(err)
      if(results.affectedRows !== 1){
        return res.esend('创建项目失败，请稍后再试！')
      }
    })
    const searchSql = `select project_name, project_prefix,introduction from projects where creator_id = ? `
    db.query(searchSql,id,(err,results)=>{
      if(err){
        return res.esend(err)
      }
      return res.ssend(results)
    })
  })  
}

exports.deleteProject = (req,res)=>{
  //TODO：删除某个项目的时候需要检查当前项目下是否有任务要删除
  //给出二次提示
}