const express = require('express');
const app = express();
const port = 3002;
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json()) 


const api_logger   = require(`./logger`);

app.use(api_logger.res_logger);

// ################ JOI ########### 
var Joi = require('joi')


const validationMiddleware = (req,res,next)=>{  
    const schema = Joi.object().keys({
        name:Joi.string().required(),
        password:Joi.string().required(),
        search: Joi.string().optional(),
        category: Joi.string().optional().valid("car","bike","truck"),
        amount:Joi.number().integer().min(1).max(20),
        age:Joi.number().when('name',{is:'test',then: Joi.required(),otherwise:Joi.optional() }),
        item:Joi.object().keys({
            id:Joi.number().required(),
            name:Joi.string().optional()
        }).unknown(true),
        items:Joi.array().items(Joi.object().keys({
            id:Joi.number().required(),
            name:Joi.string().optional()
        })),
       confirm_password:Joi.string().valid(Joi.ref('password')).required(),
       limit:Joi.number().required(),
       numbers:Joi.array().min(Joi.ref('limit')).required(),
       email:Joi.string().email({
           minDomainSegments:2,
           tlds:{allow:["com","in"]}
       }),
       fullname:Joi.string(),
       lastname:Joi.string(),
       custom_name:Joi.string().custom((value,msj)=>{
           if(value=='test'){
               return msj.message("Not allow test name")
           }
           return true
       })


    }).xor("fullname","lastname"). unknown(false)

    const {error} = schema.validate(req.body,{  abortEarly:false});
    if(error){
        const {details} = error
        res.status(200).json({error:details})
    }else{
        next();
    } 
} 
 
router.post("/add-user",validationMiddleware, async (req, res) => {
    let result = {
        id: 12,
        name: 'Test Demo'
    }  
    
    res.status(200).json(req.body) 
})


app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})