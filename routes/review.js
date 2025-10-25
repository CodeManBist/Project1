const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError')
const Review = require('../Models/review');
const Listing = require('../Models/listing');
const { validateReview, isLoggedIn, isReviewAuther } = require('../middleware');

const reviewController = require('../controllers/reviews');

//POST Review Rout
router.post(
    '/', 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuther,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;