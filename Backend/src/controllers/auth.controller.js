const userModel =require('../models/user.model')
const FoodPartnerModel=require("../models/foodpartner.model")
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')


const registerUser=async(req,res)=>{

const {fullName,email,password}=req.body

if(!fullName || !email || !password){

    return res.status(400).json({
        message:"something is missing",
        success:false,
    })
}


const isUserAlreadyExist=await userModel.findOne({
    email
})

if(isUserAlreadyExist){
    return res.status(400).json({
        message:"user already exists",
        succes:false,
    })
}

const hashedPasswoed=await bcrypt.hash(password,10)

const user=await userModel.create({
    fullName,
    email,
    password:hashedPasswoed
})
const token=jwt.sign({
    id:user._id,
    
},process.env.JWT_SECRET)

res.cookie("token",token)

res.status(201).json({
    message:"user Registered Successfully",
    user:{
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
    }
})

}


const loginUser=async(req,res)=>{
    const {email,password}=req.body;

    const user=await userModel.findOne({
        email
    })


    if(!user){
        return res.status(400).json({
            message:"Invalid email or password",
            success:false,
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
             return res.status(400).json({
            message:"Invalid email or password",
            success:false,
        })
    }
    const token=jwt.sign({
        id:user._id,

    },process.env.JWT_SECRET)
    res.cookie("token",token)



  return  res.status(200).json({
    message:"Logged In Successfully",
    success:true,
     user:{
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
    }
  })
}

const logoutUser=async(req,res)=>{
    res.clearCookie("token");
    return res.status(200).json({
        message:"User Logged Out Successfully",
        success:true,
    })
}


const registerFoodPartner=async(req,res)=>{
    const {name,email,password}=req.body;

if(!name || !email || !password){

    return res.status(400).json({
        message:"something is missing",
        success:false,
    })
}
const isAccountAlreadyExists=await FoodPartnerModel.findOne({
    email
})

if(isAccountAlreadyExists){
    return res.status(400).json({
        message:"Food Partner account already exists",
        success:false
    })
}

const hashedPassword= await bcrypt.hash(password,10)
const foodPartner= await FoodPartnerModel.create({
    name,
    email,
    password:hashedPassword,
})
const token=jwt.sign({
id:foodPartner._id,
},process.env.JWT_SECRET)

res.cookie("token",token)
return res.status(200).json({
    message:"Food Partner Registered successfully",
    success:true,
    foodPartner:{
        _id:foodPartner._id,
        email:foodPartner.email,
        name:foodPartner.name
    }
})

}


const loginFoodPartner=async(req,res)=>{
    const {email,password}=req.body;

if( !email || !password){

    return res.status(400).json({
        message:"something is missing",
        success:false,
    })
}


const foodPartner=await FoodPartnerModel.findOne({
    email
})

if(!foodPartner){
    return res.status(400).json({
        message:"Invalid email or password",
        success:false
    })
}

const isPasswordValid=await bcrypt.compare(password,foodPartner.password)

if(!isPasswordValid){
      return res.status(400).json({
        message:"Invalid email or password",
        success:false
    })
}
const token=jwt.sign({
    _id:foodPartner._id,
},process.env.JWT_SECRET)

res.cookie("token",token)


return res.status(200).json({
    message:"Food Partner Logged in Successfully",
    success:true,
   foodPartner:{
        _id:foodPartner._id,
        email:foodPartner.email,
        name:foodPartner.name
    }
})

}


 const logoutFoodPartner=async(req,res)=>{
    res.clearCookie("token");
    return res.status(200).json({
        message:"Food Partner Logged Out Successfully",
        success:true,
    })
}






module.exports={
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner



}