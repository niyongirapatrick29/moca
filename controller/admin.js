const fs = require('fs');

const path = require('path');

const bycrpt = require('bcryptjs');
const Comments = require('../models/comments');
const Category = require('../models/Category');
const fileHelper = require('../util/file');

//const {isEmpty, uploadDir} = require('../middleware/helper');

const User = require('../models/users');
const Order = require('../models/Order');
const CakeProduct = require('../models/cake');
//const Impindura_Data = require('../models/impindura');
//const Book = require('../models/books');
const Gallery = require('../models/gallery');
const Anouncement = require('../models/Anouncement');
//const Akamaro = require('../models/akamaro');
const Slider = require('../models/slider');
const Sobanukirwa = require('../models/sobanukirwa');
const { throws } = require('assert');


exports.getIndex = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/index', {
        pageTitle: 'MOCA',
        path: '/admin',
        csrfToken: req.csrfToken(),
        errorMessage: message
    });

};

exports.postLogin = (req, res, next) => {

    const email = req.body.userEmail;
    const passcode = req.body.user_passcode;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email');
                return res.redirect('/admin');
            }
            bycrpt
                .compare(passcode, user.passcode)
                .then(doMatch => {
                    console.log("Match");
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/admin/home');
                        });
                    }
                    req.flash('error', 'Invalid Password');
                    res.redirect('/admin');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/admin');
                })

        })
        .catch(err => console.log(err));
};

exports.getLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/admin');
    })
};

exports.getHome = (req, res, next) => {
    res.render('admin/home', {
        pageTitle: 'MOCA',
        path: '/home',
        csrfToken: req.csrfToken()
    });
};


//====================== users ================

exports.getUsers = (req, res, next) => {
    var perPage = 9;
    var page = req.query.page || 1;

    let message = req.flash('error');
    //let message = '';
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    User.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)

    .exec(function(err, users) {
        User.countDocuments().exec(function(err, count) {
            if (err) return next(err)
            res.render('admin/users', {
                user: users,
                pageTitle: 'Moca',
                path: '/users',
                errorMessage: message,
                current: page,
                pages: Math.ceil(count / perPage),
                csrfToken: req.csrfToken()
            });
        })
    })
};

exports.getAddUser = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/add-user', {
        pageTitle: 'Moca',
        path: '/add_user',
        errorMessage: message,
        csrfToken: req.csrfToken()
    });
};
exports.postNewUser = (req, res, next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const phone = req.body.phone;
    const email = req.body.email;
    const passcode = req.body.passcode;
    const address = req.body.address;
    const user_status = '0';
    User.findOne({ email: email })
        .then(userEmail => {
            if (userEmail) {
                req.flash('error', 'email is already exist! ');
                return res.redirect('/admin/add_user');
            }
            return bycrpt
                .hash(passcode, 12)
                .then(passcodeHash => {
                    const users = new User({
                        fname: fname,
                        lname: lname,
                        phone: phone,
                        email: email,
                        passcode: passcodeHash,
                        address: address,
                        user_status: user_status
                    });
                    return users.save();
                })
                .then(result => {
                    req.flash('error', 'User well inserted!! ');
                    res.redirect('/admin/users');
                });
        })
        .catch(err => console.log(err));
};

exports.getApproveUser = (req, res, next) => {
    const userID = req.params.userID;
    const user_status = '1';
    User.findById(userID)
        .then(approved => {
            approved.user_status = user_status;
            return approved.save();
        })
        .then(result => {
            req.flash('error', 'User well Approved!! ');
            res.redirect('/admin/users');
        })
        .catch(err => console.log(err))
};

exports.getDeleteUser = (req, res, next) => {
    const userID = req.params.userID;
    User.findByIdAndRemove(userID)
        .then(result => {
            req.flash('error', 'User removed Successfully!! ');
            res.redirect('/admin/users');
        })
        .catch(err => console.log(err))
};

/*################################################################
                        cake
#################################################################*/
exports.getProduct = (req, res, next) => {
    var perPage = 5;
    var page = req.query.page || 1;

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    CakeProduct.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, cakes) {
            CakeProduct.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('admin/products', {
                    products: cakes,
                    pageTitle: 'Moca',
                    path: '/products',
                    errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        });
};


exports.getNewProduct = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Category.find({})
        .exec(function(err, categories) {
            res.render('admin/new_product', {
                pageTitle: 'MOCA',
                categories: categories,
                path: '/new_product',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing: false
            });
        });

};

exports.postNewCake = (req, res, next) => {
    const title = req.body.title;
    const product_subtitle = req.body.product_subtitle;
    const cake_description = req.body.cake_description;
    User.findOne({ _id: req.session._id })
        .then(result => {
            // if(!image){
            //     req.flash('error', 'Please File should be an image !! ');
            //     res.redirect('/admin/inkuru_nshya');
            // }
            // const imagePath = image.path;
            let filename = '';
            let image = req.files.image;
            filename = Date.now() + 'kimeza_' + image.name;
            image.mv('./uploads/' + filename, (err) => {
                if (err) throw err;
            });
            const new_ibigaragara = new CakeProduct({
                title: title,
                product_subtitle: product_subtitle,
                cake_description: cake_description,
                image_news: filename,
                writer: req.session.user.fname,
                product_status: '0',
                category: req.body.category,
                new_date: new Date(),
                news_comment: {
                    comment: []
                }
            });
            return new_ibigaragara.save();
        })
        .then(result => {
            req.flash('error', 'New product added successfully !! ');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

////*******************   ADD CAKE CATEGORY ======================== */
exports.postNewCategory = (req, res, next) => {
    Category.findOne({ categoryName: req.body.category })
        .then(categoryf => {
            if (categoryf) {
                req.flash('error', 'Category already exist! ');
                return res.redirect('/admin/new_product');
            }
            const category = new Category({
                categoryName: req.body.category,
                author: req.session.user._id
            });
            return category.save()
                .then(result => {
                    req.flash('error', req.body.category + ' Category Added!!');
                    res.redirect('/admin/new_product');
                });
        })
        .catch(err => console.log(err));
};

//*=================================  delete category ============================= */

exports.getDeleteCategory = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Category.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not found'))
            } else {
                data.remove();
            }
        })
        .then(result => {
            req.flash('error', 'Category deleted successfully!!');
            res.redirect('/admin/new_product');
        })
        .catch(err => console.log(err));
};

/*********======================  delete category ends here ================================*/

exports.getDeleteProduct = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    CakeProduct.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            } else {
                fs.unlink(path.join(__dirname, '/../uploads/') + data.image_news, (err) => {
                    data.remove();
                });
            }
        })
        .then(result => {
            req.flash('error', 'Product deleted successfully !! ');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getPublish = (req, res, next) => {
    const publishedID = req.params.publishID;
    let product_status = '';
    let ms = "";
    CakeProduct.findById(publishedID)
        .then(publish => {
            if (publish.product_status === '1') {
                ms = "UnPublished successfully !!";
                product_status = '0';
            } else {
                product_status = '1';
                ms = "Published successfully !!";
            }
            publish.product_status = product_status;
            return publish.save();
        })
        .then(result => {
            req.flash('error', ms);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getEdited = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const EditedID = req.params.editID;
    CakeProduct.findById(EditedID)
        .then(edit_data => {
            Category.find({})
                .exec(function(err, categories) {
                    res.render('admin/new_product', {
                        pageTitle: 'MOCA',
                        path: '/edit_product',
                        errorMessage: message,
                        csrfToken: req.csrfToken(),
                        editing_data: edit_data,
                        categories: categories,
                        editing: true
                    });
                })
        })
        .catch(err => con);
};

exports.postEditedData = (req, res, next) => {

    const edit_title = req.body.title;
    const edit_subtitle = req.body.product_subtitle;
    const edit_full_news = req.body.cake_description;
    const category = req.body.category;
    const EditedID = req.body.editID;
    CakeProduct.findById(EditedID)
        .then(result => {
            let edit_image = req.files.image;
            let edit_image_name = '';

            edit_image_name = 'Kimeza_' + Date.now() + '_' + edit_image.name;
            edit_image.mv('./uploads/' + edit_image_name, (err) => {
                if (err) throw err;
            });
            result.image_news = edit_image_name;
            result.title = edit_title;
            result.product_subtitle = edit_subtitle;
            result.category = category;
            result.cake_description = edit_full_news;
            return result.save();
        })
        .then(data => {
            req.flash('error', 'Product Updated Successfully!! ');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProductDetails = (req, res, next) => {
    const details = req.params.detailsID;
    CakeProduct.findById(details)
        .then(details => {
            res.render('admin/product-details', {
                pageTitle: 'MOCA',
                path: '/products',
                details: details,
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => console.log(err))

};


/*################################################################
                    Manage  Gallery
#################################################################*/
exports.getGallery = (req, res, next) => {
    var perPage = 3
    var page = req.query.page || 1
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Gallery.find().sort({ createdAt: -1 })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, data) {
            Gallery.countDocuments().exec(function(err, count) {
                if (err) return next(err)
                res.render('admin/gallery', {
                    gallery_data: data,
                    pageTitle: 'MOCA',
                    path: '/gallery',
                    errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        })
};

exports.getNewGallery = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/new_gallery', {
        pageTitle: 'Moca',
        path: '/new_gallery',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewGallery = (req, res, next) => {
    const gallery_title = req.body.title;
    const gallery_desc = req.body.product_subtitle;

    User.findOne({ _id: req.session.user._id })
        .then(result => {

            let image = req.files.image;
            let imageName = 'Moca_gallery_' + Date.now() + '_' + image.name;
            image.mv('./uploads/' + imageName, (err) => {
                if (err) throw err;
            });
            const gallery_data = new Gallery({
                title: gallery_title,
                product_subtitle: gallery_desc,
                image: imageName,
                writer: req.session.user.fname,
                gallery_status: '0'

            });
            return gallery_data.save();
        })
        .then(result => {
            req.flash('error', 'Image Well Inserted !! ');
            res.redirect('/admin/gallery');
        })
        .catch(err => console.log(err));
};

exports.getDeleteGallery = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Gallery.findById(DeletedID)
        .then(data => {
            const img_path = path.join(__dirname, '../uploads/' + data.image);
            if (!data) {
                return next(new Error('Data is not found'))
            }
            //fileHelper.deleteFile(data.image);
            fs.unlink(img_path, (err) => {
                data.remove();
                if (err) {
                    console.log(err);
                } else {
                    console.log("Image Deleted");
                    //Gallery.findByIdAndDelete({ _id: DeletedID });
                }
            })
        })
        .then(result => {
            req.flash('error', 'Image gallery deleted successfully !! ');
            res.redirect('/admin/gallery');
        })
        .catch(err => console.log(err));
};

exports.getGalleryPublish = (req, res, next) => {
    const publish_ID = req.params.publish_ID;
    let product_status = '';
    Gallery.findById(publish_ID)
        .then(result_data => {
            if (result_data.gallery_status === '1') {
                product_status = '0'
            } else {
                product_status = '1'
            }
            result_data.gallery_status = product_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Image Published !! ');
            res.redirect('/admin/gallery');
        })
        .catch(err => console.log(err));
};
/*################################################################
                        anouncement or amatangazo
#################################################################*/
exports.getAnouncement = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Anouncement.find()
        .then(data => {
            res.render('admin/anouncement', {
                pageTitle: 'MOCA',
                path: '/anouncement',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                anounce_data: data
            });
        })
        .catch(err => console.log(err));
};

exports.getNewAnouncement = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/new_anouncement', {
        pageTitle: 'MOCA',
        path: '/new_anouncement',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewAnouncement = (req, res, next) => {
    const anounce_title = req.body.title;
    const anounce_desc = req.body.product_subtitle;
    const image = req.file;
    User.findOne({ _id: req.session.user._id })
        .then(result => {
            if (!image) {
                req.flash('error', 'No Image Selected !! ');
                res.redirect('/admin/anouncement');
            }
            const anounce_image = image.path;
            const anounce_data = new Anouncement({
                title: anounce_title,
                product_subtitle: anounce_desc,
                image: anounce_image,
                writer: req.session.user.fname,
                anounce_status: '0',
                anounce_date: new Date()

            });
            return anounce_data.save();
        })
        .then(result => {
            req.flash('error', 'Image Well Inserted !! ');
            res.redirect('/admin/anouncement');
        })
        .catch(err => console.log(err));
};

exports.getEditAnouncement = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const edit_ID = req.params.anounce_edit;
    Anouncement.findById(edit_ID)
        .then(edit_anounce => {
            res.render('admin/new_anouncement', {
                pageTitle: 'MOCA',
                path: '/new_anouncement',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing_data: edit_anounce,
                editing: true
            });
        })
        .catch(err => console.log(err));
};

exports.postEditAnouncement = (req, res, next) => {
    const anounce_id = req.body.anounce_ID;
    const anounce_title = req.body.title;
    const anounce_desc = req.body.product_subtitle;
    const image = req.file;
    Anouncement.findById(anounce_id)
        .then(result => {
            if (!image) {
                req.flash('error', 'No Image Selected !! ');
                res.redirect('/admin/anouncement');
            }
            const anounce_image = image.path;
            result.title = anounce_title;
            result.product_subtitle = anounce_desc;
            result.image = anounce_image;
            result.save();
        })
        .then(results => {
            req.flash('error', 'Anouncement Well Updated !! ');
            res.redirect('/admin/anouncement');
        })
        .catch(err => console.log(err));
};

exports.getDeleteAnouncement = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Anouncement.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            }
            fileHelper.deleteFile(data.image);
            return Anouncement.deleteOne({ _id: DeletedID, writer: req.session.user._id });
        })
        .then(result => {
            req.flash('error', 'Image gallery deleted successfully !! ');
            res.redirect('/admin/anouncement');
        })
        .catch(err => console.log(err));
};

exports.getPublishAnouncement = (req, res, next) => {
    const publish_ID = req.params.publish_ID;
    let product_status = '';
    Anouncement.findById(publish_ID)
        .then(result_data => {
            if (result_data.anounce_status === '1') {
                product_status = '0'
            } else {
                product_status = '1'
            }
            result_data.anounce_status = product_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Anouncement Published !! ');
            res.redirect('/admin/anouncement');
        })
        .catch(err => console.log(err));
};

/*################################################################
                   MANAGE slider image 
#################################################################*/
exports.getSlider = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Slider.find()
        .then(data => {
            res.render('admin/slider', {
                pageTitle: 'MOCA',
                path: '/slider',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                slider_data: data
            });
        })
        .catch(err => console.log(err));
};

exports.getNewSlider = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/new_slider', {
        pageTitle: 'MOCA',
        path: '/new_slide',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewSliderImage = (req, res, next) => {
    const slide_title = req.body.title;
    const slide_desc = req.body.description;
    User.findOne({ _id: req.session.user._id })
        .then(result => {
            let imageName = '';
            let image = req.files.image;
            imageName = 'Kimeza_' + Date.now() + '_' + image.name;
            image.mv('./uploads/' + imageName, (err) => {
                if (err) throw err;
            });
            const slide_data = new Slider({
                title: slide_title,
                description: slide_desc,
                image: imageName,
                writer: req.session.user.fname,
                slide_status: '0',
                slide_date: new Date()
            });
            return slide_data.save();
        })
        .then(result => {
            req.flash('error', 'The New Meaning Well Inserted !! ');
            res.redirect('/admin/slider');
        })
        .catch(err => console.log(err));
};

exports.getDeleteSlider = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Slider.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            } else {
                fs.unlink(path.join(__dirname, '/../uploads/') + data.image, (err) => {
                    data.remove();
                });
            }

        })
        .then(result => {
            req.flash('error', 'The slider deleted successfully !! ');
            res.redirect('/admin/slider');
        })
        .catch(err => console.log(err));
};

exports.getEditSlider = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const edit_ID = req.params.edit_ID;
    Slider.findById(edit_ID)
        .then(edit_slide => {
            res.render('admin/new_slider', {
                pageTitle: 'MOCA',
                path: '/new_slider',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing_data: edit_slide,
                editing: true
            });
        })
        .catch(err => console.log(err));
};

exports.postEditSlider = (req, res, next) => {
    const slide_id = req.body.slide_ID;
    const slide_title = req.body.title;
    const slide_desc = req.body.description;
    Slider.findById(slide_id)
        .then(result => {
            let image = req.files.image;
            let slider_image_name = '';
            if (!image) {
                req.flash('error', 'No Image Selected !! ');
                res.redirect('/admin/slider');
            }
            slider_image_name = 'Kimeza_' + Date.now() + '_' + image.name;
            image.mv('./uploads/' + slider_image_name, (err) => {
                if (err) throw err;
            });
            result.title = slide_title;
            result.description = slide_desc;
            result.image = slider_image_name;
            result.save();
        })
        .then(results => {
            req.flash('error', 'Slider Image Well Updated !! ');
            res.redirect('/admin/slider');
        })
        .catch(err => console.log(err));

};

exports.getPublishSlider = (req, res, next) => {
    const publish_ID = req.params.publish_ID;
    let product_status = '';
    Slider.findById(publish_ID)
        .then(result_data => {
            if (result_data.slide_status === '1') {
                product_status = '0'
            } else {
                product_status = '1'
            }
            result_data.slide_status = product_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Slider Image Published !! ');
            res.redirect('/admin/slider');
        })
        .catch(err => console.log(err));
};

/*################################################################
            sobanukirwa nibibazo bidakunda kwibaza
#################################################################*/
exports.getSobanukirwa = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Sobanukirwa.find()
        .populate({ path: 'comments', populate: { path: 'sobanukirwa', model: 'sobanukirwas' } })
        .populate('comments')
        .then(sobanukirwa_data => {
            res.render('admin/sobanukirwa', {
                pageTitle: 'MOCA',
                path: '/sobanukirwa',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing: false,
                data_sobanukirwa: sobanukirwa_data
            });
        })
        .catch(err => console.log(err));
};

exports.postSobanukirwa = (req, res, next) => {
    const ikibazo_ID = req.body.ikibazo_ID;
    const igisubizo = req.body.igisubizo;
    Sobanukirwa.findById(ikibazo_ID)
        .then(result => {
            result.igisubizo = igisubizo;
            result.ikibazo_status = '1'
            result.save();
        })
        .then(resul => {
            req.flash('error', 'Igisubizo cyatanzwe neza !! ');
            res.redirect('/admin/sobanukirwa');
        })
        .catch(err => console.log(err));
};

//**********************  delete  one comment at time*/

exports.deleteSobanukirwaComment = (req, res, next) => {
    //const DeletedID = req.params.deleteID;
    Comments.remove({ _id: req.params.comment_id })
        //Slider.findById(DeletedID)
        .then(deleteItem => {
            Sobanukirwa.findOneAndUpdate({ comments: req.params.comment_id }, { $pull: { comments: req.params.comment_id } }, (err, data) => {
                if (err) console.log(err)
            });
        })
        .then(deleteItem => {
            req.flash('error', 'Igitekerezo uragisebye !! ');
            res.redirect('/contact');
        })
        .catch(err => console.log(err));
};

/* Delete sobanukirwa with it's all comments  */

exports.deleteQuestion = (req, res, next) => {
    // find question first
    Sobanukirwa.findById(req.params.sobanukirwa_id)
        .then((ikibazo) => {
            //check if there are some comment
            if (ikibazo.comments.length > 0) {
                ///
                for (var i = (ikibazo.comments.length - 1); i >= 0; i--) {
                    //delete all comments from comments model
                    Comments.findByIdAndRemove(ikibazo.comments[i])
                        .then((comments) => {
                            comments.save();
                        }, (err) => next(err));
                }
                ikibazo.remove()
                ikibazo.save()
                req.flash('error', 'Igisubizo uragisibye !! ');
                res.redirect('/admin/sobanukirwa');

            } else if (ikibazo.comments.length === 0) {
                ikibazo.remove()
                ikibazo.save()
                req.flash('error', 'Igisubizo uragisibye !! ');
                res.redirect('/admin/sobanukirwa');

            } else {
                err = new Error('Dish ' + req.params.sobanukirwa_id + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
};

/* ============================== MANAGE USERS  =========================*/

exports.getAddUser = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/add-user', {
        pageTitle: 'Moca',
        path: '/add_user',
        errorMessage: message,
        csrfToken: req.csrfToken()
    });
};

exports.postNewUser = (req, res, next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const phone = req.body.phone;
    const email = req.body.email;
    const passcode = req.body.passcode;
    const address = req.body.address;
    const user_status = '0';
    User.findOne({ email: email })
        .then(userEmail => {
            if (userEmail) {
                req.flash('error', 'email is already exist! ');
                return res.redirect('/admin/add_user');
            }
            return bycrpt
                .hash(passcode, 12)
                .then(passcodeHash => {
                    const users = new User({
                        fname: fname,
                        lname: lname,
                        phone: phone,
                        email: email,
                        passcode: passcodeHash,
                        address: address,
                        user_status: user_status
                    });
                    return users.save();
                })
                .then(result => {
                    req.flash('error', 'User well inserted!! ');
                    res.redirect('/admin/users');
                });
        })
        .catch(err => console.log(err));
};

exports.getApproveUser = (req, res, next) => {
    const userID = req.params.userID;
    const user_status = '1';
    User.findById(userID)
        .then(approved => {
            approved.user_status = user_status;
            return approved.save();
        })
        .then(result => {
            req.flash('error', 'User well Approved!! ');
            res.redirect('/admin/users');
        })
        .catch(err => console.log(err))
};

exports.getDeleteUser = (req, res, next) => {
    const userID = req.params.userID;
    User.findByIdAndRemove(userID)
        .then(result => {
            req.flash('error', 'User removed Successfully!! ');
            res.redirect('/admin/users');
        })
        .catch(err => console.log(err))
};
//##===================================== MANAGE USERS ENDS HERE   =====================*/

//***************************************   MANAGE  ORDERS -************************ */

exports.getOrders = (req, res, next) => {
    var perPage = 9;
    var page = req.query.page || 1;

    //let message = req.flash('error');
    let message = '';
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Order.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)

    .exec(function(err, orders) {
        Order.countDocuments().exec(function(err, count) {
            if (err) return next(err)
            res.render('admin/orders', {
                orders: orders,
                pageTitle: 'Moca',
                path: '/orders',
                errorMessage: message,
                current: page,
                pages: Math.ceil(count / perPage),
                csrfToken: req.csrfToken()
            });
        })
    })
};

exports.getApproveOrder = (req, res, next) => {
    const orderID = req.params.orderID;
    const status = 'Paid';
    Order.findById(orderID)
        .then(order => {
            order.status = status;
            return order.save();
        })
        .then(result => {
            req.flash('error', 'Order is well Updated!! ');
            res.redirect('/admin/orders');
        })
        .catch(err => console.log(err))
};

exports.getDeleteOrder = (req, res, next) => {
    const orderID = req.params.orderID;
    Order.findByIdAndRemove(orderID)
        .then(result => {
            req.flash('error', 'Order Deleted Successfully!! ');
            res.redirect('/admin/orders');
        })
        .catch(err => console.log(err))
};

/* =================== ORDERS ENDS HERE ============================*/