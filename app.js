const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


const listings=require("./routes/listing.js");

const reviews=require("./routes/review.js");
const port = 3000;

// Setup view engine and paths
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const review=require("./routes/review.js");
// DB Connection
async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}
main()
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.render('listings/home');
});




app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;

    res.status(statusCode);  
    res.render('error.ejs', { err });  
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});