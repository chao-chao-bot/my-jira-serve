// 导入 express 模块
const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
const app = express()
// 将 cors 注册为全局中间件
app.use(cors())

app.use((req,res,next)=>{
  res.cc = function (err,status = 1){
    res.send({
      status,
      message:err instanceof Error ? err.message:err
    })
  }
  next()
})

app.use(express.urlencoded({ extended: false }))

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
// 错误中间件
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

})
app.use('/api',userRouter)

app.listen(3000, function () {
  console.log('api server running at http://127.0.0.1:3000')
})