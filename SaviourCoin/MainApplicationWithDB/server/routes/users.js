const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection")


Router.post('/new', function(request, response, next) {
	if (request.body.username && request.body.address && request.body.password) {
	  mysqlConnection.query('INSERT INTO users (username, address, password) VALUES (?, ?, MD5(?))', 
	  	[request.body.username, request.body.address, request.body.password], (error, results, fields) => {
	    if(!error) {
				response.send(results);
			} else {
				response.send(error);
				console.log(error);
			}
	  });
  } else {
		response.send(JSON.parse('{"error":"You have not entered a username and a password."}'));
	}
});


Router.post('/auth', function(request, response) {
	if (request.body.username && request.body.password) {
		mysqlConnection.query('SELECT * FROM users WHERE username = ? AND password = MD5(?);', 
			[request.body.username, request.body.password], function(error, results, fields) {
			if(!error) {
				response.send(results);
			} else {
				console.log(error);
			}
		});
	} else {
		response.send(JSON.parse('{"error":"You have not entered username, address and password."}'));
	}

});

Router.get("/", (req, res) => {
	mysqlConnection.query("SELECT * from users", (error, result, fields) => {
		if(!error) {
			res.send(result);
		} else {
			console.log(error);
		}
	});
});

module.exports = Router;