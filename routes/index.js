var express = require('express');
const path = require('path');
//use models (table) for storing data
const Contact_us = require('../models/Contact_us');
const Order = require('../models/Order');
const Gallery = require('../models/gallery'); //Cakes images
const Cakes = require('../models/ibigaragara');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var perPage = 9;
    var page = req.query.page || 1
    Cakes.find({ news_status: "1" })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result_cakes) {
            Cakes.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('home/index', {
                    data_cakes: result_cakes,
                    pageTitle: 'Moca',
                    path: '/',
                    //errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        })
        //res.render('home/index', { path: '/' });
});

//================================= CAKES ====================================
/* GET CAKE PAGE   */
router.get('/cake', function(req, res, next) {
    var perPage = 9;
    var page = req.query.page || 1
    Cakes.find({ news_status: "1" })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result_cakes) {
            Cakes.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('home/cake', {
                    data_cakes: result_cakes,
                    pageTitle: 'Moca',
                    path: '/cake',
                    //errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        })
        //res.render('home/cake', { path: '/cake' });
});

//======================= CAKE DETAILS ============================
/* GET faq PAGE   */
router.get('/product-details/:CAKEID', function(req, res, next) {
    Cakes.findById({ _id: req.params.CAKEID })
        .then(cake => {
            res.render('home/product-details', {
                pageTitle: 'MOCA',
                path: '/product-details',
                cake_details: cake,
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => console.log(err))

    //res.render('home/product-details', { path: '/product-details' });
});



/* GET ABOUT PAGE   */
router.get('/about-moca', function(req, res, next) {
    res.render('home/about-us', { path: '/about-moca' });
});

/* GET testimonial PAGE   */
router.get('/testimonials', function(req, res, next) {
    res.render('home/testimonials', { path: '/testimonials' });
});

/* GET WHAT WE MAKE PAGE   */
router.get('/what-we-make', function(req, res, next) {
    res.render('home/what-we-make', { path: '/what-we-make' });
});


/*======================= GALLERY PAGES======================   */
/* GET Gallery PAGE 1  */
router.get('/portfolio-full-width', function(req, res, next) {

    res.render('home/portfolio-full-width', { path: '/portfolio-full-width' });
});

/* GET Gallery PAGE 2  */
router.get('/portfolio', function(req, res, next) {
    var perPage = 9;
    var page = req.query.page || 1
    Gallery.find({ gallery_status: "1" }).sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result_gallery) {
            Gallery.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('home/portfolio', {
                    data_gallery: result_gallery,
                    pageTitle: 'Moca',
                    path: '/portfolio',
                    //errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        })

    // res.render('home/portfolio', {
    //         path: '/portfolio',
    //         //images: images
    //     }

    // );
});

/* GET faq PAGE   */
router.get('/faq', function(req, res, next) {
    res.render('home/faq', { path: '/faq' });
});

/*   SHOP PAGES  */
/* GET faq PAGE   */
router.get('/shop', function(req, res, next) {
    var perPage = 9;
    var page = req.query.page || 1
    Cakes.find({ news_status: "1" })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, result_cakes) {
            Cakes.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('home/shop', {
                    data_cakes: result_cakes,
                    pageTitle: 'Moca',
                    path: '/shop',
                    //errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        })

    //res.render('home/shop', { path: '/shop' });
});

/* GET faq PAGE   */
router.get('/checkout', function(req, res, next) {
    res.render('home/checkout', { path: '/checkout' });
});

/* GET faq PAGE   */
router.get('/contact', function(req, res, next) {
    let message = req.flash('success');
    let error_message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
        error_message = null;
    } else if (error_message.length > 0) {
        message = null;
        error_message = error_message[0];
    } else {
        message = null;
        error_message = null;
    }
    res.render('home/contact', {
        path: '/contact',
        successMessage: message,
        errorMessage: error_message,
        csrfToken: req.csrfToken()
    });
});

/* GET chat application page  */
router.get('/chat', function(req, res, next) {
    res.render('home/chat', { path: '/chat' });
});

/* CONTACT US FORM POST */

router.post('/contact', (req, res, next) => {


    Contact_us.create({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        })
        .then((message) => {
            req.flash('success', 'Message is sent!! ');
            req.flash('error', 'Message is not sent!! ');
            res.redirect('/contact');
            console.log('Message sent ');
        }, (err) => next(err))
        .catch((err) => next(err));

})


/* CREATE USER  & Orders    */

router.post('/checkout', (req, res, next) => {

    Order.create({
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone,
            email: req.body.email,
            country: req.body.country,
            province: req.body.province,
            district: req.body.district,
            sector: req.body.sector,
            cell: req.body.cell,
            village: req.body.village,
            street: req.body.street,
            city: req.body.city,
            order_note: req.body.message
        })
        .then((order) => {
            req.flash('error', 'Order is sent!! ');
            res.redirect('/checkout');
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = router;