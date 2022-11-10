const res = require("express/lib/response");

function reWriteSend(err,status = 1){
  res.send({
    status,
    message:err instanceof Error ? err.message:err
  })
}


module.exports.reWriteSend = reWriteSend