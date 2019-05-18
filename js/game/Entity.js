Entity = function (x, y, key, group)
{
	this.sprite = group.create( x, y, key );
	this.sprite.owner = this;

	this.sprite.body.allowGravity = false;
	this.sprite.body.immovable = true;

	this.playerLocked = false;
	this.lockTimer = 0;
};

Entity.prototype.addMotionPath = function (motionPath)
{
	this.tweenX = Kid.game.add.tween( this.sprite.body );
	this.tweenY = Kid.game.add.tween( this.sprite.body );

	for (var i = 0; i < motionPath.length; i++)
	{
		this.tweenX.to( { x: motionPath[i].x }, motionPath[i].xSpeed, motionPath[i].xEase);
		this.tweenY.to( { y: motionPath[i].y }, motionPath[i].ySpeed, motionPath[i].yEase);
	}

	this.tweenX.loop();
	this.tweenY.loop();
};

Entity.prototype.start = function ()
{
	this.tweenX.start();
	this.tweenY.start();
};

Entity.prototype.stop = function ()
{
	this.tweenX.stop();
	this.tweenY.stop();
};


/* Movement patterns */

Entity.prototype.makeVerticalCloud = function ()
{
	var speed = 1500;
	this.addMotionPath([
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "-96", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "-96", ySpeed: speed, yEase: "Sine.easeOut" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "+96", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "+96", ySpeed: speed, yEase: "Sine.easeOut" }
	]);
	this.start();
};

Entity.prototype.makeVerticalCloudInv = function ()
{
	var speed = 1500;
	this.addMotionPath([
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "+96", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "+96", ySpeed: speed, yEase: "Sine.easeOut" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "-96", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "-96", ySpeed: speed, yEase: "Sine.easeOut" }
	]);
	this.start();
};

Entity.prototype.makeBalloon = function ()
{
	var speed = 700;
	this.addMotionPath([
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "-5", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "-5", ySpeed: speed, yEase: "Sine.easeOut" },
		{ x: "+0", xSpeed: speed, xEase: "Linear", y: "+5", ySpeed: speed, yEase: "Sine.easeIn" },
		{ x: "-0", xSpeed: speed, xEase: "Linear", y: "+5", ySpeed: speed, yEase: "Sine.easeOut" },
	]);
	this.start();
};