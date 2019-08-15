const express= require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//const passport = require('passport');

const router = express.Router();

//Load User Model
require('../models/user');
const User = mongoose.model('users');

//User Login Route
router.get('/login',(req,res)=>{
    res.render('users/login');
});
//User Register Route
router.get('/register',(req,res)=>{
    res.render('users/register');
});
//Login from POST
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});


//register form POST
router.post('/register',(req,res)=>{
   let errors = []
   if(req.body.password!=req.body.password2){
       
       errors.push({text:'Passwords do not match'})
            

   }
   
   if(errors.length>0)
   {
    req.flash('error_msg','Password not matching');
       res.render('users/register',{
           errors:errors,
           name:req.body.name,
           email:req.body.email,
           password:req.body.password,
           password2:req.body.password2
       });

   }else{
       const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
       })
       bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password=hash;
                newUser.save()
                    .then(user =>{
                        req.flash('success_msg','Your registration is successful');
                        res.redirect('./login');
                    })
                    .catch(err=>{
                        console.log(err);
                        return ;
                        
                    })

            });
       });
       
       
   }

});

// logout user
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','You have succcessfully logged out');
    res.redirect('/users/login');
})

module.exports=router;