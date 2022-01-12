const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const engine = require('ejs-mate');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews)




app.get('/', (req, res) => {
    res.render('home');
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!!!" } = err;
    if (!err.message) err.message = 'OHH NO, SOMETHING WENT WRONG!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});