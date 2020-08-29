var express 		= require("express");
	app 			= express();
	bodyParser 		= require("body-parser");
	mongoose	    = require("mongoose");
	campground      = require("./models/campground");
	seedDB 			= require("./seed");
	comment  		= require("./models/comment");

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true,useUnifiedTopology : true});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
seedDB();

//Schema Setup


// campground.create(
// 	{
// 		name : "Salomon Creesk", 
// 		image : "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350",
// 		description : "This is a huge granite hill , no bathrooms .. No water .. Beautiful granite"
// 	},
// 	function(err,campground){
// 		if(err){
// 			console.log(err);
// 		}
// 		else 
// 			console.log("NEWLY CREATED CAMPGROUND:");
// 			console.log(campground);
// 	}
// 	);

app.get("/",function(req,res){
	res.render("landing");
});

//INDEX	 - show all campgrounds
app.get("/campgrounds",function(req,res){
	//retrive all the data from db
	campground.find({},function(err,allcampgrounds){
		if (err){
			console.log(err);
		}
		else
		{
			//render the file
	res.render("campgrounds/index",{campgrounds : allcampgrounds});
		}
	});
	
});
// NEW - Show form to create campground
app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new.ejs")
});
// CREATE ADD NEW campground
app.post("/campgrounds",function(req,res){
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
app.get("/campgrounds/:id",function(req, res){
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
// =======================
// Commments Route
// =======================
app.get("/campgrounds/:id/comments/new",function(req,res){
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

app.post("/campgrounds/:id/comments", function(req, res){
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
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
});

app.listen(3000,function(){
	console.log("YelpCamp server has started...");
})