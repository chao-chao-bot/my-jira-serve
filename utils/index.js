const res = require("express/lib/response");

function reWriteSend(err,status = 1){
  res.ssend({
    status,
    message:err instanceof Error ? err.message:err
  })
}


module.exports.reWriteSend = reWriteSend



//数组去重
function unique(arr){
  let newArr = [];
  for(let i=0;i<arr.length;i++){
      if(newArr.indexOf(arr[i])===-1){
          newArr.push(arr[i]);
      }
  }
  return newArr;
}
module.exports.unique = unique

//转数组
const toNumber = (value) => (isNaN(Number(value)) ? 0 : Number(value))

module.exports.toNumber = toNumber