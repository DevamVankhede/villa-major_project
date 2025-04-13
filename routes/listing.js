const express=require("express");
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync');
const{ListingSchema}=require("../schema.js");
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const {isLoggedIn}=require("../middleware.js");

const validateListing = (req, res, next) => {
    const { error } = ListingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(',');
      throw new ExpressError(400, errMsg);
    }
    next();
  };
  
//index route
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
}));

router.get('/new', isLoggedIn,(req, res) => {
    res.render('listings/new');
});
router.get('/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("review");
  
  if (!listing) {
      req.flash("error", "Listing requested does not exist");
      return res.redirect("/listings"); 
  }

  res.render('listings/show', { listing });
}));

//create route
router.post('/', validateListing, wrapAsync(async (req, res) => {
    const list = new Listing(req.body.listing);  
    await list.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');
  }));


  router.get('/:id/edit', isLoggedIn,wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
      if (!listing) {
        req.flash("error", "Listing requested does not exist");
        return res.redirect("/listings"); 
    }
    
    res.render('listings/edit', { listing });
}));

router.put('/:id', isLoggedIn,validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true }); 
    res.redirect(`/listings/${id}`);
  }));
  

router.delete('/:id', isLoggedIn,wrapAsync(async (req, res) => {
    const { id } = req.params;
   let deletelisting= await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports=router;