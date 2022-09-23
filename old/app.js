const express = require('express');
const app = express();
const port = 3002;
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

 


// ################ JOI ###########

const Joi = require('joi');

const validationMiddleware = (req,res,next)=>{

 
    const loginSchema =   Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.number().required(),
        search: Joi.string().optional(),
        category: Joi.string().optional().valid('car','bike','scooter'), 
        amount:Joi.number().integer().min(1).max(20),
        age: Joi.number().when('name', {is: 'test', then: Joi.required(), otherwise: Joi.optional()}) ,
        item: Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required(), 
        }).optional().unknown(true), 
        items: Joi.array().items(Joi.object().keys({
            id: Joi.number().required(),
            name: Joi.string().required(), 
        })).optional(),
        subjects: Joi.array().items(Joi.boolean(), Joi.any().strip()),
        confirm_password: Joi.number().valid(Joi.ref('password')).required(),
 
        limit: Joi.number().integer().required(),
        numbers: Joi.array().min(Joi.ref('limit')).required(),
        email: Joi.string().email({
            minDomainSegments:2,
            tlds:{ allow: ["com","in"]}
        }),
        fullname:Joi.string(),
        adharcard:Joi.string(),

        custom_name:Joi.string().custom((value,msj)=>{
            if(value=='test'){
                return msj.message("Not allow test name")
            }
            return true
        })

    }).xor("fullname","adharcard") .unknown(true);

    // unknown(false);  not allow 
  
 
   // const { error } = loginSchema.validate(req.body, { abortEarly: false });
    const { error } = loginSchema.validate(req.body,{abortEarly:false} );

    if(error){
        const { details } = error;
        let  message = details.map(v=>v.message); 
        //console.log(message)
       // res.status(200).json(error) 
        res.status(200).json({error:message}) 
    }else{
        next();
    } 
  //  next();

}


app.get("/home",validationMiddleware, async (req, res) => {
    let result = {
        id: 12,
        name: 'Test Demo'
    } 
    res.status(200).json(result) 
})
 
app.post("/add-user",validationMiddleware, async (req, res) => {
    let result = {
        id: 12,
        name: 'Test Demo'
    } 
    console.log(req.body,'==')
    res.status(200).json(req.body) 
})


app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})