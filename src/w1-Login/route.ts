// var express = require('express');
import express, {Request, Response, NextFunction} from "express"
const router = express.Router();
const passport = require('passport');

// Welcome Page
router.get('/welcome', authorization, (req, res) => res.send('Protected Route'));

router.get('/users/login', function(req:Request, res:Response, next:NextFunction) {
 let message =  req.flash('error')
  res.send(message[0])
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;