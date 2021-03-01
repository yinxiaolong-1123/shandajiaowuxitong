//此文件用来检测打包后的文件，相当于开启了一个express服务器；
const express = require('express');
const app = express();



//方法一 使用静态文件
const path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

//方法二 使用fs
// const fs=require('fs');
// app.get("/dist", function(request, response) {
//     fs.readFile("./dist/index.html",function(err,data){
//         // body
//         if(err){
//             console.log(err);
//             //404：NOT FOUND
//             response.writeHead(404,{"Content-Type":"text/html"});
//         }
//         else{
//             //200：OK
//             response.writeHead(200,{"Content-Type":"text/html"});
//             response.write(data.toString());
//         }
//         response.end();

//     });
// });

app.listen(3000,() => {
    console.log('app listening on port 3000. http://localhost:3000')
});

