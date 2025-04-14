
const express=require("express");

const wrapAsync = require('../utils/wrapAsync');
const router = express.Router({ mergeParams: true });

const{ReviewSchema}=require("../schema.js");
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');



const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map(el => el.message).join(',');
      throw new ExpressError(400, errMsg);
    }
    next();
  };
  





  
  router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
  }));
  




router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.log(error.message);
    
  }
}));

module.exports=router;