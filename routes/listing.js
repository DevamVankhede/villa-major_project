const express=require("express");
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync');
const{ListingSchema}=require("../schema.js");
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');


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

router.get('/new', (req, res) => {
    res.render('listings/new');
});
router.get('/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("review");
    res.render('listings/show', { listing });
}));

//create route
router.post('/', validateListing, wrapAsync(async (req, res) => {
    const list = new Listing(req.body.listing);  
    await list.save();
    res.redirect('/listings');
  }));


  router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError('Listing not found', 404);
    res.render('listings/edit', { listing });
}));

router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true }); 
    res.redirect(`/listings/${id}`);
  }));
  

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
   let deletelisting= await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

module.exports=router;