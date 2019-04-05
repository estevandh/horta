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

var conStr = 'mysql://root@localhost:3306/hortaurbana';

/* GET users listing. */
router.post('/', function(req, res, next) {
	console.log(req.body.d.Temperatura);
	console.log(req.body.d.Umidade);

	const connection = mysql.createConnection(conStr);
	var temp = req.body.d.Temperatura;
	var umi = req.body.d.Umidade;
	
	if(typeof req.body.d.Temperatura!="undefined"){
	var sql = 'INSERT INTO medicao (id_medicao, valor_temp, data_horario) VALUES (NULL ,"'+temp+'", NOW());';
	console.log(sql);
	}else{
		var sql = 'UPDATE medicao set valor_umi= '+umi+' order by id_medicao desc limit 1;';
		console.log(sql);
	}
	
	connection.connect();
	
  	connection.query(sql, function(error, results, fields) {
		console.log(error);
		//console.log(results);
  		//res.location('http://localhost:3000/horta/'+results.insertId);
		res.status(201).send();
	});
  	connection.end();
});

router.get('/', function(request, response, next) {
	var sql = 'SELECT * FROM medicao;';
	const connection = mysql.createConnection(conStr);
	connection.connect();
		connection.query(sql, function(error, results, fields) {
		response.render('medicoes/index', {'medicoes': results});
	});
	connection.end();
});

router.get('/tempo', function(request, response, next) {
	var horas = request.query.horas;
	var minutos = request.query.minutos;
	//console.log(horas);
	//console.log(minutos);
	var conv1 = horas * 3600000;
	var conv2 = minutos * 60000;
	var miliseg = conv1 + conv2;
	console.log(miliseg);
	response.redirect('/medicoes');
});

module.exports = router;