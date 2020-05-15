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


router.post('/', function(req, res, next) {
	console.log(req.body.d.temperatura);
	console.log(req.body.d.umidade);

	const connection = mysql.createConnection(conStr);
	var temp = req.body.d.temperatura;
	var umi = req.body.d.umidade;
	
	if(typeof req.body.d.temperatura!="undefined"){
	var sql = 'INSERT INTO medicao (id_medicao, valor_temp, data_horario) VALUES (NULL ,"'+temp+'", NOW());';
	console.log(sql);
	}else{
		var sql = 'UPDATE medicao set valor_umi= '+umi+' order by id_medicao desc limit 1;';
		console.log(sql);
	}
	
	connection.connect();
	
  	connection.query(sql, function(error, results, fields) {
		console.log(error);
		res.status(201).send();
	});
  	connection.end();
});


router.get('/', function(request, response, next) {
	var sql = 'SELECT valor_temp FROM medicao order by id_medicao desc limit 7;';
	var sql2 = 'SELECT data_horario FROM medicao order by id_medicao desc limit 7;';
	var sql3 = 'SELECT valor_umi FROM medicao order by id_medicao desc limit 7;';
	
	const connection = mysql.createConnection(conStr);
	const connection2 = mysql.createConnection(conStr);
	const connection3 = mysql.createConnection(conStr);
	
		connection.connect();
		connection.query(sql, function(error, results, fields) {
				connection2.connect();
				connection2.query(sql2, function(error2, results2, fields2) {
						connection3.connect();
						connection3.query(sql3, function(error3, results3, fields3) {
								response.render('medicoes', {temperaturas : results, datas : results2, umidades: results3});
								});
						});
				});
	
	connection.end();
});


router.post('/tempo', function(request, response, next) {
	var horas = request.body.horas;
	var delay = horas * 10000;
	//3600000
	
	if(horas) {
		axios.post('http://localhost:1880/medicao', {
		delay: delay
		})
		.then(function (response) {
		console.log(response);
		})
		.catch(function (error) {
		console.log(error);
	});
		
	}
	response.redirect('/medicoes');
		
});


module.exports = router;