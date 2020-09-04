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

/*router.get('/add_user', Authenticated, backController.getAddUser);

router.post('/add_user', backController.postNewUser);

router.get('/approve_user/:userID', Authenticated, backController.getApproveUser);

router.get('/delete_user/:userID', Authenticated, backController.getDeleteOrder);*/

/*##################################################################################################

                                        ibigaragara system
###################################################################################################*/

router.get('/products', Authenticated, backController.getIbigaragara);

router.get('/new_product', Authenticated, backController.getInkuruNshya);

router.post('/inkuru_nshya', Authenticated, backController.postInkuruNshya);

router.get('/ibigaragara_details/:detailsID', Authenticated, backController.getInkuruDetails);

router.get('/delete_ibigaragara/:deleteID', Authenticated, backController.getDeleteIbigaragara);

router.get('/publish_ibigaragara/:publishID', Authenticated, backController.getPublish);

router.get('/edit_ibigaragara/:editID', Authenticated, backController.getEdited);

router.post('/edit_ibigaragara', Authenticated, backController.postEditedData);

/*##################################################################################################
                                        impindura system
###################################################################################################*/

router.get('/impindura', Authenticated, backController.getImpindura);

router.get('/impindura_nshya', Authenticated, backController.getImpinduraNshya);

router.post('/impindura_nshya', Authenticated, backController.postImpinduraNshya);

router.get('/impindura_delete/:deleteID', Authenticated, backController.getDeleteImpindura);

router.get('/impindura_edit/:editID', Authenticated, backController.getEditedImpindura);

router.post('/impindura_edit', Authenticated, backController.postEditedImpindura);

router.get('/impindura_publish/:publishID', Authenticated, backController.getImpunduraPublish);

/*##################################################################################################
                                        inyandiko or books system
###################################################################################################*/

router.get('/book_view', Authenticated, backController.getBooks);

router.get('/new_book', Authenticated, backController.getNewBook);

router.post('/new_book', Authenticated, backController.postNewBook);

router.get('/edit_book/:editID', Authenticated, backController.getEditBook);

router.post('/edit_book', Authenticated, backController.postEditBook);

router.get('/download_book/:bookID', Authenticated, backController.getBookDownload);

router.get('/book_publish/:publish_ID', Authenticated, backController.getBookPublish);

router.get('/book_delete/:deleteID', Authenticated, backController.getDeleteBook);

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
                                        akamaro system
###################################################################################################*/
router.get('/akamaro', Authenticated, backController.getAkamaro);

router.get('/new_akamaro', Authenticated, backController.getNewAkamaro);

router.post('/new_akamaro', Authenticated, backController.postNewAkamaro);

router.get('/akamaro_edit/:edit_akamaro', Authenticated, backController.getEditAkamaro);

router.post('/akamaro_edit', Authenticated, backController.postEditAkamaro);

router.get('/akamaro_delete/:deleteID', Authenticated, backController.getDeleteAkamaro);

router.get('/akamaro_publish/:publish_ID', Authenticated, backController.getPublishAkamaro);

/*##################################################################################################
                                        akamaro system
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
router.get('/sobanukirwa', Authenticated, backController.getSobanukirwa);
router.post('/sobanukirwa', Authenticated, backController.postSobanukirwa);
router.get('/sobanukirwa/:comment_id', Authenticated, backController.deleteSobanukirwaComment);
router.get('/sobanukirwad/:sobanukirwa_id', Authenticated, backController.deleteQuestion);

module.exports = router;