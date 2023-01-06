const db = require("../db")


exports.getProjectList = (req,res) =>{
  const {id} = req
  console.log(req.query);
  const project_name = req.query.project_name || ""
  //todo ：缺少负责人 需要建立表的连接查询以及模糊查询
  const sql = `select j.username,p.* from projects p join jira_user j on p.creator_id = j.id having creator_id = ? and project_name like "%${project_name}%"`
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