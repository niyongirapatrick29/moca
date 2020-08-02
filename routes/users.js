var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/admin', (req, res, next) => {
    res.render('admin/index');
});

module.exports = router;