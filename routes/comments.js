var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");
// =======================
// Commments Route
// =======================
router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
	// find campground by id and send the data 
	campground.findById(req.params.id,function(err, campground){
		if (err){
			console.log(err);
		}
		else {
		res.render("comments/new",{campground : campground});	
		}
	})
	
});

router.post("/campgrounds/:id/comments",isLoggedIn,  function(req, res){
	// lookup and create comment and redirect to campgrond show page
	campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			comment.create(req.body.comment,function(err,comment){
				if (err){
					console.log(err);
				}
				else{
					// add user name and id to the comment
					// then save the comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
});
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};
module.exports = router;