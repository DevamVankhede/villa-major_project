const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash=require("connect-flash");
const session=require("express-session");
const listingsRouter=require("./routes/listing.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const reviewsRouter=require("./routes/review.js");
const port = 3000;
const userRouter=require("./routes/user.js")
// Setup view engine and paths
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}
app.use(session(sessionOptions));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const review=require("./routes/review.js");
// DB Connection
async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}
main()
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.render('listings/home');
});


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})


  




app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);



app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;

    res.status(statusCode);  
    res.render('error.ejs', { err });  
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});