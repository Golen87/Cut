function Enemy () {}

Enemy.prototype.create = function ( group, x, y )
{
	this.speed = 350;

	this.sprite = group.create( x, y, 'ingredients', 0 );
	this.sprite.owner = this;
	this.onFloor = false;
	this.sprite.anchor.set( 0.5 );
	this.sprite.scale.set( 1 );
	this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.sprite.body.setSize( 70, 85, 20, 20 );
	this.v;
	this.locked = false;
	this.lockedTo = null;
	this.wasLocked = false;
	this.willJump = false;
	this.willDrop = false;
	this.prevVel = new Phaser.Point(0,0);
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.jumpTimer = 0;
	this.step = 0;

	Global.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.setupAnimation();

};

Enemy.prototype.setupAnimation = function ()
{
	this.animations = {};
	this.animations['idle'] = [0,1,2];
	this.animations['crouch'] = [3,4,5];
	this.animations['walk'] = [6,7,8];
	this.animations['jump'] = [9,10];
	this.animations['skid'] = [11,12];

	this.setAnimation( 'idle' );
};

Enemy.prototype.setAnimation = function ( newState )
{
	if ( this.state != newState )
	{
		this.state = newState;
		this.sprite.frame = this.animations[newState][0];
	}
};

Enemy.prototype.preRender = function ()
{

};

Enemy.prototype.update = function ()
{
	this.move();
};

Enemy.prototype.render = function ()
{
	if ( Global.debug )
	{
		Global.game.debug.body( this.sprite, RED );
	}
};

Enemy.prototype.move = function() 
{

	this.onFloor = this.sprite.body.touching.down || this.sprite.body.blocked.down;

	var p = new Phaser.Point( 0, 0 );

	if ( this.left )		p.x -= 1;
	if ( this.right )		p.x += 1;
	if ( this.up )			p.y -= 1;
	if ( this.down )		p.y += 1;

	if ( this.down && this.onFloor )
		p.x = 0;
	p.y = 0;
	p.setMagnitude( this.speed );

	if ( this.onFloor )
	{
		var diff = ( p.x - this.sprite.body.velocity.x ) / 5;
		diff = Math.max( Math.min( diff, this.speed / 15 ), -this.speed / 15 );
		this.sprite.body.velocity.x += diff;
	}
	else if ( p.getMagnitude() > 0 )
	{
		this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 20;
	}
	
	this.sprite.body.gravity.y = 1500;


	this.v = this.sprite.body.velocity;
	this.v.y = Math.min( this.v.y, 1000 );

	
};

Enemy.prototype.jump = function() 
{
	if ( this.willJump )
	{
		this.willJump = false;
		//Global.Audio.play( 'jump' );

		if ( this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked )
		{
			//  If the platform is moving up we add its velocity to the players jump
			this.sprite.body.velocity.y = -650 + (this.lockedTo.deltaY * 10);
		}
		else
		{
			this.sprite.body.velocity.y = -650;
		}

		this.jumpTimer = Global.game.time.now + 10;
	}

	if ( this.willDrop && this.wasLocked )
	{
		this.willDrop = false;

		this.sprite.body.velocity.y = 650/4;

		this.jumpTimer = Global.game.time.now + 10;
		this.lockedTo.owner.lockTimer = Global.game.time.now + 100;
	}
}
