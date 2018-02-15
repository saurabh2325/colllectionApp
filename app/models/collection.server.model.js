'use strict'

// Module dependencies.

var mongoose = require('mongoose');
var titlize = require('mongoose-title-case');
var Schema = mongoose.Schema;

//Audio Schema

var collectionSchema = new Schema({
    collection_name:{
        type: String,
        required: true,
       },
    description: {
        type: String,
        default:'',
        trim: true
       },
    user_id: {
        type: String,
        default:'',
        trim: true
       },
    protected: {
        type: String,
        default:'Public',
        trim: true
      },
    create_date:{ 
        type: Date,
        format: 'YYYY-MM-DD', 
        default: Date.now
      },
    opt_field: {
        type: String,
        default:'',
        trim: true
      }  
});

// Attach some mongoose hooks 
collectionSchema.plugin(titlize, {
    paths: ['opt_field'] // Array of paths 
});

// Expose the model to other object (similar to a 'public' setter).
 module.exports = mongoose.model('tbl_collection', collectionSchema);