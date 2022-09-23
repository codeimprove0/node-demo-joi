const express = require('express');
const app = express();
const port = 3002;  
  

// ######### REDIS #########//
 
const redis = require('redis');
const redisClient = redis.createClient(6379, '127.0.0.1');
redisClient.connect(); 
redisClient.on("connect", function(error) {
    console.log("Redis: connected");
}); 

var interceptor = require('express-interceptor');

var mainInterceptor = interceptor(function(req, res){
    return { 

      isInterceptable: function(){
         // console.log("MEEEE")
        return  true;
      }, 

      intercept: function(body, send) {
        console.log("MEEEE222",body) 
     
        let ob = JSON.parse(body);
        ob.value = 'testing' 
        send(JSON.stringify(ob));
      },

      afterSend: (oldBody, newBody) =>{
        console.log(oldBody,'====',newBody)
        console.log('meee33')
      }
    };
  })
  app.use(mainInterceptor);

app.get("/home",async (req,res)=>{

        // ########## First Cache ########
    let keyName ='normalKey';
    let getCacheData =  await redisClient.get(keyName);
    let result = {
        id:12,
        name:'Test Demo'
    }
    let responseArray = {};
    if(getCacheData){ 
        responseArray = JSON.parse(getCacheData); 
        console.log("Cache Data") 
    }else{
        responseArray = result;
        redisClient.set(keyName,JSON.stringify(result),{EX:20});
        console.log("SET Cache")
    }

    // ####### H hash #######
//     let keyName = 'second';
//     let getCacheData =  await redisClient.HGET('bid',keyName);
//     let result = {
//         id:12,
//         name:'Test Demo'
//     }
//     let all = await redisClient.HGETALL('bid');
//    // console.log(all.first)  
//     let responseArray = {}; 
//     if(getCacheData){ 
//         responseArray = JSON.parse(getCacheData); 
//         console.log("Cache Data") 
//     }else{
//         responseArray = result;
//         redisClient.HSET('bid',keyName,JSON.stringify(result));
//         console.log("SET Cache")
//     }
    res.status(200).json(responseArray) 
   
})


 
app.listen(port,()=>{
    console.log(`App is listening at http://localhost:${port}`)
})