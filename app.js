// 导入 express 模块
const express = require('express')
const cors = require('cors')
const userRouter = require('./router/user')


const app = express()

// 将 cors 注册为全局中间件
app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use('/api',userRouter)

app.listen(3000, function () {
  console.log('api server running at http://127.0.0.1:3000')
})