const path = require('path');
const express = require('express');
const router = express.Router();
const backController = require('../controller/admin');
const Authenticated = require('../middleware/isAuth');

/*##################################################################################################
                                        login system
###################################################################################################*/

router.get('/', backController.getIndex);

router.post('/login_user', backController.postLogin);

router.get('/logout_user', Authenticated, backController.getLogout);

router.get('/home', Authenticated, backController.getHome);
/*##################################################################################################
                                        user system
###################################################################################################*/
router.get('/users', Authenticated, backController.getUsers);
router.get('/add_user', Authenticated, backController.getAddUser);
router.post('/add_user', backController.postNewUser);
router.get('/approve_user/:userID', Authenticated, backController.getApproveUser);
router.get('/delete_user/:userID', Authenticated, backController.getDeleteUser);

/*##################################################################################################
                                        ORDERS system
###################################################################################################*/
router.get('/orders', Authenticated, backController.getOrders);
router.get('/approve_orders/:orderID', Authenticated, backController.getApproveOrder);
router.get('/delete_orders/:orderID', Authenticated, backController.getDeleteOrder);


/*##################################################################################################
                                        cake system
###################################################################################################*/

router.get('/products', Authenticated, backController.getProduct);

router.get('/new_product', Authenticated, backController.getNewProduct);

router.post('/newCake', Authenticated, backController.postNewCake);

/*################################# MANAGE PRODUCT OR CAKE CATEGORY ###########################*/
//add Category
router.post('/newcategory', Authenticated, backController.postNewCategory);
//delete category
router.get('/deletecategory/:deleteID', Authenticated, backController.getDeleteCategory);


router.get('/products/:detailsID', Authenticated, backController.getProductDetails);

router.get('/delete_product/:deleteID', Authenticated, backController.getDeleteProduct);

router.get('/publish_Orunpublish/:publishID', Authenticated, backController.getPublish);

router.get('/edit_product/:editID', Authenticated, backController.getEdited);

router.post('/edit_product', Authenticated, backController.postEditedData);

/*##################################################################################################
                                        gallery or gallery system
###################################################################################################*/
router.get('/gallery', Authenticated, backController.getGallery);

router.get('/new_gallery', Authenticated, backController.getNewGallery);

router.post('/new_gallery', Authenticated, backController.postNewGallery);

router.get('/delete_gallery/:deleteID', Authenticated, backController.getDeleteGallery);

router.get('/publish_gallery/:publish_ID', Authenticated, backController.getGalleryPublish);

/*##################################################################################################
                                        anouncements system
###################################################################################################*/
router.get('/anouncement', Authenticated, backController.getAnouncement);

router.get('/new_anouncement', Authenticated, backController.getNewAnouncement);

router.post('/new_anouncement', Authenticated, backController.postNewAnouncement);

router.get('/anounce_edit/:anounce_edit', Authenticated, backController.getEditAnouncement);

router.post('/edit_anouncement', Authenticated, backController.postEditAnouncement);

router.get('/anounce_delete/:deleteID', Authenticated, backController.getDeleteAnouncement);

router.get('/anounce_publish/:publish_ID', Authenticated, backController.getPublishAnouncement);


/*##################################################################################################
                                        slider system
###################################################################################################*/
router.get('/slider', Authenticated, backController.getSlider);

router.get('/new_slide_image', Authenticated, backController.getNewSlider);

router.post('/new_slide_image', Authenticated, backController.postNewSliderImage);

router.get('/slide_delete/:deleteID', Authenticated, backController.getDeleteSlider);

router.get('/slide_edit/:edit_ID', Authenticated, backController.getEditSlider);

router.post('/edit_slider', Authenticated, backController.postEditSlider);

router.get('/slide_publish/:publish_ID', Authenticated, backController.getPublishSlider);

/*##################################################################################################
                                        sobanukirwa system
###################################################################################################*/
// router.get('/sobanukirwa', Authenticated, backController.getSobanukirwa);
// router.post('/sobanukirwa', Authenticated, backController.postSobanukirwa);
// router.get('/sobanukirwa/:comment_id', Authenticated, backController.deleteSobanukirwaComment);
// router.get('/sobanukirwad/:sobanukirwa_id', Authenticated, backController.deleteQuestion);

module.exports = router;