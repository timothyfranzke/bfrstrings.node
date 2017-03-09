var express = require('express');
var bodyparser = require('body-parser');
var fileUpload = require('express-fileupload');
var mongo = require('mongodb');
var fs = require('fs');
//var im = require('imagemagick');
//var sharp = require('sharp');
var mongoClient = mongo.MongoClient;
var app = express();
var db;

app.use(bodyparser.json({limit: '50mb'}));
app.use(fileUpload());
app.use("/image", express.static(__dirname + '/images'));
app.use("/css", express.static(__dirname + '/public/site/css'));
app.use("/app", express.static(__dirname + '/public/site/app'));
app.use("/img", express.static(__dirname + '/public/site/img'));
app.use("/js", express.static(__dirname + '/public/site/js'));
app.use("/lib", express.static(__dirname + '/public/site/lib'));
app.use("/configuration", express.static(__dirname + '/public/site/configuration' ));

app.use("/admin/css", express.static(__dirname + '/public/admin/css'));
app.use("/admin/app", express.static(__dirname + '/public/admin/app'));
app.use("/admin/img", express.static(__dirname + '/public/admin/img'));
app.use("/admin/js", express.static(__dirname + '/public/admin/js'));
app.use("/admin/lib", express.static(__dirname + '/public/admin/lib'));
mongoClient.connect('mongodb://localhost:27017/bfstrings', function(err, database){
    if (err) return console.log(err);
    db = database;

    app.listen(3000, function(){
        console.log('listening on port 3000');

    });
});



app.get('/', function(req,res){
    res.sendFile(__dirname + '/public/site/')
});
app.get('/admin', function(req,res){
    res.sendFile(__dirname + '/public/admin/')
});

app.get('/:uid', function(req,res){
   res.json('{id:' + req.params.uid + '}')
});

app.get('/api/cards/:id', function(req,res){
    var id = mongo.ObjectID(req.params.id);
    db.collection('cards').find( {"_id" : id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.get('/api/events', function(req,res){
    db.collection('events').find({"active":true}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.get('/api/cards', function(req,res){
   db.collection('cards').find({"active":true}).toArray(function(err,result){
       if (err) return console.log(err);

       res.json(result);
   })
});

app.post('/api/cards', function(req,res){
    req.body.active = true;
    db.collection('cards').insert(req.body, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.post('/api/cards/:id/image', function(req, res){
    console.log(req);
    var id = mongo.ObjectID(req.params.id);
    var imageBody = req.body;
    var image = {};
    image.parent_id = id;
    image.active = true;
    db.collection('images').insert(image, function(err, result){
        var image_id = result.ops[0]._id;
        db.collection('cards').findOneAndUpdate({"_id":id},{$push :{"images":image_id} }, function(err, updateResult){
            var image_dir = __dirname + "/images/" + id;
            if (!fs.existsSync(image_dir)){
                fs.mkdirSync(image_dir);
            }
            var imageDir = __dirname + "/images/" + id + "/" + image_id + ".png";

            var binaryData = new Buffer(imageBody.base64.full, 'base64').toString('binary');

            fs.writeFile(imageDir, binaryData, "binary", function(err) {
                console.log("error!");
            });
            res.json(result);
        });
    });
});

app.put('/api/cards/:id', function(req, res){
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;
    db.collection('cards').findOneAndUpdate({"_id":id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);
        res.json(result);
    })
});

app.delete('/api/cards/:id', function(req, res){
    var id = mongo.ObjectID(req.params.id);
   db.collection('cards').findOneAndUpdate({"_id":id}, {$set : {"active":false}}, function(err, result){
       if (err) return console.log(err);

       res.json(result);
   })
});

app.get('/api/inventory/:id', function(req,res){
    var id = mongo.ObjectID(req.params.id);
    db.collection('inventory').findOne( {"_id" : id},function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.get('/api/inventory', function(req,res){
    db.collection('inventory').find({"active":true}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.post('/api/inventory', function(req,res){
    req.body.active = true;
    db.collection('inventory').insert(req.body, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.put('/api/inventory/:id', function(req, res){
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;
    db.collection('inventory').findOneAndUpdate({"_id":id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);
        res.json(result);
    })
});

app.delete('/api/inventory/:id', function(req, res){
    var id = mongo.ObjectID(req.params.id);
    db.collection('inventory').findOneAndUpdate({"_id":id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
});

app.post('/api/inventory/:id/image', function(req, res){
    console.log(req);
    var id = mongo.ObjectID(req.params.id);
    var imageBody = req.body;
    var image = {};
    image.parent_id = id;
    image.active = true;
    db.collection('images').insert(image, function(err, result){
        var image_id = result.ops[0]._id;
        db.collection('inventory').findOneAndUpdate({"_id":id},{$push :{"images":image_id} }, function(err, updateResult){
            var image_dir = __dirname + "/images/" + id;
            var thumb_dir = __dirname + "/images/" + id + "/thumbs";
            if (!fs.existsSync(image_dir)){
                fs.mkdirSync(image_dir);
            }
            if (!fs.existsSync(thumb_dir)){
                fs.mkdirSync(thumb_dir);
            }
            var imageDir = __dirname + "/images/" + id + "/" + image_id + ".png";
            var thumbDir = __dirname + "/images/" + id + "/thumbs/" + image_id + ".png";

            var binaryData = new Buffer(imageBody.base64.full, 'base64').toString('binary');
            var thumbBinaryData = new Buffer(imageBody.base64.thumb, 'base64').toString('binary');

            fs.writeFile(imageDir, binaryData, "binary", function(err) {
                //console.log(err); // writes out file without error, but it's not a valid image
            });
            fs.writeFile(thumbDir, thumbBinaryData, "binary", function(err) {
                //console.log(err); // writes out file without error, but it's not a valid image
            });
            res.json(result);
        });
    });
});



