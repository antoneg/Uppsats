const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'ForumDB',
	multipleStatements: true
});

mysqlConnection.connect((err)=>{
	if(!err) {
		console.log("Connected to ForumDB");
	} else {
		console.log("Connection to ForumDB Failed");
	}
});

module.exports = mysqlConnection;