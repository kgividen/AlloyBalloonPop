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

var zIndex = _.has(args, 'zIndex') ? args.zIndex : 0;
var opacity = _.has(args, 'opacity') ? args.opacity : 1.0;
var topPopLocation = _.has(args, 'top') ? args.topPopLocation : "30%";
var leftPopLocation = _.has(args, 'left') ? args.leftPopLocation : "40%";
var edge = _.has(args, 'edge') ? args.edge : 0; //This is if you want to place balloons around the edge
var popDuration = _.has(args, 'popDuration') ? args.popDuration : 400;
var floatBalloonDuration = _.has(args, 'floatBalloonDuration') ? args.floatBalloonDuration : 3000;

$.balloonsView.zIndex = zIndex;
$.balloonsView.opacity = opacity;

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
	  	top: topPopLocation,
	  	left: leftPopLocation,
	    transform : matrix,
	    duration : popDuration,
	    repeat : 1
 	});
	  
	//pop the balloon and then fade it out to nothing
	balloons[i].animate(a, function(){
		balloons[i].image=WPATH(BALLOON_IMG_LOC + balloonImages[bColor].imagePop);	
	  	animation.fadeOut(balloons[i],popDuration, function(){
	  		$.balloonsView.remove(balloons[i]);
	  		balloons.splice(0,1); //remove the balloon from the array
			next && next();
	  	});
  	});
}

function floatABalloon(i, next){
	var a = Ti.UI.createAnimation({
	  	top:"-100%",
	    duration : floatBalloonDuration,
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

function popAllBalloonsTogether(next){
	if(balloons.length < 1){  //If there aren't any balloons to pop just return
		return next && next();	
	}
	for(var i=0; i < balloons.length; i++) {
		if( i < balloons.length - 1 ) {
			popBalloon(i);
		} else {
			popBalloon(i, next);
		}
	}
}

function popAllBalloonsConsecutively(next){
	function pop(i, next) {
		if( i < balloons.length ) {
	    	popBalloon(i, function(err) {
	      		if ( err ) {
	        		Ti.API.info('error: ' + err);
	      		} else {
	        		pop(i+1, next);
	      		}
	    	});
	  	} else {
		  	next && next();
	  	}
	}
	pop(0, next);
}

function floatAllBalloons(next){
	for(var i=0; i < balloons.length; i++) {	
		floatABalloon(i);
	}
	next && next();
}

function addBalloons(numOfBalloons, next){
	var t = "1"; //set first balloon in the middle
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
		if(edge) {
			//every other one lets put one on the left and one on the right.
			if(i % 2) {
				l = _.random(5,edge); 
			} else {
				var r = 90 - edge;
				l = _.random(r,90); //go to the right side
			}
		} else {
			l = _.random(5,80); //This will be x% of the width of the device	
		}
		t = _.random(2,25); //This will be x% of the height of the device to start placing balloons
		$.balloonsView.add(balloon);
		balloons.push(balloon);
	}
	
	next && next();
}

//Exports
exports.popAllBalloonsTogether = popAllBalloonsTogether;
exports.popAllBalloonsConsecutively = popAllBalloonsConsecutively;
exports.popABalloon = popABalloon;
exports.floatAllBalloons = floatAllBalloons;
exports.addBalloons = addBalloons;
exports.resetBalloons = resetBalloons;