
'use strict';

let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
var mongoose = require('mongoose');

let riderApi = require('./routes/riders');
let userApi = require('./routes/users');

let facebook = require('./routes/auth/facebook');
let twitter = require('./routes/auth/twitter');
let linkedin = require('./routes/auth/linkedin');

let index = require('./routes/index');
let partials = require('./routes/partials');

let auth = require('./config/auth');

let database = process.env.MONGOLAB_URI || 'mongodb://localhost/rider';
console.log('Connecting to mongodb: ', database);
mongoose.connect(database);

let app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(auth.auth);

app.use('/api/riders', auth.isAuth, riderApi);
app.use('/api/users', userApi);

app.use('/auth/facebook', facebook);
app.use('/auth/twitter', twitter);
app.use('/auth/linkedin', linkedin);

app.use('/', index);
app.use('/partials', partials);

let port = process.env.PORT || 3000;
let listener = app.listen(port);

console.log('express in listening on port: ' + listener.address().port);

process.on('exit', (code) => {
  mongoose.disconnect();
  console.log('About to exit with code:', code);
});
