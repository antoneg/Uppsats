const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection")


Router.post('/new', function(req, res, next) {
    mysqlConnection.query('INSERT INTO blogs (title, body) values(\'' + req.body.title + '\',\'' + req.body.body + '\')', (error, results, fields) => {
	    if(!error) {
				res.send(results);
			} else {
				console.log(error);
			}
    });
});

Router.get("/", (req, res) => {
	mysqlConnection.query("SELECT * from blogs", (err, rows, fields) => {
		if(!err) {
			res.send(rows);
		} else {
			console.log(err);
		}
	});
});

module.exports = Router;