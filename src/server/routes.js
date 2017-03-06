var express = require('express');
var app = express();

app.get('/', function(res,rep){
    res.json('{id:1}')
});

app.listen(3000, function(){
   console.log('listening on port 3000');
});