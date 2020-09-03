var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose	    = require("mongoose"),
	campground      = require("./models/campground"),
	seedDB 			= require("./seed"),
	comment  		= require("./models/comment"),
	passport 		= require ("passport"),
	localStrategy 	= require("passport-local"),
	methodOverride 	= require("method-override"),
	flash 			= require("connect-flash"),
	user 			= require("./models/user");

app.use(require("express-session")({
	secret :"East or West India is the best",
	resave : false,
	saveUninitialized : false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req, res, next){
		res.locals.currentUser = req.user;
		res.locals.error= req.flash("error");
		res.locals.success= req.flash("success");
		next();
});
var	commentRoutes = require("./routes/comments");
var	campgroundRoutes = require("./routes/campgrounds");
var	indexRoutes = require("./routes/index");
// ============
// Mongoose code to connect the  database
// ============	
mongoose.connect("mongodb+srv://Sourabh:SouVin123@yelpcampsourabh.eufnk.mongodb.net/<dbname>?retryWrites=true&w=majority",{
	useFindAndModify:false,
	useNewUrlParser: true,
	useUnifiedTopology : true,
	useCreateIndex : true
}).then(()  => {
	console.log("connected to Database");
}).catch( err => {
	console.log("ERROR:" + err.message);
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
// seeding the database with initial data
// seedDB();
//requiring the routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
	console.log("YelpCamp server has started...");
})