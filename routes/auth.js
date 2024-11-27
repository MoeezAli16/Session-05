import express from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";



const routes= express();


routes.post('/register',async (req,res)=>{
  const {name, email, password}=req.body;
    try {
    const userExist= await User.findOne({email});
    if(userExist){
        return res.status(401).json({message:"User already Exist"})
    }
   
    const salt= await bcrypt.genSalt(10);
    const passwordhashed= await bcrypt.hash(password,salt);

    const user= new User({name,email,password: passwordhashed });
    await user.save();

    console.log(user)

     res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        console.log("register Failed", error);
    }

});

routes.post("/login", async (req,res)=>{

  const { email, password}=req.body;

    try {
        const user= await User.findOne({email});
        if (!user)
        {
           return res.status(405).json({message:"Invalid Credientials"})
        }

        const Ismatched= await bcrypt.compare(password,user.password);
        if (!Ismatched)
        {
            return res.status(408).json({message:"Invalid Credientials"})
        }
        res.status(201).json({ message: 'User login Successfully' });
    } catch (error) {
        console.log("Error",error);
    }
});
export default routes;