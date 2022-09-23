const express = require('express');
const app = express();
const port = 3002;

var interceptor = require('express-interceptor')
// var mainIntercept = interceptor(function(req,res){

//     return {
//         isInterceptable:function(){
//             console.log("isInterceptable")
//             return true
//         },

//         intercept:function(body,send){
//             console.log("intercept",body)

//             let ob  = JSON.parse(body);
//             ob.value = 'TEST' 
//             let finalVal = JSON.stringify(ob)
//             send(finalVal)
//         },

//         afterSend:(oldBody,newBody)=>{
//             console.log("AfterSend")
//             console.log(oldBody,'===',newBody)
//         }
//     }
// })
// app.use(mainIntercept);
// #################### PDF ############# 

var fs = require('fs');
var pdf =  require('html-pdf');

process.stdout.on('error', function( err ) {
    if (err.code == "EPIPE") {
        process.exit(0);
    }
});

app.get("/home", async (req, res) => {
    let result = {
        id: 12,
        name: 'Test Demo'
    }
 
    var html = fs.readFileSync('./card.html','utf8');

    let options ={
        format:'Letter'
    }
    let mapObj = {
        '{{PRICE}}':"1200",
        '{{AMOUNT}}':"15000"
    } 

    html = html.replace(/{{PRICE}}|{{AMOUNT}}/gi,(matched)=>{return mapObj[matched]});

    pdf.create(html,options).toFile('./invoice.pdf',function(err,resp){

        if(err) return console.log(err);

        console.log(resp)
    })
    res.status(200).json(result)

})


app.get("/home2", async (req, res) => {
    let result = {
        id: 12,
        name: 'Test Demo 2'
    }
    res.status(200).json(result)

})


app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})