var express = require('express');
var mongoose = require('mongoose');
var customer = require('../../app/models/user.server.model');
var path = require('path');
var multer  = require('multer');
var Route = express.Router();
var nodemailer = require('nodemailer');
var options = {
  service: 'Gmail',
  auth: {
    user: 'saurabh.sixthsense@gmail.com',
    pass: 'saurabh2325'
  }
}
var client = nodemailer.createTransport(options);
var storage = multer.diskStorage({
  destination: './public/images/users/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage });

Route.post('/uploadUsersFile', upload.single('file'), function(req, res){
    //console.log('Uploade Successful ', req.file, req.body);
    var myFile = req.file;
    var newName = myFile.filename;
    //console.log(myFile);
    res.send(myFile);
});

Route.post('/insertCustomer', function(req, res){
    //console.log(req.body);
    var userModel = new customer();
    userModel.first_name = req.body.first_name;
    userModel.last_name = req.body.last_name;
    userModel.user_name = req.body.user_name;
    userModel.email = req.body.email;
    userModel.password = req.body.password;
    userModel.status = req.body.status;  
    userModel.permission = req.body.permission;
    userModel.description = req.body.description;
    userModel.contact_no_1 = req.body.contact_no_1;
    userModel.contact_no_2 = req.body.contact_no_2;  
    userModel.address = req.body.address;
    userModel.country = req.body.country;
    userModel.state = req.body.state;
    userModel.city = req.body.city;
    userModel.create_date = Date.now();
    userModel.user_img = req.body.user_img;
    userModel.user_type = req.body.user_type;
    userModel.social_id = req.body.social_id;
    if(req.body.email == null || req.body.email == '' || req.body.first_name == null || req.body.first_name == '' || req.body.last_name == null || req.body.last_name == '' || req.body.user_name == null || req.body.user_name == ''){ 
      res.json({ success: false, message:'Ensure name, userName, email, and password were provided'});
   
    }else{
        userModel.save(function(err, users){    
            if (err) {
          // Check if any validation errors exists (from user model)
                if (err.errors !== null && err.errors !== undefined ) {
                    if (err.errors.full_name) {
                        res.json({ success: false, message: err.errors.full_name.message }); // Display error in validation (name)
                    }else if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                    }else {
                        res.json({ success: false, message: err }); // Display any other errors with validation
                    }
                }else if (err){
                    // Check if duplication error exists 
                    if (err.code === 11000){
                        res.json({ success: false, message: 'That username and e-mail is already taken' }); // Display error if username already taken     
                    }else{
                        res.json({ success: false, message: err }); // Display any other error
                    }  
                }
            }else{
                var email = {
                                from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                to: users.email,
                                subject: 'Signup Confirmation',
                                text: 'Hello ' + users.first_name +" "+ users.last_name + ',Wellcome to Collection Application  and thanks for signing up!',
                                html: 'Hello<strong> ' + users.first_name +" "+ users.last_name + '</strong>,<br><br>Wellcome to Collection Application  and thanks for signing up!'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console
                                    console.log('sent to: ' + users.email); // Log e-mail 
                                }
                            });
                res.json({ success: true, message:'New user saved'});
            }
        });
    }
});
  
// List of Customer
Route.get('/customerList', function(req, res){
    customer.find({permission: 'User'}, function(err, customerList){
        if(err){
            res.json({success: false, message: 'Customer not found'});
        }else{
            res.json({success: true, data: customerList});   
        }
    })
});

// View of Customer

Route.get('/customerDetail/:id', function(req, res){
    var id = req.params.id;
    customer.findOne({_id: id}, function(err, customerDetail){
        if(err){
            res.json({success: false, message: 'Customer Detail not found'});
        }
        else{
            res.json({success: true, data: customerDetail}); 
        }
    });
});

Route.get('/userDetail/:user_name', function(req, res){
    var user_name = req.params.user_name;
    customer.findOne({user_name: user_name}, function(err, userDetail){
        if(err){
            res.json({success: false, message: 'User Detail not found'});
        }
        else{
            if(userDetail){
                res.json({success: true, data: userDetail});  
            }else{
                res.json({success: false, message: 'User Detail not found'}); 
            }
        }
    });
});

// Update the customer Detail
  
Route.put('/updateCustomer/:id', function(req, res){
    var id = req.params.id;
    //console.log(id);
    customer.findById(id, function(err, customer){
        if(err){
          res.json({success: false, message: 'Customer Detail not found'});
        }
        else{
            customer.update(req.body ,function(err, success){
                if(err){
                    res.json({success: false, message: err});
                }
                else{
                    res.json({success: true, data: 'Customer update successfully'});
                }
            });
        }
    })
}); 

// Delete an Customer

Route.delete('/deleteCustomer/:id', function(req, res){
    var id = req.params.id;
    customer.remove({_id: id}, function(err, response){
        if(err){
            res.json({success: false, message: err});
        }
        else{
            res.json({success: true, data: 'success on deleting customer'});
        }
    });
});
module.exports = Route;