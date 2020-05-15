var express = require('express');
var router = express.Router();
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var bodyparser = require('body-parser');
var bodyParserXml = require('body-parser-xml');
var mysql = require('mysql');
const axios = require('axios');
const https = require('https');
var RED = require('node-red');
var Chart = require('chart.js');

var conStr = 'mysql://root@localhost:3306/hortaurbana';


router.get('/', function(request, response, next) {
	var sql = 'SELECT valor_temp FROM medicao order by id_medicao desc limit 7;';
	var sql2 = 'SELECT data_horario FROM medicao order by id_medicao desc limit 7;';
	
	const connection = mysql.createConnection(conStr);
	const connection2 = mysql.createConnection(conStr);
	
	connection.connect();
		connection.query(sql, function(error, results, fields) {
				connection2.connect();
				connection2.query(sql2, function(error2, results2, fields2) {
					response.render('index', {temperaturas : results, datas : results2});
						});
	});
	connection.end();
});


router.get('/', function(request, response, next) {
	var sql = 'SELECT valor_temp FROM medicao;';
	const connection = mysql.createConnection(conStr);
	connection.connect();
		connection.query(sql, function(error, results, fields) {
		response.render('index', {'medicoes': results});
	});
	connection.end();
});

module.exports = router;