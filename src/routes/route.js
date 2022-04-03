const express = require('express');
const router = express.Router();

const userController= require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const auth=require("../middleware/auth")



router.post('/register', userController.createUser)

router.post('/login', userController.loginUser)


//////////************----------------*************---------------------*********/////////

router.post('/creation',auth.Authorise,bookController.createBook)

router.get('/books',auth.Authorise,bookController.getBook)

router.get('/books/:bookId',auth.Authorise,bookController.getBookWithReview)

router.put('/books/:bookId',auth.Authorise, auth.Authorise, bookController.updateBooks)

router.delete('/books/:bookId',auth.Authorise, bookController.deleteBook)




//////////************----------------*************---------------------*********/////////

router.post('/books/:bookId/review', reviewController.bookReview)

router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)




module.exports = router;