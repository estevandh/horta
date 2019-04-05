var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var bodyparser = require('body-parser');

var bodyParserXml = require('body-parser-xml'); //manda solicitar os body parsers

var indexRouter = require('./routes/index');
var medicoesRouter = require('./routes/medicoes');
var atuacoesRouter = require('./routes/atuacoes');

var app = express();

//database
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hortaurbana'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/medicoes', medicoesRouter);
app.use('/atuacoes', atuacoesRouter);
app.use("/",express.static("public"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(bodyparser.json());

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
//var settings = {
 //   httpAdminRoot:"/red",
 // httpNodeRoot: "/api",
 //   userDir:"/home/nol/.nodered/",
 //   functionGlobalContext: { }    // enables global context
//};

// Initialise the runtime with a server and settings
//RED.init(server,settings);

// Serve the editor UI from /red
//app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
//app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(8000);

// Start the runtime
//RED.start();

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
