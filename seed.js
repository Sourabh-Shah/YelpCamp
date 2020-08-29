var mongoose = require("mongoose");
var campground = require("./models/campground");
var comment = require("./models/comment");
var data = [
	{
		name : "Cloud's Rest",
		image :"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350",
		description : "You can see the world best places only by booking your flights at a very cheap price on American Airlines Flights Booking. Tickets booked on this toll-free booking line are always cost-effective and can give you a large amount for future travel.When you look up for Locksmith Near Me and choose our services, we can surely assure you of one thing that you will get quality assured services. Our locksmiths are trained and certified professionals who are serving many clients for over a decade now. "
	},
	{
		name : "Desert Mesa",
		image :"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
		description : "You can see the world best places only by booking your flights at a very cheap price on American Airlines Flights Booking. Tickets booked on this toll-free booking line are always cost-effective and can give you a large amount for future travel. When you look up for Locksmith Near Me and choose our services, we can surely assure you of one thing that you will get quality assured services. Our locksmiths are trained and certified professionals who are serving many clients for over a decade now."
	},
	{
		name : "Canyon Floor",
		image :"https://images.pexels.com/photos/1309584/pexels-photo-1309584.jpeg?auto=compress&cs=tinysrgb&h=350",
		description : "You can see the world best places only by booking your flights at a very cheap price on American Airlines Flights Booking. Tickets booked on this toll-free booking line are always cost-effective and can give you a large amount for future travel. When you look up for Locksmith Near Me and choose our services, we can surely assure you of one thing that you will get quality assured services. Our locksmiths are trained and certified professionals who are serving many clients for over a decade now."
	}
];
function seedDB(){
	campground.remove({},function(err){
	if(err){
		console.log(err);
	}
	console.log("Removed campgrounds");
	// add few campground 
	data.forEach(function(seed){
	campground.create(seed,function(err, campground){
		if (err){
			console.log(err);
		}
		else{
			console.log("added a campground");
			// create a comment
			comment.create({
				text : "This place is great, but please provide internet connetivity",
				author : "Sourabh"
			},function(err ,comment){
				if (err){
					console.log(err);
				}
				else {
					campground.comments.push(comment);
					campground.save();
					console.log("created a new comment");
				}
			});
		}
	})
});
});
}

module.exports = seedDB;
