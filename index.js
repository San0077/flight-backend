
import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { MongoClient } from 'mongodb';
import mongoose  from 'mongoose';
import nodemailer from 'nodemailer'
const app = express()
app.use(express.json());
dotenv.config()
app.use(cors())


var mongoUrl =process.env.mongoUrl
async function createConnection(){
    var client = await mongoose.connect(mongoUrl);
    console.log("connection is ready ")
 return client
}
export var client = await createConnection()

//-----------------SCHEMA USER LOGIN AND SIGNIN--------------
var UserDetails = new mongoose.Schema({
    email :String,
    password:String,
   
})

let flightUser = mongoose.model("flightsUser",UserDetails)

//-------------------SCHEMA FIGHTS SEARCH -------------------
var flightSchmea = new mongoose.Schema({
    f_name:String,
    from_to:{
       
        from:String,
        to:String,
    },
    avaiableSeats:Number,
    Food:{
      
        biriyani:String,
        coolDrinks:String,
    },
    date:Date,
    timing:{
       Takeoff:String,
       landing:String
    },
    price:Number,
    ThMonthPrice:Number,
    siMonthPrice:Number,

})
let flightDetails = mongoose.model("flightSearch",flightSchmea)
app.post("/booking",async function(req,res){
    let {to,from,date}=req.body
    console.log(from)
      const result = await  flightDetails.find({from_to:{"from":from,"to":to}}).where("date").gt(date)
      res.send(result)
})
//---------------------book tickets-------------------------------
let UserLongin ;
app.put("/booking",async function(req,res){
   const {_id,from_to,timing}=req.body
      console.log(from_to)
      const result = await  flightDetails.findById(_id).where("avaiableSeats")
       result.avaiableSeats=result.avaiableSeats-1;
       result.save()
       res.send(result)

       async function nodemail(){
        var transfer = nodemailer.createTransport({
            service:"hotmail",
            auth:{
               user:"santhoshbalaji304@gmail.com",
               pass:"santhosh1234"
            }
         
         })
           const options={
            from:"santhoshbalaji304@gmail.com",
            to:UserLongin,
            subject:"Booked in indico",
            text:`your ticket were book from ${from_to.from}  to ${from_to.to} please be arrive at ${timing.Takeoff} `
           }
         
           transfer.sendMail(options,(err)=>{
            if(err){
               console.log(err)
            }else{
               console.log({msg:"mail send"})
            }
           })
           transfer.verify()
        }
        nodemail()
})
//------------------------GEN PASSWORD-------------------------
async function passwordCreate (pass){
    const salt = await bcrypt.genSalt(4)
    const hash = await bcrypt.hash(pass,salt)
    return hash;
}
 
  //-------------------------SIGN IN ------------------------

 app.post("/signin",async function(req,res){
   let {email,password}=req.body;
   let hash = await passwordCreate(password)
   let result = await flightUser.create({
    email:email,
    password:hash,
 })
   res.send(result) 
 })
 //----------------------lOGIN IN--------------------------

 app.post("/",async function(req,res){
    let {email,password}=req.body;
 
    let result =await flightUser
    .findOne({email});
    if(!result){
        res.status(401).send({msg:"invalid"})
    }else{
        var storedPassword = result.password
        var compare = await bcrypt.compare(password,storedPassword)
        if(!compare){
            res.status(401).send({msg:"invalid"})
        }else{
            const token = await jwt.sign({id:"result._id"},"santhosh");
            res.send({msg:"login sucessfully",token:token})
              UserLongin = result.email
        }
    }
  })
 

//-------------------------------------RUN SERVER--------------------------
app.listen(process.env.PORT,()=>{
    console.log("server is ready")
});