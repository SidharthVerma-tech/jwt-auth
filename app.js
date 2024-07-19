const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const {protected, checkUser} = require('./controller/user.controller')
const app = express();

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'));
// view engine
app.set('view engine', 'ejs');
// database connection
const dbURI = 'mongodb+srv://SidharthVerma:jCpzuvhlwmIwWjlx@cluster0.kk5maed.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(3000);
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

// routes
//jCpzuvhlwmIwWjlx
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',protected, (req, res) => res.render('smoothies'));
app.use(authRoutes)
