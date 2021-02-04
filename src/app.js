//倍恰删除脚本
//需要自己先登录之后将查询和删除的cookie抄下来
const http = require("http");
const axios = require('axios-https-proxy-fix')
let cookie = ""
let delCookie = ""

axios.defaults.withCredentials = true;
axios.defaults.crossDomain=true
const server = http.createServer((req,res)=>{
  res.end("hello")
})
server.listen(3000,'127.0.0.1',()=>{
  console.log("启动成功")
  getList()
})
const getList=()=>{
  //TODO:user_id要改
  let url = "https://foxconnchengdumaci.bearychat.com/api/files?user_id==bxmuK&lang=zh-CN"
  let getListService={
    url:url,
    method:"GET",
    headers:{
      'content-Type': 'application/json',
      "Accept": "/",
      "Cache-Control": "no-cache",
      "Cookie": delCookie,
      'authority':"foxconnchengdumaci.bearychat.com",
      'path':"/api/files?user_id=%3DbxmuK&lang=zh-CN",
    },
    proxy:{
      host: '代理ip',
      port: '代理端口号'
    },
    timeout: 10000,
  }
  axios(getListService).then((res)=>{
    let result = res.data.result
    if(result&&result.length){
      for(let i=0;i<result.length;i++){
        let id = result[i].id
        setTimeout(()=>{
          deleteListByUids(id)
        },1000)
      }
    }else{
      console.log("暂时没有查询到数据")
    }
  }).catch(err=>{
    console.log("err",err)
  })
}
var timeout;
const deleteListByUids=(id)=>{
  let url = "https://foxconnchengdumaci.bearychat.com/api/files/"+id+"#files?lang=zh-CN"
  let delService={
    url:url,
    params:{
      lang:"zh-CN"
    },
    method:"DELETE",
    headers:{
      "Cookie": cookie,
    },
    proxy:{
      host: '代理ip',
      port: '代理端口号'
    },
    timeout: 10000,
  }
  axios(delService).then((res)=>{
    console.log(id+"删除成功!")
    clearTimeout(timeout)
    timeout = setTimeout(()=>{
      console.log('正在重新查找中..........')
      getList()
    },3000)
  }).catch(err=>{
    console.log("删除失败",err)
  })
}