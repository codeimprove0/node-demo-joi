const express = require('express');
const app = express();
const port = 3002;  
   
 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// var multer  = require('multer')
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public')
//     },
//     filename: function (req, file, cb) { 
//       cb(null,  Date.now()+'_'+file.originalname)
//     }
//   })
//   var upload = multer({ storage: storage }) ; 

// app.post("/home",upload.single('profile'),async (req,res)=>{  
//     console.log(req.file)
//     let result = {
//         id:12,
//         name:'Test Demo'
//     } 
//     res.status(200).json(result) 
   
// })


 const fileUpload = require('express-fileupload');

 app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'public/'
}));

const path = require('path');
app.post("/home",async (req,res)=>{  
    console.log(req.files)
    let filename = Date.now() + "_" + req.files.profile.name;  
    let zipFilePath = path.join(process.cwd(), 'vi', filename) 
    req.files.profile.mv(zipFilePath)

 
    let result = {
        id:12,
        name:'Test Demo'
    } 
    res.status(200).json(result) 
   
})
 



 
app.listen(port,()=>{
    console.log(`App is listening at http://localhost:${port}`)
})