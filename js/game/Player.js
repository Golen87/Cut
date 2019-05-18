
function Player ()
{
}

Player.prototype.create = function ( group, x, y )
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

	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );

	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
	this.jumpTimer = 0;
	this.step = 0;
};

Player.prototype.setupAnimation = function ()
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

Player.prototype.setAnimation = function ( newState )
{
	if ( this.state != newState )
	{
		this.state = newState;
		this.sprite.frame = this.animations[newState][0];
	}
};

Player.prototype.preRender = function ()
{
	if (this.locked || this.wasLocked)
	{
		this.sprite.x += this.lockedTo.deltaX;
		this.sprite.y = this.lockedTo.y - 30;

		if (this.sprite.body.velocity.x !== 0)
		{
			this.sprite.body.velocity.y = 0;
		}
	}

	if (this.willJump)
	{
		this.willJump = false;
		Global.Audio.play( 'jump' );

		if (this.lockedTo && this.lockedTo.deltaY < 0 && this.wasLocked)
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

	if (this.willDrop && this.wasLocked)
	{
		this.willDrop = false;

		this.sprite.body.velocity.y = 650/4;

		this.jumpTimer = Global.game.time.now + 10;
		this.lockedTo.owner.lockTimer = Global.game.time.now + 100;
	}

	if (this.wasLocked)
	{
		this.wasLocked = false;
		this.lockedTo.owner.playerLocked = false;
		this.lockedTo = null;
	}
};

Player.prototype.update = function ()
{
	var onFloor = this.sprite.body.touching.down || this.sprite.body.blocked.down || this.locked;

	var p = new Phaser.Point( 0, 0 );
	var left = this.keys.left.isDown || this.keys.a.isDown;
	var right = this.keys.right.isDown || this.keys.d.isDown;
	var down = this.keys.down.isDown || this.keys.s.isDown;
	var up = this.keys.up.isDown || this.keys.w.isDown;
	var onlyDown = down && !left && !right;
	if ( left )		p.x -= 1;
	if ( right )	p.x += 1;
	if ( up )		p.y -= 1;
	if ( down )		p.y += 1;


	if ( this.keys.up.justDown || this.keys.w.justDown )
	{
		this.willClimb = true;
	}
	else
	{
		this.willClimb = false;
	}

	if ( this.isClimbing )
	{
		p.setMagnitude( this.climbSpeed );
		
		this.sprite.body.velocity.x += ( p.x - this.sprite.body.velocity.x ) / 3;
		this.sprite.body.velocity.y += ( p.y - this.sprite.body.velocity.y ) / 3;

		if ( this.climbTimer < Global.game.time.now )
		{
			this.stopClimbing();
		}
	}
	else
	{
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
	}


	if ( this.keys.space.justDown )
	{
		if ( ( onFloor && Global.game.time.now > this.jumpTimer ) || this.isClimbing )
		{
			if (this.locked)
			{
				this.cancelLock();
			}

			if ( this.isClimbing )
			{
				this.stopClimbing();
			}

			if ( onlyDown )
			{
				this.willDrop = true;
			}
			else
			{
				this.willJump = true;
			}
		}
	}


	if (this.locked)
	{
		this.checkLock();
	}

	if ( ( this.keys.space.isDown ) && this.sprite.body.velocity.y <= 0 )
	{
		this.sprite.body.gravity.y = 0;
	}
	else
	{
		this.sprite.body.gravity.y = 1500;
	}


	/* Handle animations */

	var v = this.sprite.body.velocity;
	v.y = Math.min( v.y, 1000 );

	if ( this.isClimbing )
	{
		this.setAnimation( 'climb' );

		this.step += 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];

		if ( this.step2 == null )
			this.step2 = 0;
		this.step2 += v.getMagnitude() / this.climbSpeed;
		var oldScale = this.sprite.scale.x;
		this.sprite.scale.x = 1 - 2*(Math.round( this.step2 / 10 ) % 2);

		if ( oldScale != this.sprite.scale.x )
		{
			Global.Audio.play( oldScale > 0 ? 'climb1' : 'climb2' );
		}
	}
	else if ( !onFloor )
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

Player.prototype.render = function ()
{
	if ( Global.debug )
	{
		Global.game.debug.body( this.sprite, RED );
	}
};

Player.prototype.checkLock = function ()
{
	this.sprite.body.velocity.y = 0;

	//  If the player has walked off either side of the platform then they're no longer locked to it
	if ( this.sprite.body.right < this.lockedTo.body.x || this.sprite.body.x > this.lockedTo.body.right )
	{
		this.cancelLock();
	}
};

Player.prototype.cancelLock = function ()
{
	this.wasLocked = true;
	this.locked = false;
};

Player.prototype.onVine = function ()
{
	if ( this.willClimb )
	{
		this.startClimbing();
	}
	if ( this.isClimbing )
	{
		this.climbTimer = Global.game.time.now + 10;
	}
};

Player.prototype.startClimbing = function ()
{
	this.isClimbing = true;
	this.sprite.body.allowGravity = false;
	this.sprite.body.velocity.set( 0 );
};

Player.prototype.stopClimbing = function ()
{
	this.willClimb = false;
	this.isClimbing = false;
	this.sprite.body.allowGravity = true;
};
