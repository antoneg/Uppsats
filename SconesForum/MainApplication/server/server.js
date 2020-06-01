const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./connection");
const UsersRoutes = require("./routes/users");
const cors = require('cors');
const session = require('express-session');

var app = express();

app.use(cors());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());

app.use("/users", UsersRoutes);

app.listen(3000);