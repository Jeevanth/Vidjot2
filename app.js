const express = require('express');
const path=require('path');
const exphbs = require('express-handlebars');
const bodyparser=require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
//Load Routes
const ideas= require('./routes/ideas');
const users= require('./routes/users');
//db config
const db= require('./config/database')
//Passport config
require('./config/passport')(passport);


//Map Global Promise-get rid of warning
mongoose.Promise=global.Promise;


//Connect to mongoose
mongoose.connect(db.mongoURI)
.then(function(){
    console.log('Mongo DB Connected.......'); 
})
.catch(err =>console.log(err));





//handle-bar middlewares
app.engine('handlebars',exphbs({
    defaultLayout:'main'
}));

//BodyParser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//Method Override Middleware
app.use(methodOverride('_method'));
//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    
  }));
  //passport middleware
app.use(passport.initialize());
app.use(passport.session());

  app.use(flash());

//global varibles
app.use(function (req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user=req.user||null;
    next();


});
app.set('view engine','handlebars');

app.get('/',(req,res)=>{
   
    const title = 'Welcome';

    res.render('index',{
        title:title
    });
});

app.get('/about',(req,res)=>{
    res.render("about");
});


//use routes
app.use('/ideas',ideas);
app.use('/users',users);



const port = process.env.port||5000;
app.listen(port,()=>{
    console.log("Server Started on port "+port); 
    
});