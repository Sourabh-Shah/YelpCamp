var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
//INDEX	 - show all campgrounds
router.get("/campgrounds",function(req,res){
	//retrive all the data from db
	campground.find({},function(err,allcampgrounds){
		if (err){
			console.log(err);
		}
		else
		{
			//render the file
	res.render("campgrounds/index",{campgrounds : allcampgrounds, currentUser : req.user});
		}
	});
	
});
// NEW - Show form to create campground
router.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new.ejs")
});
// CREATE ADD NEW campground
router.post("/campgrounds",function(req,res){
	//get data from form 
	//add data to campground array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name : name , image : image, description : desc}; 
	campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//redirect back to the campgrounds page
		res.redirect("/campgrounds");
		} 
	});
});
// SHOW - shows more info about one particular campground
router.get("/campgrounds/:id",function(req, res){
	// find the campground with provided id
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err);
		}
		else{
			// render show template with that campground
			res.render("campgrounds/show",{campground : foundCampground});
		}
	});
	// show template with that campground
	
});
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};
module.exports = router;