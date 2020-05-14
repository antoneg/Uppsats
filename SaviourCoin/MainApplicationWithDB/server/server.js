const express = require("express")
const bodyParser = require("body-parser")
const mysqlConnection = require("./connection")
const BlogsRoutes = require("./routes/blogs")
const cors = require('cors')

var app = express();

app.use(cors())

app.use(bodyParser.json());

app.use("/blogs", BlogsRoutes);

app.listen(3000);