import cloudinary from "../lib/cloudinary.js";
import {generateToken} from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res)=>{
    try{
        const {fullName,email,password} = req.body;
        if (!fullName || !password || !email){
            return res.status(400).json({
                message: "Fill out the required details"
            });
        }
        if(password.length<6){
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }
        const user = await User.findOne({email})
        if (user) return res.status(400).json({message: "user already exist"});
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        });
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save();
            return res.status(201).json({
                message:"New user created",
                userId: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }
    }
    catch(error){
        console.log("Error in signup controller", error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials!!!"
            })
        }
        const ispasswordCorrect = await bcrypt.compare(password,user.password);
        if(!ispasswordCorrect){
            return res.status(400).json({
                message: "Invalid Credentials!!!"
            })
        }
        generateToken(user._id,res);
        res.status(200).json({
            userId: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });

    }catch(error){
        console.log("Error in login route",error.message);
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{
            maxAge:0
        });
        return res.status(200).json({
            message: "Logged out Successfully"
        });
    }catch(error){
        console.log("Logout Issue: ",error.message);
        res.status(500).json({
            message: "Internal server Error"
        })
    }
} 

export const updateProfile = async (req,res)=>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;
        if(!profilePic){
            res.status(400).json({
                message: "profile pic required"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(userId,{
            profilePic: uploadResponse.secure_url
        },{new:true})
        res.status(200).json(updateUser);
    }catch(error){
        console.log("error in update profile:",error);
        res.status(500).json({
            message:"Internal Error!!!"
        })
    }
}

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user)
    }catch(error){
        console.log("Error in checkAuth",error.message);
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}