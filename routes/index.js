var express = require('express');
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
module.exports = router;