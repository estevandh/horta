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
	var sql = 'SELECT data_horario FROM irrigacao order by id_irrigacao desc limit 7;';
	
	const connection = mysql.createConnection(conStr);
	
		connection.connect();
		connection.query(sql, function(error, results, fields) {
								response.render('irrigacoes/index', {datas : results});
								});
	connection.end();
});


router.post('/irriga', function(request, response, next) {
	var status = request.body.status;
	console.log(status);
	
	if(status == 'true') {
		axios.post('http://localhost:1880/irriga', {
		status: "true"
		})
		.then(function (response) {
		console.log(response);
		})
		.catch(function (error) {
		console.log(error);
	});		
	}
	else if(status == 'false') {
		var sql = 'INSERT INTO irrigacao (id_irrigacao, data_horario) VALUES (null, NOW());';
		
		axios.post('http://localhost:1880/irriga', {
		status: "false"
		})
		.then(function (response) {
		console.log(response);
		})
		.catch(function (error) {
		console.log(error);
	});		
	}	
	
	const connection = mysql.createConnection(conStr);
	connection.connect();
  	connection.query(sql, function(error, results, fields) {
	});
	connection.end();
	
	
	response.redirect('/irrigacao');
  				
});


router.post('/irrigacao', function(request, response, next) {
	var horas = request.body.horas;
	var delay = horas * 1000;
	//3600000 = 1 hora
	//86400000 = 1 dia
	
	if(horas) {
		var sql = 'INSERT INTO irrigacao (id_irrigacao, data_horario) VALUES (null, NOW());';
		
		axios.post('http://localhost:1880/ativairri', {
		})
		.then(function (response) {
		console.log(response);
		})
		.catch(function (error) {
		console.log(error);
		});
		
		axios.post('http://localhost:1880/irrigacao', {
		delay: delay
		})
		.then(function (response) {
		console.log(response);
		})
		.catch(function (error) {
		console.log(error);
		});
		
	}
	const connection = mysql.createConnection(conStr);
	connection.connect();
  	connection.query(sql, function(error, results, fields) {

	});
	
	response.redirect('/irrigacao');
  	connection.end();			
});

module.exports = router;