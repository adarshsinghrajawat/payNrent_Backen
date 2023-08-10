var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var subcategoryRouter = require('./routes/subcategory');
var companyRouter = require('./routes/company');
var modelRouter = require('./routes/model');
var vehicleRouter = require('./routes/vehicle');
var userRouter = require('./routes/userinterface');
var featureRouter = require('./routes/feature');
var offerRouter = require('./routes/offer');
var whyusRouter = require('./routes/whyus');
var adminRouter = require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/subcategory', subcategoryRouter);
app.use('/company', companyRouter);
app.use('/model', modelRouter);
app.use('/vehicle', vehicleRouter);
app.use('/user', userRouter);
app.use('/feature', featureRouter);
app.use('/offer', offerRouter);
app.use('/whyus', whyusRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
