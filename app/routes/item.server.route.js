var express = require('express');
var mongoose = require('mongoose');
var item = require('../../app/models/item.server.model');
var path = require('path');
var multer  = require('multer');
var Route = express.Router();

var storage = multer.diskStorage({
  destination: './public/images/item/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage });

Route.post('/uploadItemImgFile', upload.single('file'), function(req, res){
    //console.log('Uploade Successful ', req.file, req.body);
    var myFile = req.file;
    var newName = myFile.filename;
    //console.log(myFile);
    res.send(myFile);
});
  
  //SAVE ITEM IN DATABASE

Route.post('/insertItem', function(req, res){
    //console.log(req.body);
    var itemModel = new item();
    itemModel.item_number = req.body.item_number;
	itemModel.item_name = req.body.item_name;
    itemModel.collection_name = req.body.collection_name;
    itemModel.price = req.body.price;   
    itemModel.description = req.body.description;
    itemModel.password_protected = req.body.password_protected; 
    itemModel.optional_field_name = req.body.optional_field_name;
    itemModel.optional_field_description = req.body.optional_field_description;
    itemModel.item_thumb = req.body.item_thumb;
    itemModel.user_id = req.body.user_id;
    itemModel.create_date = req.body.create_date;
    itemModel.save(function(err, itemDetail){
        if(err){
            res.json({ success: false, message: err });
        }else{
        	res.json({ success: true, data: itemDetail , message:'New item detail saved'});
        }
    })
});

// List of Item

Route.get('/itemList', function(req, res){
    item.find({}, function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});

// List of Item

Route.get('/itemList/:id', function(req, res){
     var id = req.params.id;
    item.find({user_id: id}, function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});

Route.get('/publicItemList', function(req, res){
     var id = req.params.id;
    item.find({password_protected: "Public"}, function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});


Route.get('/publicItemList/:id', function(req, res){
     var id = req.params.id;
    item.find({user_id: id , password_protected: "Public"}, function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});
Route.get('/privateItemList/:id', function(req, res){
     var id = req.params.id;
    item.find({user_id: id , password_protected: "Private"}, function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});
// List of Item

Route.get('/collectionItemList/:id', function(req, res){
     var id = req.params.id;
    item.find({collection_name: id}, function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});

// List of Item

Route.get('/publicCollectionItemList/:id', function(req, res){
    var id = req.params.id;
    item.find({collection_name: id, password_protected: 'Public'}).select('_id item_name collection_name price optional_field_description optional_field_name item_thumb').exec(function(err, itemList){
        if(err){
            res.json({success: false, message: 'Item not found'});
        }else{
            res.json({success: true, data: itemList});   
        }
    })
});

// View of Item

Route.get('/itemDetail/:id', function(req, res){
    var id = req.params.id;
    item.findOne({_id: id}, function(err, itemDetail){
        if(err){
            res.json({success: false, message: 'Item Detail not found'});
        }
        else{
            res.json({success: true, data: itemDetail}); 
        }
    });
});

// Update Item
  
Route.put('/updateItem/:id', function(req, res){
    var id = req.params.id;
    //console.log(id);
    item.findById(id, function(err, item){
        if(err){
          res.json({success: false, message: 'Item not found'});
        }
        else{
            item.update(req.body ,function(err, success){
                if(err){
                    res.json({success: false, message: err});
                }
                else{
                    res.json({success: true, data: 'Item update successfully'});
                }
            });
        }
    })
});

// Delete an Item

Route.delete('/deleteItem/:id', function(req, res){
    var id = req.params.id;
    item.remove({_id: id}, function(err, response){
        if(err){
            res.json({success: false, message: err});
        }
        else{
            res.json({success: true, data: 'Success on deleting item'});
        }
    });
});
module.exports = Route;