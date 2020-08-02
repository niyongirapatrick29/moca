const fs = require('fs');

const path = require('path');

const bycrpt = require('bcryptjs');
const Comments = require('../models/comments');

const fileHelper = require('../util/file');

//const {isEmpty, uploadDir} = require('../middleware/helper');

const User = require('../models/users');
const Ibigaragara_news = require('../models/ibigaragara');
const Impindura_Data = require('../models/impindura');
const Book = require('../models/books');
const Gallery = require('../models/gallery');
const Anouncement = require('../models/Anouncement');
const Akamaro = require('../models/akamaro');
const Slider = require('../models/slider');
const Sobanukirwa = require('../models/sobanukirwa');
const { throws } = require('assert');
const sobanukirwa = require('../models/sobanukirwa');


exports.getIndex = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/index', {
        pageTitle: 'KIMEZAMIRYANGO',
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
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/home',
        csrfToken: req.csrfToken()
    });
};


//====================== users ================

exports.getUsers = (req, res, next) => {
    var perPage = 9;
    var page = req.query.page || 1;

    //let message = req.flash('error');
    let message = '';
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
                        ibigaragara
#################################################################*/
exports.getIbigaragara = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Ibigaragara_news.find()
        .then(views => {
            res.render('admin/ibigaragara', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/ibigaragara_view',
                csrfToken: req.csrfToken(),
                errorMessage: message,
                ibigaragara_data: views
            });
        })
        .catch(err => console.log(err));
};

exports.getInkuruNshya = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/inkuru_nshya', {
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/inkuru_nshya',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postInkuruNshya = (req, res, next) => {
    //const image = req.file;
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const full_news = req.body.full_news;
    User.findOne({ id: req.session.id })
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
            //console.log(filename);
            const new_ibigaragara = new Ibigaragara_news({
                title: title,
                subtitle: subtitle,
                full_news: full_news,
                image_news: filename,
                writer: req.session.user.fname,
                news_status: '0',
                new_date: new Date(),
                news_comment: {
                    comment: []
                }
            });
            return new_ibigaragara.save();
        })
        .then(result => {
            req.flash('error', 'news inserted successfully !! ');
            res.redirect('/admin/ibigaragara_view');
        })
        .catch(err => console.log(err));
};

exports.getDeleteIbigaragara = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Ibigaragara_news.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            } else {
                fs.unlink(path.join(__dirname, '/../uploads/') + data.image_news, (err) => {
                    //return Impindura_Data.deleteOne({ _id:DeletedID, writer:req.session.user._id });
                    data.remove();
                    //console.log("Deleted :" + path.join( __dirname,'/../uploads/') + data.image);
                });
            }
        })
        .then(result => {
            req.flash('error', 'news deleted successfully !! ');
            res.redirect('/admin/ibigaragara_view');
        })
        .catch(err => console.log(err));
};

exports.getPublish = (req, res, next) => {
    const publishedID = req.params.publishID;
    let news_status = '';
    Ibigaragara_news.findById(publishedID)
        .then(publish => {
            if (publish.news_status === '1') {
                news_status = '0';
            } else {
                news_status = '1';
            }
            publish.news_status = news_status;
            return publish.save();
        })
        .then(result => {
            req.flash('error', 'News Published successfully !! ');
            res.redirect('/admin/ibigaragara_view');
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
    Ibigaragara_news.findById(EditedID)
        .then(edit_data => {
            res.render('admin/inkuru_nshya', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/edit_ibigaragara/',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing_data: edit_data,
                editing: true
            });
        })
        .catch(err => con);
};

exports.postEditedData = (req, res, next) => {

    const edit_title = req.body.title;
    const edit_subtitle = req.body.subtitle;
    const edit_full_news = req.body.full_news;
    const EditedID = req.body.editID;
    Ibigaragara_news.findById(EditedID)
        .then(result => {
            let edit_image = req.files.image;
            let edit_image_name = '';

            edit_image_name = 'Kimeza_' + Date.now() + '_' + edit_image.name;
            edit_image.mv('./uploads/' + edit_image_name, (err) => {
                if (err) throw err;
            });
            result.image_news = edit_image_name;
            result.title = edit_title;
            result.subtitle = edit_subtitle;
            result.full_news = edit_full_news;
            return result.save();
        })
        .then(data => {
            req.flash('error', 'News Updated Successfully!! ');
            res.redirect('/admin/ibigaragara_view');
        })
        .catch(err => console.log(err));
};

exports.getInkuruDetails = (req, res, next) => {
    const details = req.params.detailsID;
    Ibigaragara_news.findById(details)
        .then(details => {
            res.render('admin/ibigaragara_details', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/ibigaragara_details',
                details: details,
                csrfToken: req.csrfToken()
            });
        })
        .catch(err => console.log(err))

};

/*################################################################
                        impindura
#################################################################*/
exports.getImpindura = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Impindura_Data.find()
        .then(data => {
            res.render('admin/impindura', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/impindura',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                data_impindura: data
            });
        })
        .catch(err => console.log(err));
};

exports.getImpinduraNshya = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/impindura_nshya', {
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/impindura_nshya',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postImpinduraNshya = (req, res, next) => {
    //const image  = req.file;
    const umuhanga = req.body.umuhanga;
    const ijambo = req.body.ijambo;
    User.findOne({ _id: req.session.user._id })
        .then(result => {
            // if(!image){
            //     req.flash('error', 'Please File should be an image !! ');
            //     res.redirect('/admin/inkuru_nshya');
            // }
            //const image_path = image.path;
            let filename = '';
            //if(!isEmpty(req.files)){
            let image = req.files.image;
            filename = Date.now() + 'kimeza_' + image.name;
            image.mv('./uploads/' + filename, (err) => {
                if (err) throw err;
            });
            //console.log(filename);
            //} 
            const new_impindura = new Impindura_Data({
                image: filename,
                umuhanga: umuhanga,
                ijambo: ijambo,
                writer: req.session.user._id,
                news_status: '0'
            });
            return new_impindura.save();
        })
        .then(result => {
            req.flash('error', 'Impindura inserted successfully !! ');
            res.redirect('/admin/impindura');
        })
        .catch(err => console.log(err));
};

exports.getDeleteImpindura = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Impindura_Data.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            } else {
                fs.unlink(path.join(__dirname, '/../uploads/') + data.image, (err) => {
                    //return Impindura_Data.deleteOne({ _id:DeletedID, writer:req.session.user._id });
                    data.remove();
                    //console.log("Deleted :" + path.join( __dirname,'/../uploads/') + data.image);
                });
            }
        })
        .then(result => {
            req.flash('error', 'Impindura deleted successfully !! ');
            res.redirect('/admin/impindura');
        })
        .catch(err => console.log(err));
};

exports.getEditedImpindura = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const editID = req.params.editID;
    Impindura_Data.findById(editID)
        .then(editData => {
            res.render('admin/impindura_nshya', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/impindura_nshya',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing_data: editData,
                editing: true
            });
        })
        .catch(err => console.log(err));
};

exports.postEditedImpindura = (req, res, next) => {
    const editedID = req.body.editedID;
    const edited_image = req.file;
    const edited_umuhanga = req.body.umuhanga;
    const edited_ijambo = req.body.ijambo;
    Impindura_Data.findById(editedID)
        .then(data_edit => {
            if (!edited_image) {
                req.flash('error', 'Please File should be an image !! ');
                res.redirect('/admin/impindura');
            }
            const edited_image_path = edited_image.path;
            data_edit.image = edited_image_path;
            data_edit.umuhanga = edited_umuhanga;
            data_edit.ijambo = edited_ijambo;
            data_edit.save();
        })
        .then(result => {
            req.flash('error', 'Impindura updated !! ');
            res.redirect('/admin/impindura');
        })
        .catch(err => console.log(err));
};

exports.getImpunduraPublish = (req, res, next) => {
    const publishID = req.params.publishID;
    let news_status = '';
    Impindura_Data.findById(publishID)
        .then(result_data => {
            if (result_data.news_status === '1') {
                news_status = '0'
            } else {
                news_status = '1'
            }
            result_data.news_status = news_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Impindura Published !! ');
            res.redirect('/admin/impindura');
        })
        .catch(err => console.log(err));
};
/*################################################################
                        Inyandiko books
#################################################################*/
exports.getBooks = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Book.find()
        .then(data => {
            res.render('admin/books', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/books',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                book_data: data
            });
        })
        .catch(err => console.log(err));
};

exports.getNewBook = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/new_book', {
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/new_book',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewBook = (req, res, next) => {
    //const book_image  = req.file;
    const book_title = req.body.title;
    const book_desc = req.body.description;

    User.findOne({ _id: req.session.user._id })
        .then(result => {
            let image = req.files.image;
            let book = req.files.book;
            let imageName = 'Kimeza_book_' + Date.now() + '_' + image.name;
            let fileName = 'Kimeza_Book_' + Date.now() + '_' + book.name;
            image.mv('./uploads/' + imageName, (err) => {
                if (err) throw err;
            });
            book.mv('./uploads/' + fileName, (err) => {
                if (err) throw err;
            });
            const book_files = image.path;
            const book_data = new Book({
                image: imageName,
                title: book_title,
                description: book_desc,
                books: fileName,
                writer: req.session.user.fname,
                book_status: '0',
                book_comment: {
                    comment: []
                }
            });
            return book_data.save();
        })
        .then(result => {
            req.flash('error', 'Book Well Inserted !! ');
            res.redirect('/admin/book_view');
        })
        .catch(err => console.log(err));
};

exports.getBookDownload = (req, res, next) => {
    const bookID = req.params.bookID;
    const bookName = 'kime_' + bookID + '.pdf';
    const bookPath = path.join('uploads', bookName);
    fs.readFile(bookPath, (err, data) => {
        if (err) {
            return next(err);
        }
        res.send(data);
    });
};

exports.getEditBook = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const edit_ID = req.params.editID;
    Book.findById(edit_ID)
        .then(edit_book => {
            res.render('admin/new_book', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/new_book',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing_data: edit_book,
                editing: true
            });
        })
        .catch(err => console.log(err));
};

exports.postEditBook = (req, res, next) => {
    const book_id = req.body.book_ID;
    const book_title = req.body.title;
    const book_desc = req.body.description;
    const image = req.file;
    Book.findById(book_id)
        .then(result => {
            if (!image) {
                req.flash('error', 'No Book Selected !! ');
                res.redirect('/admin/book_view');
            }
            const book_image = image.path;
            result.title = book_title;
            result.description = book_desc;
            result.books = book_image;
            result.save();
        })
        .then(results => {
            req.flash('error', 'Book Well Updated !! ');
            res.redirect('/admin/book_view');
        })
        .catch(err => console.log(err));
};

exports.getBookPublish = (req, res, next) => {
    const publish_ID = req.params.publish_ID;
    let news_status = '';
    Book.findById(publish_ID)
        .then(result_data => {
            if (result_data.book_status === '1') {
                news_status = '0'
            } else {
                news_status = '1'
            }
            result_data.book_status = news_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Book Published !! ');
            res.redirect('/admin/book_view');
        })
        .catch(err => console.log(err));
};

exports.getDeleteBook = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Book.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            } else {
                fs.unlink(path.join(__dirname, '/../uploads/') + data.image, (err) => {
                    data.remove();
                });
                fs.unlink(path.join(__dirname, '/../uploads/') + data.books, (err) => {
                    data.remove();
                });
            }
        })
        .then(result => {
            req.flash('error', 'Book deleted successfully !! ');
            res.redirect('/admin/book_view');
        })
        .catch(err => console.log(err));
};
/*################################################################
                        Inyandiko books
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
                res.render('admin/ubwiza', {
                    gallery_data: data,
                    pageTitle: 'KIMEZAMIRYANGO',
                    path: '/ubwiza',
                    errorMessage: message,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    csrfToken: req.csrfToken()
                });
            })
        })

    // .then(data => {
    //     res.render('admin/ubwiza', {
    //         pageTitle: 'KIMEZAMIRYANGO',
    //         path: '/ubwiza',
    //         errorMessage: message,
    //         csrfToken: req.csrfToken(),
    //         gallery_data: data
    //     });
    // })
    // .catch(err => console.log(err));
};

exports.getNewGallery = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/new_gallery', {
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/new_gallery',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewGallery = (req, res, next) => {
    const gallery_title = req.body.title;
    const gallery_desc = req.body.subtitle;

    User.findOne({ _id: req.session.user._id })
        .then(result => {

            let image = req.files.image;
            let imageName = 'Kimeza_gallery_' + Date.now() + '_' + image.name;
            image.mv('./uploads/' + imageName, (err) => {
                if (err) throw err;
            });
            const gallery_data = new Gallery({
                title: gallery_title,
                subtitle: gallery_desc,
                image: imageName,
                writer: req.session.user.fname,
                gallery_status: '0'

            });
            return gallery_data.save();
        })
        .then(result => {
            req.flash('error', 'Image Well Inserted !! ');
            res.redirect('/admin/ubwiza');
        })
        .catch(err => console.log(err));
};

exports.getDeleteGallery = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Gallery.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            }
            fileHelper.deleteFile(data.image);
            return Gallery.deleteOne({ _id: DeletedID, writer: req.session.user._id });
        })
        .then(result => {
            req.flash('error', 'Image gallery deleted successfully !! ');
            res.redirect('/admin/ubwiza');
        })
        .catch(err => console.log(err));
};

exports.getGalleryPublish = (req, res, next) => {
    const publish_ID = req.params.publish_ID;
    let news_status = '';
    Gallery.findById(publish_ID)
        .then(result_data => {
            if (result_data.gallery_status === '1') {
                news_status = '0'
            } else {
                news_status = '1'
            }
            result_data.gallery_status = news_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Image Published !! ');
            res.redirect('/admin/ubwiza');
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
                pageTitle: 'KIMEZAMIRYANGO',
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
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/new_anouncement',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewAnouncement = (req, res, next) => {
    const anounce_title = req.body.title;
    const anounce_desc = req.body.subtitle;
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
                subtitle: anounce_desc,
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
                pageTitle: 'KIMEZAMIRYANGO',
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
    const anounce_desc = req.body.subtitle;
    const image = req.file;
    Anouncement.findById(anounce_id)
        .then(result => {
            if (!image) {
                req.flash('error', 'No Image Selected !! ');
                res.redirect('/admin/anouncement');
            }
            const anounce_image = image.path;
            result.title = anounce_title;
            result.subtitle = anounce_desc;
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
    let news_status = '';
    Anouncement.findById(publish_ID)
        .then(result_data => {
            if (result_data.anounce_status === '1') {
                news_status = '0'
            } else {
                news_status = '1'
            }
            result_data.anounce_status = news_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'Anouncement Published !! ');
            res.redirect('/admin/anouncement');
        })
        .catch(err => console.log(err));
};
/*################################################################
                        Akamaro kibyaremwe byose
#################################################################*/
exports.getAkamaro = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    Akamaro.find()
        .then(data => {
            res.render('admin/akamaro', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/akamaro',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                akamaro_data: data
            });
        })
        .catch(err => console.log(err));
};

exports.getNewAkamaro = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/new_akamaro', {
        pageTitle: 'KIMEZAMIRYANGO',
        path: '/new_akamaro',
        errorMessage: message,
        csrfToken: req.csrfToken(),
        editing: false
    });
};

exports.postNewAkamaro = (req, res, next) => {
    const akamaro_title = req.body.title;
    const akamaro_subtitle = req.body.subtitle;
    const akamaro_desc = req.body.description;
    let image = req.files.image;
    let akamaro_image = '';
    User.findOne({ _id: req.session.user._id })
        .then(result => {
            akamaro_image = 'Kimeza_Akamaro_' + Date.now() + image.name;
            image.mv('./uploads/' + akamaro_image, (err) => {
                if (err) throw err;
            });
            const akamaro_data = new Akamaro({
                title: akamaro_title,
                subtitle: akamaro_subtitle,
                details_data: akamaro_desc,
                image: akamaro_image,
                writer: req.session.user.fname,
                akamaro_status: '0',
                akamaro_date: new Date()
            });
            return akamaro_data.save();
        })
        .then(result => {
            req.flash('error', 'The New Meaning Well Inserted !! ');
            res.redirect('/admin/akamaro');
        })
        .catch(err => console.log(err));
};

exports.getEditAkamaro = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const edit_ID = req.params.edit_akamaro;
    Akamaro.findById(edit_ID)
        .then(edit_akamaro => {
            res.render('admin/new_akamaro', {
                pageTitle: 'KIMEZAMIRYANGO',
                path: '/new_anouncement',
                errorMessage: message,
                csrfToken: req.csrfToken(),
                editing_data: edit_akamaro,
                editing: true
            });
        })
        .catch(err => console.log(err));
};

exports.postEditAkamaro = (req, res, next) => {
    const akamaro_id = req.body.akamaro_ID;
    const akamaro_title = req.body.title;
    const akamaro_subtitle = req.body.subtitle;
    const akamaro_details = req.body.description;
    const image = req.file;
    Akamaro.findById(akamaro_id)
        .then(result => {
            if (!image) {
                req.flash('error', 'No Image Selected !! ');
                res.redirect('/admin/akamaro');
            }
            const akamaro_image = image.path;
            result.title = akamaro_title;
            result.subtitle = akamaro_subtitle;
            result.details_data = akamaro_details;
            result.image = akamaro_image;
            result.save();
        })
        .then(results => {
            req.flash('error', 'Data Well Updated !! ');
            res.redirect('/admin/akamaro');
        })
        .catch(err => console.log(err));
};

exports.getDeleteAkamaro = (req, res, next) => {
    const DeletedID = req.params.deleteID;
    Akamaro.findById(DeletedID)
        .then(data => {
            if (!data) {
                return next(new Error('Data is not foun'))
            }
            fileHelper.deleteFile(data.image);
            return Akamaro.deleteOne({ _id: DeletedID });
        })
        .then(result => {
            req.flash('error', 'The meaning deleted successfully !! ');
            res.redirect('/admin/akamaro');
        })
        .catch(err => console.log(err));
};

exports.getPublishAkamaro = (req, res, next) => {
    const publish_ID = req.params.publish_ID;
    let news_status = '';
    Akamaro.findById(publish_ID)
        .then(result_data => {
            if (result_data.akamaro_status === '1') {
                news_status = '0'
            } else {
                news_status = '1'
            }
            result_data.akamaro_status = news_status;
            result_data.save();
        })
        .then(result => {
            req.flash('error', 'This Meaning is Published successfully !! ');
            res.redirect('/admin/akamaro');
        })
        .catch(err => console.log(err));
};
/*################################################################
                        slider image byose
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
                pageTitle: 'KIMEZAMIRYANGO',
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
        pageTitle: 'KIMEZAMIRYANGO',
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
                pageTitle: 'KIMEZAMIRYANGO',
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
    let news_status = '';
    Slider.findById(publish_ID)
        .then(result_data => {
            if (result_data.slide_status === '1') {
                news_status = '0'
            } else {
                news_status = '1'
            }
            result_data.slide_status = news_status;
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
                pageTitle: 'KIMEZAMIRYANGO',
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