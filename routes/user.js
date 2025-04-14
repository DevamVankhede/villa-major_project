const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newuser = new User({ email, username });
      const registeruser = await User.register(newuser, password);
      console.log(registeruser);
      req.login(registeruser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "register successfully");
        res.redirect("/listings");
      })
 
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
   
    req.flash("success","welcome back to D'Raj villas site ! you are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
  }
);

router.get("/logout",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
  })
})

module.exports = router;
