var args = arguments[0] || {};
var animation = require('alloy/animation');
//This applies a class if it's passed in so you can control styling from app.tss
// if(args.className){
	// var style = $.createStyle({
		// classes : args.className
	// });
	// $.button.applyProperties(style);	
// }
var BALLOON_IMG_LOC="/images/balloons/";
var balloons = [];
var balloonImages = 
	{ blue: 
		{ color:'blue', image:'blue.png',imagePop:'bluePop.png'},
	  red: 
		{ color:'red', image:'red.png',imagePop:'redPop.png'},
	  green: 
		{ color:'green', image:'green.png',imagePop:'greenPop.png'},
	  pink:
		{ color:'pink', image:'pink.png',imagePop:'pinkPop.png'},
	  yellow:
		{ color:'yellow', image:'yellow.png',imagePop:'yellowPop.png'}
	};

// $.container.top = args.top || 10;
var currentValueOnColor = _.has(args, 'currentValueOnColor') ? args.currentValueOnColor : "black";

function resetBalloons(next){
	balloons = [];
	next && next();
}

function popBalloon(i, next){
	//get color of balloon
	var bColor = balloons[i].myColor;
	balloons[i].image = WPATH(BALLOON_IMG_LOC + balloonImages[bColor].image);	
	  
	//Make the balloon get bigger as it pops
	var matrix = Ti.UI.create2DMatrix();
	matrix = matrix.scale(3, 3);
	
	balloons[i].setZIndex(100);
	//move the balloon closer to the middle since if it pops in place you can't see it  
	var a = Ti.UI.createAnimation({
	  	top:"30%",
	  	left: "50%",
	    transform : matrix,
	    duration : 750,
	    repeat : 1
 	});
	  
	//pop the balloon and then fade it out to nothing
	balloons[i].animate(a, function(){
		balloons[i].image=WPATH(BALLOON_IMG_LOC + balloonImages[bColor].imagePop);	
	  	animation.fadeOut(balloons[i],400, function(){
	  		$.balloonsView.remove(balloons[i]);
	  		balloons.splice(0,1); //remove the balloon from the array
			next && next();
	  	});
  	});
}

function floatABalloon(i, next){
	var a = Ti.UI.createAnimation({
	  	top:"-100%",
	    duration : 3000,
	    zIndex:100,
	    repeat : 1
 	});
	  
	//float it
	balloons[i].animate(a, function(){
		next && next();
	});
}

function popABalloon(next){
	if(balloons.length > 0){
		popBalloon(0, next);	
	}
}
function popAllBalloons(next){
	for(var i=0; i < balloons.length; i++) {	
		popBalloon(i);
	}
	next && next();
}

function floatAllBalloons(next){
	for(var i=0; i < balloons.length; i++) {	
		floatABalloon(i);
	}
	next && next();
}

function addBalloons(numOfBalloons, next){
	var t = "15"; //set first balloon in the middle
	var l = "45";//set first balloon in the middle

	for(var i=0; i < numOfBalloons; i++) {	
		var randomBalloon = _.sample(balloonImages);
		var balloon = Ti.UI.createImageView({
			image: WPATH(BALLOON_IMG_LOC + randomBalloon.image),
			myColor: randomBalloon.color
		});
		$.addClass(balloon, 'balloons');
		//we want this to be a percentage so it knows where to set it. 
		var left = l + "%";
		var top = t + "%";
		balloon.setLeft(left);
		balloon.setTop(top);
		l = _.random(5,80); //This will be x% of the width of the device
		t = _.random(5,25); //This will be x% of the height of the device to start placing balloons
		$.balloonsView.add(balloon);
		balloons.push(balloon);
	}
	
	next && next();
}

//Exports
exports.popAllBalloons = popAllBalloons;
exports.popABalloon = popABalloon;
exports.floatAllBalloons = floatAllBalloons;
exports.addBalloons = addBalloons;
exports.resetBalloons = resetBalloons;