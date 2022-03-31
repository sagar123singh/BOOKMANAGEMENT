const bookModel = require("../Models/booksModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const mongoose = require("mongoose");
const validator = require("../Validator/validation");



// ****************************************************** Post review /books/:bookId ****************************************************** //

const bookReview = async function (req, res) {
  try {
    const params = req.params.bookId
        body = req.body
        const { reviewedBy, reviewedAt, rating, review } = body;

        if (!validator.isValidobjectId(params)) {
            return res.status(400).send({ status: false, message: "Invalid bookId." })
        }

        // Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, message: 'Provide review body.' })
        }

        // Validate reviewedBy
        if (!validator.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "Reviewer's name is required" })
        }

        // Validate reviewedAt
        if(!validator.isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: "reviewedAt is required" })
        }

        // Validation of reviewedAt
        if(!validator.isValidDate(reviewedAt)) {
            return res.status(400).send({ status: false, message: "Validation of reviewedAt is required"})
        }
        
        // Validate rating
        if (!validator.isValid(rating)) {
            return res.status(400).send({ status: false, message: "Rating is required" })
        }
        
        //Validate rating between 1-5.
        if (!(rating > 0 && rating < 6)) {
            return res.status(400).send({ status: false, message: "Rating must be between 1 to 5." })
        }

        // Validate review
        if(!validator.isValid(review)) {
            return res.status(400).send({ status: false, message: "Review is required"})
        }


        let searchBook = await bookModel.findOneAndUpdate({_id: params}, {$inc: {reviews: 1}}, {new: true})
        if (!searchBook) {
            return res.status(404).send({ status: false, message: `Book does not exist by this ${params}.` })
        }

        //verifying the book is deleted or not
        if (searchBook.isDeleted === true) {
            return res.status(400).send({ status: false, message: "Book has been already deleted." })
        }
        body.bookId = searchBook._id;
        body["reviewedAt"] = new Date()

        let saveReview = await reviewModel.create(body)
        
        let response = await reviewModel.findOne({ _id: saveReview._id }).select({__v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 })
        return res.status(201).send({ status: true, data: response })
    } 
  catch (err) {
    console.log("This is the error :", err.message);
    return res.status(500).send({ msg: "Error", error: err.message });
  }
}







//************************************************** PUT /books/:bookId/review/:reviewId *************************************************** //

const updateReview = async function(req, res){
    try{
        let body = req.body
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        // Validate body
        if (!validator.isValidBody(body)) {
            return res.status(400).send({ status: false, message: 'Provide review body.' })
        }

        //Validate book id
         if(!(validator.isValid(bookId) && validator.isValidobjectId(bookId))) {
            return res.status(400).send({status: false, msg: "BookId not valid"})
        } 
    
        //Validate review id
        if(!(validator.isValid(reviewId) && validator.isValidobjectId(reviewId))) {
            return res.status(400).send({status: false, msg: "reviewId not valid"})
        }      
    
        // Query must not be present
        const query = req.query;
        if(validator.isValidBody(query)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }

        let update = {}

        let book = await bookModel.findOne({_id:bookId, isDeleted: false})
        if(!book) {
            return res.status(404).send({status: false, msg: "Book doesnot exist"})
        }

        let reviewData = await reviewModel.findOne({_id: reviewId, isDeleted: false})
        if(!reviewData) {
            return res.status(404).send({ status: false,msg: "review doesnot exist"})
        } 
        

        let { reviewedBy, reviewedAt, rating, review } = req.body
        if(reviewedBy) {
            if(!validator.isValid(reviewedBy)) {
                return res.status(400).send({status: false, msg: "ReviewedBy is not valid"})
            }
            update["reviewedBy"] = reviewedBy
        }

        if(rating) {
            if(!validator.isValid(rating)) {
                return res.status(400).send({status: false, msg: "rating is not valid"})
            }
            else if(!(rating > 0 && rating < 6)) {
                return res.status(400).send({ status: false, message: "Rating must be between 1 to 5." })
            }
            update["rating"] = rating
        }

        
        if(review) {
            if(!validator.isValid(review)) {
                return res.status(400).send({status: false, msg: "review is not valid"})
            }
            update["review"] = review
        }


        let updatedReview = await reviewModel.findOneAndUpdate({_id:reviewId, isDeleted: false}, update, {new: true}) 

        return res.status(200).send({status: true, data: updatedReview})
    
    }
    catch (err) {
        console.log("This is the error :", err.message);
        return res.status(500).send({ msg: "Error", error: err.message });
    }
}


    

    

//*********************************************** Delete /books/:bookId/review/:reviewId *********************************************** //
    
const deleteReview = async function(req, res){
    try{
        let body = req.body
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        // Validate body
        if (validator.isValidBody(body)) {
            return res.status(400).send({ status: false, message: 'Body must not be present' })
        }

        //Validate book id
        if(!(validator.isValid(bookId) && validator.isValidobjectId(bookId))) {
            return res.status(400).send({status: false, msg: "BookId not valid"})
        }
        
        //Validate review id
        if(!(validator.isValid(reviewId) && validator.isValidobjectId(reviewId))) {
            return res.status(400).send({status: false, msg: "review not valid"})
        }
              
        
        // Query must not be present
        const query = req.query;
        if(validator.isValidBody(query)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters"});
        }
        
        let book = await bookModel.findOne({_id: bookId, isDeleted: false})
        if(!book) {
            return res.status(404).send({status: false, msg: "Book doesnot exist"})
        }

        let deletedReview = await reviewModel.findOneAndUpdate({_id: reviewId, isDeleted: false}, {isDeleted: true})
        if(deletedReview) {
            let reviewCount = await reviewModel.find({bookId: bookId, isDeleted: false}).count()
            let deletedData = await bookModel.findOneAndUpdate({ _id: bookId}, {$inc: {reviews: -1}})
            return res.status(200).send({status: true, msg: "Review is deleted successfully"})
        }
        else {
            return res.status(400).send({status: false, msg: "Review not exist"})
        }
    }
    catch (err) {
        console.log("This is the error :", err.message);
        return res.status(500).send({ msg: "Error", error: err.message });
    }
}


module.exports.bookReview = bookReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;