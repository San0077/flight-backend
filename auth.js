import jwt from 'jsonwebtoken'
export const auth =(req,res,next)=>{
              try{
                
                const token = req.header("x-auth-token");
                if(!token){
                   return res.status(401).send({msg:err.message})
                }else{
                jwt.verify(token,process.env.key)
                next()
                }

              }catch(err){
                res.status(401).send({msg:err.message})
              }
            }


            //     f_name:"INDICO v4",
    //     from_to:{
    //         from:"chennai",
    //         to:"mumbai"
    //     },
    //     avaiableSeats:100,
    //     Food:{
    //         biriyani:"biriyani",
    //         coolDrinks:"cola"
    //     },
    //     date:"2022-10-04",
    //     timing:{
    //         Takeoff:"1.00 PM",
    //         landing:"2.30 PM"
    //     },
    // price:20000,
    
    //   })