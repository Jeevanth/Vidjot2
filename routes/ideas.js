const express= require('express');
const mongoose = require('mongoose');
const router = express.Router();
// Load Idea Model
require('../models/idea');
const Idea = mongoose.model('ideas');
const {ensureAuthenticated} = require('../helpers/auth');

// Idea Index Page
router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    });
   
});

//add idea form
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render("ideas/add");
});

//Edit Form
router.get('/edit/:id',(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        if(idea.user!=req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas');
        }else{
        res.render("ideas/edit",{
            idea:idea
        });
    }
        
    });
   
});

//Process form
router.post('/',(req,res)=>{
   const newUser={
       title:req.body.title,
       details:req.body.details,
       user:req.user.id

   }
    new Idea(newUser)
    .save()
    .then(idea =>{
        req.flash('success_msg','Video Idea Added');
        res.redirect('/ideas');
    })
});

//Edit form Process
router.put('/:id',(req,res)=>{
   Idea.findOne({
       _id: req.params.id
   })
   .then(idea=>{
       //new Values
       idea.title=req.body.title;
       idea.details = req.body.details;
       

       idea.save()
        .then(idea =>{
            req.flash('success_msg','Video Idea Edited Successfully');
            res.redirect('/ideas');
        })
   });
});

//delete idea
router.delete('/:id',(req,res)=>{
    Idea.deleteOne({_id : req.params.id})
    .then(()=>{
        req.flash('error_msg','Video Idea Removed');
        res.redirect('/ideas');
    });

});






module.exports=router;