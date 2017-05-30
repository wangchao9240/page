let express = require('express');
let port = process.env.PORT || 3000;
let path = require('path');
let bodyParser = require('body-parser');
let session = require('express-session');
let logger = require('morgan');
let MongoStore = require('connect-mongo')(session);
let app = express();
let multipart = require('connect-multiparty');

const dbUrl = 'mongodb://localhost:27017/website';

let mongoose = require('mongoose');
mongoose.connect(dbUrl);
mongoose.Promise = Promise;

app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.locals.moment = require('moment');
app.use(session({
  secret: 'website',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: dbUrl
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(multipart());
app.listen(port);
console.log(`movieWebsite start on port ${port}`);

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes.js')(app);