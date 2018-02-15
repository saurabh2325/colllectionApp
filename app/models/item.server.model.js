'use strict'

// Module dependencies.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Audio Schema

var itemSchema = new Schema({
    
    item_number: {
        type: String,
        default:'None',
        trim: true
       },
    item_name:{
        type: String,
        required: true,
       },
    collection_name: {
        type: String,
        default: 'None',
       },
    description: {
        type: String,
        default:'',
        trim: true
       },
    password_protected: {
        type: String,
        default:'Public',
        trim: true
       },
    price:{
        type: Number,
        default:'',
        trim: true
       },    
    optional_field_description: {
        type: String,
        default:'',
        trim: true
       },
    optional_field_name : {
        type: String,
        default:'',
        trim: true
       },
    item_thumb: {
        type: String,
        default:'userDefault.png'
       },
    user_id: {
        type: String,
        default:'',
        trim: true
       },
    create_date:{ 
        type: Date,
        format: 'YYYY-MM-DD', 
        default: Date.now
       }
});

// Expose the model to other object (similar to a 'public' setter).

 module.exports = mongoose.model('tbl_items', itemSchema);

