var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const csrf = require('csurf');
//mongodb+srv://niyongirapatrick29:Kike72549@cluster0.mcnqj.mongodb.net/Kimezamiryango?retryWrites=true&w=majority
const MONGODB_URI = "mongodb+srv://niyongirapatrick29:Kike72549@cluster0.mcnqj.mongodb.net/Moca?retryWrites=true&w=majority";
//const MONGODB_URI = "mongodb://localhost:27017/Moca";
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'kim_sessions'
});
const flash = require('connect-flash');
const upload = require('express-fileupload');
var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const BackendataRouters = require('./routes/back');

var app = express();
const csrfProtection = csrf();
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//===========================
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', BackendataRouters);
app.use(indexRouter);
//app.use('/', adminRouter);


//=============================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    console.log(res.locals.message);
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('home/error');
    console.log(err.status);
});


module.exports = app;