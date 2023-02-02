
// 导入 express 模块
const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')
const config = require('./config')
const userinfoRouter = require('./router/userinfo')
const projectRouter = require('./router/project')
const teamtRouter = require('./router/team')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
const jwt = require('jsonwebtoken')
const app = express()
const server = require('http').Server(app)
const { Server } = require("socket.io");
const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:5000"
  }
});
require('./socket/index.js')(socketIO);
app.use(cors())

app.use((req, res, next) => {
  // 0表示失败 1表示成功
  res.esend = function (err, status = 0) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  res.ssend = function (data, status = 1) {
    res.send({
      status,
      message: 'success',
      data: data || {}
    })
  }
  next()
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\/auth\//] }))
// 错误中间件
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') return res.esend('身份认证失败！')
  next()
})
//socket中间件
app.use(function (req, res, next) {
  if (socketIO) {
    req.socketIO = socketIO
    next()
  } else {
    res.esend("socket 连接失败！")
  }

})

app.use(function (req, res, next) {
  //正则匹配需要鉴权的路由
  const regexp = new RegExp("^/api/auth")
  if (!regexp.test(req.path)) {
    const token = req.headers["authorization"].replace("Bearer ", "");
    const result = jwt.verify(token, config.jwtSecretKey);
    req.id = result.id
  }
  next()
})

app.use('/api', userRouter)
app.use('/api', userinfoRouter)
app.use('/api', projectRouter)
app.use('/api', teamtRouter)

server.listen(3000, function () {
  console.log('api server running at http://127.0.0.1:3000')
})
