const db = require("../db")


exports.getProject = (req,res) =>{
  const projects = [
    {
      "key": 1,
      "name": "骑手管理",
      "personId": 1,
      "organization": "外卖组"
    },
    {
      "key": 2,
      "name": "团购APP",
      "personId": 2,
      "organization": "团购组"
    },
    {
      "key": 3,
      "name": "物料管理系统",
      "personId": 2,
      "organization": "物料组"
    },
    {
      "key": 4,
      "name": "总部管理系统",
      "personId": 3,
      "organization": "总部组"
    },
    {
      "key": 5,
      "name": "送餐路线规划系统",
      "personId": 4,
      "organization": "送餐组"
    }
  ]
  setTimeout(()=>{
    res.ssend(projects)
  },2000)
}



exports.createProject = (req,res)=>{
  const dataInfo = req.body
  const {creator_id,project_prefix,project_name} = dataInfo

  if(!creator_id || !project_prefix || !project_name) {
    return res.esend("创建人信息或者项目前缀不可以为空")
  }
  
  
  const sql = 'select * from projects where creator_id = ?'
  db.query(sql,creator_id,(err,results)=>{
    if(err){
      return res.esend(err)
    }
    if(results.length !== 1 && results.find((item) => 
       item.project_name === project_name || item.project_prefix === project_prefix
    )){
    console.log('重复',project_name,project_prefix);
    return  res.esend("创建出错，请重试")
    }
    const insertSql = 'insert into projects set ?'
    db.query(insertSql,{creator_id,project_name,project_prefix,introduction:dataInfo.introduction || ""},(err,results) => {
      if(err) return res.esend(err)
      if(results.affectedRows !== 1){
        return res.esend('创建项目失败，请稍后再试！')
      }
    })
    const searchSql = `select project_name, project_prefix,introduction from projects`
    db.query(searchSql,creator_id,(err,results)=>{
      if(err){
        return res.esend(err)
      }
      return res.ssend({data:results})
    })
  })

  
}