import User from "../models/User";

const getAllUsers = async(req,res,next) => {
     let users;

     try{
          users = await User.find({});
     }catch(err){
          console.log(err);
     }
     if(!users){
          return res.status(404).json({message:"No users found"})
     }
}