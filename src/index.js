var express = require('express');
var bodyparser = require('body-parser');
var fileUpload = require('express-fileupload');
var mongo = require('mongodb');
var fs = require('fs');
var im = require('imagemagick');
//var sharp = require('sharp');
var mongoClient = mongo.MongoClient;
var app = express();
var db;

app.use(bodyparser.json());
app.use(fileUpload());
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/app", express.static(__dirname + '/public/app'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/lib", express.static(__dirname + '/public/lib'));
app.use("/configuration", express.static(__dirname + '/public/configuration' ));

mongoClient.connect('mongodb://localhost:27017/bfstrings', function(err, database){
    if (err) return console.log(err);
    db = database;

    app.listen(3000, function(){
        console.log('listening on port 3000');
    });
});



app.get('/', function(req,res){
    res.sendFile(__dirname + '/client/')
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
    db.collection('cards').save(req.body, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
});

/*app.post('/api/cards/:id/image', function(req, res){
    var id = mongo.ObjectID(req.params.id);
    var image_type = req.files.image.name.split('.')[1];
    console.log(req.files);
    fs.readFile(req.files.image.data, function(err, data){
        var image = {};
        image.parent_id = id;
        image.active = true;
        db.collection('images').insert(image, function(err, result){
            console.log(result);
            var image_id = result.ops[0]._id;
            db.collection('cards').findOneAndUpdate({"_id":id},{"image_id":image_id }, function(err, result){
                var image_dir = __dirname + "/images/" + id;
                var thumb_dir = __dirname + "/images/" + id + "/thumbs";
                if (!fs.existsSync(image_dir)){
                    fs.mkdirSync(image_dir);
                }
                if (!fs.existsSync(thumb_dir)){
                    fs.mkdirSync(thumb_dir);
                }
                var imageDir = __dirname + "/images/" + id + "/" + image_id + "." + image_type;
                var thumbDir = __dirname + "/images/" + id + "/thumbs/" + image_id + "." + image_type;
                fs.writeFile(imageDir, data, function(err){
                    sharp(req.files.image.data)
                        .resize(200)
                        .toFile(thumbDir, function(err, info)
                        {
                            if(err) console.log(err);
                        });
                    res.redirect('/images/' + id + "/" + image_id );
                })
            })
        })
    })
});*/

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
    db.collection('inventory').find( {"_id" : id}).toArray(function(err,result){
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
    db.collection('inventory').save(req.body, function(err, result){
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

/*app.post('/api/inventory/:id/image', function(req, res){
    var id = mongo.ObjectID(req.params.id);
    var image_type = req.files.image.name.split('.')[1];
    console.log(req.files);
    fs.readFile(req.files.image.data, function(err, data){
        var image = {};
        image.parent_id = id;
        image.active = true;
        db.collection('images').insert(image, function(err, result){
            console.log(result);
            var image_id = result.ops[0]._id;
            db.collection('inventory').findOneAndUpdate({"_id":id},{$push :{"images":image_id} }, function(err, result){
                var image_dir = __dirname + "/images/" + id;
                var thumb_dir = __dirname + "/images/" + id + "/thumbs";
                if (!fs.existsSync(image_dir)){
                    fs.mkdirSync(image_dir);
                }
                if (!fs.existsSync(thumb_dir)){
                    fs.mkdirSync(thumb_dir);
                }
                var imageDir = __dirname + "/images/" + id + "/" + image_id + "." + image_type;
                var thumbDir = __dirname + "/images/" + id + "/thumbs/" + image_id + "." + image_type;
                fs.writeFile(imageDir, data, function(err){
                    sharp(req.files.image.data)
                        .resize(200)
                        .toFile(thumbDir, function(err, info)
                        {
                            if(err) console.log(err);
                        });
                    res.redirect('/images/' + id + "/" + image_id );
                })
            })
        })
    })
});*/



