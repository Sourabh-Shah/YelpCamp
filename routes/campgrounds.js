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
router.get("/campgrounds/new",isLoggedIn ,function(req,res){
	res.render("campgrounds/new.ejs")
});
// CREATE ADD NEW campground
router.post("/campgrounds",isLoggedIn,function(req,res){
	//get data from form 
	//add data to campground array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
				id : req.user._id,
				username : req.user.username
			}
	var newCampground = {name : name , image : image, description : desc, author : author}; 
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
// Edit campground route
router.get("/campgrounds/:id/edit",checkCampgroundOwnership, function(req, res){
	// is user logged in at all
	// does user own the campground
	campground.findById(req.params.id ,function(err, foundCampground){
	res.render("campgrounds/edit",{campground : foundCampground});
	});
});
// Update campground route
router.put("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
	// find and update and go to show page
	campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
		if (err){
			res.redirect("/campgrounds");
			console.log(err);
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//Destroy campground route
router.delete("/campgrounds/:id",checkCampgroundOwnership, function(req, res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if (err){
			res.redirect("/campgrounds");
		}else {
			res.redirect("/campgrounds");}
	})
});


//middleware
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function checkCampgroundOwnership(req, res, next){
	if (req.isAuthenticated()){
		campground.findById(req.params.id, function(err, foundCampground){
			if (err){
				res.redirect("/campgrounds");
			}else {
				if (foundCampground.author.id.equals(req.user._id)){
					next()
				}
				else{
					res.redirect("back");
				}
			}
		});
	}
	else {
		res.redirect("back");
	}
}
module.exports = router;