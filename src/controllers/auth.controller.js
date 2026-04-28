import mongoose from "mongoose";
import { userModel } from "../models/users.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { configDotenv } from "dotenv";

configDotenv()
async function registerUser(req,res){
    const {username, email, password}= req.body

    const userAlreadyExists= await userModel.findOne({
        $or:[{username},
            {email}
        ]
    })

    if(userAlreadyExists){
        return res.status(409).json({
            message:"User Already Exists"
        })
    }
    const hash= await bcrypt.hash(password,10)
    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token= jwt.sign({
        id:user._id,
        email:user.email
    }, process.env.JWT_SECRET)

    res.cookie("token",token,{
        httponly:true,
        sameSite:"lax"
    })

    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function loginUser(req,res){
    const {username,email, password} = req.body
    
    
    const user = await userModel.findOne({
        $or:[{username},
            {email}
        ]
    })
    if(!user){
        console.log('No user found for credentials')
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
   
    if(!isPasswordValid){
        console.log('Password mismatch')
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id:user._id,
        email:user.email
    },process.env.JWT_SECRET)

    res.cookie("token",token,{
        httponly:true,
        sameSite:"lax"
    })

    res.status(201).json({
        message:"User Loggedin Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}

async function logoutUser(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message:"LoggedOut Successfully"
    })
}

export  {registerUser,loginUser,logoutUser}