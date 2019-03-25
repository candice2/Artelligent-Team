const express = require('express');
const app = express();
const http = require('http').Server(app);
const router = require('./routes/router');
const bodyParser = require('body-parser');

app.use('/home', express.static('sketcher'));
app.use(bodyParser.json());
app.use('/',router);



http.listen(3000, function () {
    console.log('listening on *:3000');
});