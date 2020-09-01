var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware/index");
// =======================
// Commments Route
// =======================
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req,res){
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

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,  function(req, res){
	// lookup and create comment and redirect to campgrond show page
	campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			comment.create(req.body.comment,function(err,comment){
				if (err){
					req.flash("error", "something went wrong");
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
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
});
// comment edit route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
	comment.findById(req.params.comment_id, function(err, foundComment){
		if (err){
			res.redirect("back");
		}
		else {
			res.render("./comments/edit",{campground_id : req.params.id , comment : foundComment});
		}
	})	;
});

// Comment update
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership ,function(req, res){

	comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updateComment){
		if (err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds/"+ req.params.id);
		} 
	} );
});

// Delete comment route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership ,function(req, res){
	comment.findByIdAndRemove(req.params.comment_id,function(err){
		if (err){
			res.redirect("back");
		}
		else{
			req.flash("success", "comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

module.exports = router;