'use strict';

var express = require('express');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var secret = "6z7mfMW1GwKzG2sgsG9icqN1bfcJTooGwIOySP22";
var users = require('../../app/models/user.server.model');
var nodemailer = require('nodemailer');
var Auth = express.Router();
 var options = {
  service: 'Gmail',
  auth: {
    user: 'saurabh.sixthsense@gmail.com',
    pass: 'saurabh2325'
  }
}

var client = nodemailer.createTransport(options);
//User Registration

Auth.post('/newUser', function(req, res){
	//console.log(req.body);
    var userModel = new users();
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
                    if (err.errors.first_name) {
                        res.json({ success: false, message: err.errors.first_name.message }); // Display error in validation (name)
                    }else if (err.errors.last_name) {
                        res.json({ success: false, message: err.errors.last_name.message }); // Display error in validation (name)
                    }else if (err.errors.email) {
                        res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                    }else {
                        res.json({ success: false, message: err }); // Display any other errors with validation
                    }
                }else if (err){
                    // Check if duplication error exists
                    //res.json({ success: false, message: err }); 
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
                res.json({ success: true, data: users, message:'New user saved'});
            }
        });
    }
});

//User login 

Auth.post('/authentication', function(req, res){
    users.findOne({email : req.body.email}).select('_id first_name last_name user_name email password').exec(function(err, user){
        if(err) throw err;
        //console.log(req.body.user_name);
        if(!user){
            res.json({success: false, message: 'Could not authenticate user'});
        }else if(user){
            if(req.body.password){
                var validPassword = user.comparePassword(req.body.password);
            }else{
                res.json({success:false, message:'No password Provided'})
            }
            if(!validPassword){
                res.json({success: false, message: 'Could not authenticate password'});
            }else{
                var token = jwt.sign({_id: user._id, email: user.email}, secret, { expiresIn: '24h'});
                res.json({success: true, message: 'user authenticated', user , token: token});
                //res.json({success: true, message: 'user authenticated'});
            }
        }
    });
});

// get user from token
Auth.post('/me',function(req, res){
  //console.log(req);
  var token = req.body.token || req.body.query || req.headers['x-access-token'];
    
    if(token){
    //veryfy token
        jwt.verify(token, secret , function(err, decoded) {
            if(err){
             res.json({sucess: false, message: "Token Invalid"});
            }else{
             req.decoded = decoded;
             res.send(req.decoded);
            } 
        })
    }else{
      res.json({success: false, message: 'No token provieded'});
    }
});

Auth.get('/permission', function(req, res){
    
  var token = req.body.token || req.body.query || req.headers['x-access-token'];
  if(token){  //veryfy token
        jwt.verify(token, secret , function(err, decoded) {
            if(err){
             res.json({sucess: false, message: "Token Invalid"});
            }else{
                req.decoded = decoded;
                //console.log("new token" + req.decoded.user_name);
                users.findOne({_id : req.decoded._id},function(err, user){
                  if(err) throw err;
                  if(!user){
                      res.json({success:false, message: 'No User has found'});
                  }else{
                      res.json({success: false, data: user})
                  } 
              });
            } 
        })
    }else{
      res.json({success: false, message: 'No token provieded'});
    }
});

// Route to send reset link to the user
    Auth.put('/sendResetLink', function(req, res) {
        users.findOne({ email: req.body.email }).select('email resettoken first_name last_name').exec(function(err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'saurabh.sixthsense@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Username was not found' }); // Return error if username is not found in database
                }else {
                    user.resettoken = jwt.sign({first_name: user.first_name, last_name: user.last_name, email: user.email}, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
                    // Save token to user in database
                    user.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error if cannot connect
                        } else {
                            // Create e-mail object to send to user
                           // console.log(user.resettoken);
                            var email = {
                                from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                to: user.email,
                                subject: 'Reset Password Request',
                                text: 'Hello ' + user.first_name +" "+ user.last_name +', You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8020/boxed/reset/' + user.resettoken,
                                html: 'Hello<strong> ' + user.first_name +" " + user.last_name +'</strong>,<br><br>You recently request a password reset link. Please click on the link below to reset your password:<br><br><a href="http://localhost:8020/boxed/reset/' + user.resettoken + '">http://localhost:8020/boxed/reset/</a>'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console
                                    console.log('sent to: ' + user.email); // Log e-mail 
                                }
                            });
                            res.json({ success: true, message: 'Please check your e-mail for password reset link' }); // Return success message
                        }
                    });
                }
            }
        });
    });

// Route to send reset link to the user
    Auth.put('/resetPassword/:token', function(req, res) {
        var id = req.params.token;
        users.findOne({ resettoken: id }).select('email resettoken first_name last_name').exec(function(err, user) {
            if (err) {
                // Function to send e-mail to myself
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            }else{
                if (!user) {
                    res.json({ success: false, message: 'Email was not found' }); // Return error if username is not found in database
                }else {
                    user.password = req.body.password
                    // Save password to user in database
                    user.save(function(err) {
                        if (err) {
                            res.json({ success: false, message: err }); // Return error if cannot connect
                        } else {
                            //console.log(user.password);
                            var email = {
                                from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                to: user.email,
                                subject: 'Reset Password Confirmation',
                                text: 'Hello ' + user.first_name +""+ user.last_name+ ',Your Password successfully Reset',
                                html: 'Hello<strong> ' + user.first_name +""+ user.last_name+ '</strong>,<br><br>Your Password successfully Reset'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function(err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console
                                    console.log('sent to: ' + user.email); // Log e-mail 
                                }
                            });
                            res.json({ success: true, message: 'Your Password successfully Reset' }); // Return success message
                        }
                    });
                }
            }
        });
    });   
module.exports = Auth;