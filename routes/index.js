var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");
var flash= require("connect-flash");


// Get route to landing page
router.get("/",function(req,res){
	res.render("landing");
});

//Authentication routes

router.get("/register",function(req, res){
	res.render("register");
});
router.post("/register",function(req, res){
	user.register(new user({username : req.body.username}), req.body.password, function(err,user){
		if (err){
			console.log(err);
			return res.render('register',{error : err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Successfully Signed Up! Nice to meet you " + req.body.username);
			res.redirect("/campgrounds");
		})
	});
});

// Login Routes

router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect : "/login"
}),function(req , res){
	req.flash("success","Successfully Signed Up! Nice to meet you " + req.body.username);
});
	 
router.get("/login",function(req, res){
	res.render("login");
});

// logout routes
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","Log you out");
	res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};
module.exports = router; 