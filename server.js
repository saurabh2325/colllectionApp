
var express = require('express');
var app = express();
//var port = process.env.PORT || '8000';
var path = require('path');
var morgan = require('morgan');
var expressValidator = require('express-validator');
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Users = require('./app/routes/user.server.route');
var Collection = require('./app/routes/collection.server.route');
var Item = require('./app/routes/item.server.route');
var Customer = require('./app/routes/customer.server.route');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(__dirname + '/public'));
app.use('/', Users);
app.use('/', Collection);
app.use('/', Item);
app.use('/', Customer);

var db = "mongodb://testcollection:test123@ds151820.mlab.com:51820/collectionapp";
mongoose.connect(db, function(err, response){
  if(err){
    console.log(' Failed to connected to ' + db);
  }
  else{
    console.log('Connected to' + db);
  }
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});
  
/*app.listen(port, function(){
  console.log('Running the server on port:'+ port);
});*/
app.listen(3003, '172.104.42.153');
console.log('Running the server on port:http://172.104.42.153:3003');
