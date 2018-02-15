var express = require('express');
var mongoose = require('mongoose');
var collection = require('../../app/models/collection.server.model');
var Route = express.Router();
  
//Save Collection

Route.post('/insertCollection', function(req, res){
    //console.log(req.body);
    var collectionModel = new collection();
    collectionModel.collection_name = req.body.collection_name;
	collectionModel.description = req.body.description;
    collectionModel.protected = req.body.protected;
    collectionModel.opt_field = req.body.opt_field;
    collectionModel.user_id = req.body.user_id;
    collectionModel.create_date = new Date();
    collectionModel.save(function(err, CollectionDetail){
        if(err){
            res.json({ success: false, message: err });
        }else{
        	res.json({ success: true, data: CollectionDetail , message:'New collection saved'});
        }
    })
});

// List of Collection

Route.get('/collectionList', function(req, res){
    collection.find({}, function(err, collectionList){
        if(err){
            res.json({success: false, message: 'Collection not found'});
        }else{
            res.json({success: true, data: collectionList});   
        }
    })
});

Route.get('/publicCollectionList', function(req, res){
    collection.find({protected : 'Public'}).select('_id collection_name protected').exec(function(err, collectionList){
        if(err){
            res.json({success: false, message: 'Collection not found'});
        }else{
            res.json({success: true, data: collectionList});   
        }
    })
});

// List of User Wise Collection

Route.get('/collectionList/:uid', function(req, res){
    var id = req.params.uid;
    console.log(id);
    collection.find({user_id: id}, function(err, collectionList){
        if(err){
            res.json({success: false, message: 'Collection not found'});
        }else{
            res.json({success: true, data: collectionList});   
        }
    })
});

// View of Collection

Route.get('/collectionDetail/:id', function(req, res){
    var id = req.params.id;
    collection.findOne({_id: id}, function(err, CollectionDetail){
        if(err){
            res.json({success: false, message: 'Collection Detail not found'});
        }
        else{
            res.json({success: true, data: CollectionDetail}); 
        }
    });
});

// Update the Collection
  
Route.put('/updateCollection/:id', function(req, res){
    var id = req.params.id;
    //console.log(id);
    collection.findById(id, function(err, collection){
        if(err){
          res.json({success: false, message: 'Collection not found'});
        }
        else{
            collection.update(req.body ,function(err, success){
                if(err){
                    res.json({success: false, message: err});
                }
                else{
                    res.json({success: true, data: 'Collection update successfully'});
                }
            });
        }
    })
});

// Delete an Collection

Route.delete('/deleteCollection/:id', function(req, res){
    var id = req.params.id;
    collection.remove({_id: id}, function(err, response){
        if(err){
            res.json({success: false, message: err});
        }
        else{
            res.json({success: true, data: 'success on deleting collection'});
        }
    });
});
module.exports = Route;