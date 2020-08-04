var express = require('express');
const path = require('path');
//use models (table) for storing data
const Contact_us = require('../models/Contact_us');
const Order = require('../models/Order');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home/index', { active_class: 'active' });
});

/* GET CAKE PAGE   */
router.get('/cake', function(req, res, next) {
    res.render('home/cake', { active_class: 'active' });
});

/* GET ABOUT PAGE   */
router.get('/about-moca', function(req, res, next) {
    res.render('home/about-us', { active_class: 'active' });
});

/* GET testimonial PAGE   */
router.get('/testimonials', function(req, res, next) {
    res.render('home/testimonials', { active_class: 'active' });
});

/* GET WHAT WE MAKE PAGE   */
router.get('/what-we-make', function(req, res, next) {
    res.render('home/what-we-make', { active_class: 'active' });
});


/*======================= GALLERY PAGES======================   */
/* GET Gallery PAGE 1  */
router.get('/portfolio-full-width', function(req, res, next) {
    res.render('home/portfolio-full-width', { active_class: 'active' });
});

/* GET Gallery PAGE 2  */
router.get('/portfolio', function(req, res, next) {
    res.render('home/portfolio', { active_class: 'active' });
});

/* GET faq PAGE   */
router.get('/faq', function(req, res, next) {
    res.render('home/faq', { active_class: 'active' });
});

/*   SHOP PAGES  */
/* GET faq PAGE   */
router.get('/shop', function(req, res, next) {
    res.render('home/shop', { active_class: 'active' });
});
/* GET faq PAGE   */
router.get('/product-details', function(req, res, next) {
    res.render('home/product-details', { active_class: 'active' });
});
/* GET faq PAGE   */
router.get('/checkout', function(req, res, next) {
    res.render('home/checkout', { active_class: 'active' });
});

/* GET faq PAGE   */
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { active_class: 'active' });
});

/* GET chat application page  */
router.get('/chat', function(req, res, next) {
    res.render('home/chat', { active_class: 'active' });
});

/* CONTACT US FORM POST */

router.post('/contact', (req, res, next) => {
    console.log("Works");
    Contact_us.create({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        })
        .then((message) => {
            req.flash('error', 'Message is sent!! ');
            //res.redirect('/contact');
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