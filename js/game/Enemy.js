function Enemy ()
{
}
Enemy.prototype.create = function ( group, x, y )
{
	this.speed = 350;
	this.climbSpeed = 140;

	this.sprite = group.create( x, y, 'kid', 0 );

	this.sprite.owner = this;
	Global.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.sprite.scale.set( 1 );
	this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.sprite.body.setSize( 40, 78, 4, 15 );

	this.setupAnimation();

	this.locked = false;
	this.lockedTo = null;
	this.wasLocked = false;
	this.willJump = false;
	this.willDrop = false;
	this.willClimb = false;
	this.isClimbing = false;
	this.prevVel = new Phaser.Point(0,0);

	this.jumpTimer = 0;
	this.step = 0;
};

Enemy.prototype.setupAnimation = function ()
{
	this.animations = {};
	this.animations['idle'] = [0,1,2];
	this.animations['crouch'] = [3,4,5];
	this.animations['walk'] = [6,7,8];
	this.animations['jump'] = [9,10];
	this.animations['skid'] = [11,12];
	this.animations['climb'] = [11,12];

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
	var onFloor = this.sprite.body.touching.down || this.sprite.body.blocked.down || this.locked;

	// todo: replace with better AI
	var p = new Phaser.Point( 0, 0 );
	var left = Math.random() >= 0.5;
	var right = !left
	var down = Math.random() >= 0.5;
	var up = !down
	var onlyDown = down && !left && !right;
	if ( left )		p.x -= 1;
	if ( right )	p.x += 1;
	if ( up )		p.y -= 1;
	if ( down )		p.y += 1;

	if ( down && onFloor )
		p.x = 0;
	p.y = 0;
	p.setMagnitude( this.speed );

	if ( onFloor )
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
	
	/* Handle animations */

	var v = this.sprite.body.velocity;
	v.y = Math.min( v.y, 1000 );

	
	if ( !onFloor )
	{
		this.setAnimation( 'jump' );
		this.step += 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];
	}
	else if ( onlyDown )
	{
		this.setAnimation( 'crouch' );
		this.step += 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];
	}
	else if ( Math.abs( v.x ) > 20 )
	{
		this.sprite.scale.x = v.x > 0 ? 1 : -1;
		this.setAnimation( 'walk' );

		if ( ( v.x > 0 && left ) || ( v.x < 0 && right ) )
		{
			this.setAnimation( 'skid' );
			Global.Audio.play('skid');
		}

		this.step += v.getMagnitude()/2 / this.speed + 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];
	}
	else
	{
		this.setAnimation( 'idle' );
		this.step += 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];
	}


	if ( v.y == 0 && this.prevVel && this.prevVel.y > 0 )
	{
		Global.Audio.play('land');
	}
	this.prevVel.copyFrom(v);
};

Enemy.prototype.render = function ()
{
	if ( Global.debug )
	{
		Global.game.debug.body( this.sprite, RED );
	}
};


