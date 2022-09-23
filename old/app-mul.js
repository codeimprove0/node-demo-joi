const express = require('express');
const app = express();
const port = 3002;  
   
 const bodyParser = require('body-parser')
 app.use(bodyParser.urlencoded({extended:false}))
 app.use(bodyParser.json());


//  const multer  = require('multer')

//  const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

//   const upload = multer({ storage: storage })
 
const fileUpload = require('express-fileupload')

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'public/'
}))

const path = require("path");
 
app.post("/home",async (req,res)=>{    

    // let fileName = Date.now()+'-'+ req.files.profile.name;
    // let newPath = path.join(process.cwd(),'test',fileName)

    // req.files.profile.mv(newPath)
    // console.log(req.files)
    let result = {
        id:12,
        name:'Test Demo'
    } 
    res.status(200).json(result) 
   
})
 



 
app.listen(port,()=>{
    console.log(`App is listening at http://localhost:${port}`)
})