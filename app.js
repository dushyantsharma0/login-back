require("dotenv").config();
const express =require('express')
const nodemailer=require('nodemailer')
const app =express()
const cors=require('cors')
const connectionDb=require('./db/connection')
const loginModel=require('./models/login')
const otpGenerator = require('otp-generator') 
const ejs=require('ejs')
const path =require('path')
port =process.env.PORT ||5000


app.set('view engine','ejs')

// let pathnew=path.join(__dirname,'views',)

//     let data=ejs.renderFile(pathnew+'/views/index',{otp:newotp})



let newotp;
let firstname;
let email;
let password;
let lastname;
let tiger;
app.get('/',(req,resp)=>{
    resp.send("hi i am live")
})
app.get('/data', async(req,resp)=>{
    const {select}=req.query
//     const queryobject={}
 const apidata=loginModel.find()
    if(select){
        let selectFix=select.split(",").join(" ");
        apidata=apidata.select(selectFix)
        
    }
    let data= await loginModel.find()
    resp.send(data)
})

app.use(cors())
app.use(express.json())

   app.post('/', async(req,resp)=>{
  let emaill=req.body.email
   let data=await loginModel.findOne({email:emaill})
   if(data==null){
    let newotp=otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
    let firstname=req.body.firstname
    
    
        const option ={
            service:"gmail",
            port:"587",
            secure:false,
            auth:{
                user:"meammakerds@gmail.com",
                pass:"hmmdlqkubovnngdf"
            }
        }
        const transporter=await nodemailer.createTransport(option)
             
        const mailOption={
            to:emaill,
            from:"meammakerds@gmail.com",
            subject: `${newotp} is your OTP email verification on demo plateform`,
            html:`<!DOCTYPE html><html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Document</title></head> <body> <p>dear ${firstname} </p><br><p>Thank You for registering with demo plateform.com the no1 demo site for checking demo</p> <br><br><p>Enter the below mentioned one time password to complete your regitration</p> <h1 style="font-weight: 900;">OTP:${newotp}</h1></body> </html>`
        }
        transporter.sendMail(mailOption,(err,data)=>{
            if(err){
                console.log(err)
                
        
            }else{
                console.log(data)
                resp.json([{msg:"otp sent successfully!"},{otp:newotp}])
            }
        })
       
   }else{
    console.log(data)
    resp.json({msg:"failed"})
   }
   
       


   })











   

app.post('/save', async(req,resp)=>{
    email=req.body.email
    firstname=req.body.firstname
    password=req.body.password
    lastname=req.body.lastname
    tiger=req.body.tiger
    if(tiger){
            let data= new loginModel({firstname,lastname,email,password})
            let result =await data.save()
            console.log(result)
            resp.json({ msg:"registation successful "})
    
    }
 })

app.post('/login',async(req,resp)=>{
   const email=req.body.email
    const password=req.body.password
    const data= await loginModel.findOne({email})
    if(data!=null){


        if(data.password===password){
            console.log(data)
          resp.json({msg:"login successfull"})
        }else{
            console.log('wrong password')
            resp.json({msg:"wrong password"})
        }
    }else{
        console.log('email id wrong')
        resp.json({msg:"email id wrong"})
    }

   
      
   
    
    
})

app.put('/update',async(req,resp)=>{
   
   
       const oldpass=req.body.oldpass
        const newpass=req.body.newpass
        const email=req.body.eml
       const data=await loginModel.findOne({email})
       if(data.password===oldpass){
       
 let change=await loginModel.updateOne(
        {email:email},
        {
            $set:{password:newpass}
        }
    )
         resp.json({msg:"successfull change"})
       }else{
        resp.json({msg:"old pass wrong"})
       }
    // console.log(oldpass,newpass,email)
    // console.log(req.body.address)
    // resp.send(req.body)
})

const start=async()=>{
     await connectionDb(process.env.MONGODB_URl)
    
    app.listen(port,()=>{
        console.log(`app is started on port no ${port}`)
    })
}
start()