var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose	    = require("mongoose"),
	campground      = require("./models/campground"),
	seedDB 			= require("./seed"),
	comment  		= require("./models/comment"),
	passport 		= require ("passport"),
	localStrategy 	= require("passport-local"),
	user 			= require("./models/user");

app.use(require("express-session")({
	secret :"East or West India is the best",
	resave : false,
	saveUninitialized : false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req, res, next){
		res.locals.currentUser = req.user;
		next();
});
var	commentRoutes = require("./routes/comments");
var	campgroundRoutes = require("./routes/campgrounds");
var	indexRoutes = require("./routes/index");
// ============
// Mongoose code to connect the  database
// ============	
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true,useUnifiedTopology : true});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
// seeding the database with initial data
// seedDB();
//requiring the routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
	console.log("YelpCamp server has started...");
})