function Player () {}

Player.prototype.create = function ( group, x, y )
{
	this.speed = 300;
	this.dragSpeed = 550;
	this.climbSpeed = 140;
	this.jumpSpeed = 600;

	this.sprite = group.create( x, y, 'cook', 0 );
	this.sprite.owner = this;
	Global.game.physics.arcade.enable( this.sprite, Phaser.Physics.ARCADE );
	this.sprite.anchor.set( 0.5 );
	this.xScale = 0.6;
	this.sprite.scale.set( this.xScale );
	this.sprite.offset = new Phaser.Point( 0, 30 );
	//this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.sprite.body.setSize( 130, 190, 100, 53 );

	this.gripper = group.create( 0, 8, 'circle', 0 );
	this.sprite.addChild( this.gripper );
	this.gripper.owner = this;
	Global.game.physics.arcade.enable( this.gripper, Phaser.Physics.ARCADE );
	this.gripper.anchor.set( 0.5 );
	this.gripper.scale.set( 1/2 );
	this.gripper.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.gripper.body.setCircle( 32 );
	this.gripper.body.allowGravity = false;
	this.gripper.tint = 0xff0000;
	this.gripper.alpha = 0.0;

	//this.cutter = group.create( 0, 0, 'circle', 0 );
	//this.sprite.addChild( this.cutter );
	//this.cutter.owner = this;
	//Global.game.physics.arcade.enable( this.cutter, Phaser.Physics.ARCADE );
	//this.cutter.anchor.set( 0.5 );
	//this.cutter.scale.set( 1 );
	//this.cutter.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	//this.cutter.body.setCircle( 32, 24, 32 );
	//this.cutter.body.allowGravity = false;
	//this.cutter.tint = 0xff0000;
	//this.cutter.alpha = 0.0;

	this.setupAnimation();
	this.setupInput();


	this.locked = false;
	this.lockedTo = null;
	this.lockCooldown = 500;
	this.wasLocked = false;

	this.willJump = false;
	this.willDrop = false;
	this.willClimb = false;
	this.isClimbing = false;
	this.prevVel = new Phaser.Point(0,0);

	this.jumpTimer = 0;
	this.jumpCooldown = 500;
	this.canAttack = true;
	this.attackTimer = 0;
	this.attackCooldown = 200;
	this.step = 0;

	this.isGripping = null;
	this.gripTimer = 0;
	this.gripDir = new Phaser.Point( 0, 0 );
};


/* Animations */

Player.prototype.setupAnimation = function ()
{
	this.animations = {};
	this.animations['idle'] = [0,1];
	this.animations['crouch'] = [7];
	this.animations['walk'] = [2,3];
	this.animations['jump'] = [6];
	this.animations['skid'] = [3];
	this.animations['climb'] = [7];
	this.animations['prepare'] = [4];
	this.animations['attack'] = [5];
	this.animations['damage'] = [8];

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


/* Input management */

Player.prototype.setupInput = function ()
{
	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
	this.keys.shift = Global.game.input.keyboard.addKey( Phaser.Keyboard.SHIFT );
	this.keys.e = Global.game.input.keyboard.addKey( Phaser.Keyboard.E );
	this.keys.i = Global.game.input.keyboard.addKey( Phaser.Keyboard.I );

	this.input = {
		"up": {},
		"left": {},
		"down": {},
		"right": {},

		"jump": {},
		"attack": {},

		"dir": new Phaser.Point(0,0)
	};
	this.resetInput();
};

Player.prototype.handleInput = function ()
{
	for (var key in this.input) {
		this.input[key].wasDown = this.input[key].isDown;
	}

	this.input.up.isDown = this.keys.up.isDown || this.keys.w.isDown;
	this.input.left.isDown = this.keys.left.isDown || this.keys.a.isDown;
	this.input.down.isDown = this.keys.down.isDown || this.keys.s.isDown;
	this.input.right.isDown = this.keys.right.isDown || this.keys.d.isDown;
	this.input.jump.isDown = this.input.up.isDown;
	this.input.attack.isDown = this.keys.space.isDown;

	for (var key in this.input) {
		this.input[key].justDown = ( this.input[key].isDown && !this.input[key].wasDown );
		this.input[key].justUp = ( !this.input[key].isDown && this.input[key].wasDown );
		this.input[key].holdTimer = this.input[key].justDown ? 0 : this.input[key].holdTimer + (this.input[key].isDown ? 1 : 0);
	}

	this.input.dir.set( 0, 0 );
	if ( this.input.up.isDown )
		this.input.dir.y -= 1;
	if ( this.input.down.isDown )
		this.input.dir.y += 1;
	if ( this.input.left.isDown )
		this.input.dir.x -= 1;
	if ( this.input.right.isDown )
		this.input.dir.x += 1;
};

Player.prototype.resetInput = function ()
{
	for (var key in this.input) {
		this.input[key].wasDown = false;
		this.input[key].isDown = false;
		this.input[key].justDown = false;
		this.input[key].justUp = false;
		this.input[key].holdTimer = 0;
	}

	Global.game.input.reset();
};

Player.prototype.getDirString = function ( vector )
{
	if ( vector.x < 0 )
		return 'left';
	if ( vector.x > 0 )
		return 'right';
	if ( vector.y < 0 )
		return 'up';
	if ( vector.y > 0 )
		return 'down';
};


/* Update loops */

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
			this.sprite.body.velocity.y = -this.jumpSpeed + (this.lockedTo.deltaY * 10);
		}
		else
		{
			this.sprite.body.velocity.y = -this.jumpSpeed;
		}

		this.jumpTimer = Global.game.time.now + this.jumpCooldown;
	}

	if (this.willAttack)
	{
		this.willAttack = false;
		Global.Audio.play( 'swing' );
		this.setAnimation( 'attack' );

		this.canAttack = false;
		this.attackTimer = Global.game.time.now + this.attackCooldown;

		var dx = this.sprite.scale.x > 0 ? 1 : this.sprite.scale.x < 0 ? -1 : 0;
		if ( this.input.dir.x != 0 ) {
			dx = this.input.dir.x;
		}
		var dy = this.input.dir.y;
		this.attemptGrip(dx, dy);
	}

	if (this.willDrop && this.wasLocked)
	{
		this.willDrop = false;

		this.sprite.body.velocity.y = this.jumpSpeed/4;

		this.jumpTimer = Global.game.time.now + this.jumpCooldown;
		this.lockedTo.owner.lockTimer = Global.game.time.now + this.lockCooldown;
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
	this.handleInput();

	var onFloor = this.sprite.body.touching.down || this.sprite.body.blocked.down || this.locked;

	var p = new Phaser.Point( 0, 0 );
	var left = this.input.left.isDown;
	var right = this.input.right.isDown;
	var down = this.input.down.isDown;
	var up = this.input.up.isDown;
	var onlyDown = down && !left && !right;
	if ( left )		p.x -= 1;
	if ( right )	p.x += 1;
	if ( up )		p.y -= 1;
	if ( down )		p.y += 1;


	if ( this.input.up.justDown )
	{
		this.willClimb = true;
	}
	else
	{
		this.willClimb = false;
	}


	if ( !this.isGripping && this.gripTimer >= 0 ) {
		if ( this.gripTimer == 0 ) {
			this.releaseGrip();
		}
		this.gripTimer -= 1;
	}

	// Gripping is activated through collision
	if ( this.isGripping )
	{
		var drag = this.gripDir.clone()
		drag.setMagnitude( this.dragSpeed );
		console.log(this.sprite.body.allowGravity);

		var diffX = ( drag.x - this.sprite.body.velocity.x ) / 5;
		diffX = Math.max( Math.min( diffX, this.dragSpeed / 15 ), -this.dragSpeed / 15 );
		this.sprite.body.velocity.x += diffX;

		var diffY = ( drag.y - this.sprite.body.velocity.y ) / 5;
		diffY = Math.max( Math.min( diffY, this.dragSpeed / 15 ), -this.dragSpeed / 15 );
		this.sprite.body.velocity.y += diffY;

		if ( this.gripTimer < 0 ) {
			this.releaseGrip();
		} else {
			this.gripTimer -= 1;
		}
	}
	else if ( this.isClimbing )
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
		var isAttacking = this.input.attack.isDown || !this.canAttack;
		var isCrouching = down && onFloor;

		if ( isAttacking || isCrouching )
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


	if ( this.input.jump.justDown )
	{
		if ( ( onFloor && Global.game.time.now > this.jumpTimer ) || this.isClimbing || this.isGripping )
		{
			if (this.locked)
			{
				this.cancelLock();
			}

			if ( this.isClimbing )
			{
				this.stopClimbing();
			}

			if ( this.isGripping )
			{
				this.releaseGrip();
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

	if ( !this.canAttack && Global.game.time.now > this.attackTimer )
	{
		this.canAttack = true;
	}

	if ( this.input.attack.justUp )
	{
		if ( this.isGripping )
		{
			this.releaseGrip();
		}
		else if ( this.canAttack )
		{
			//if (this.locked)
			//{
			//	this.cancelLock();
			//}

			if ( this.isClimbing )
			{
				this.stopClimbing();
			}

			this.willAttack = true;
		}
	}


	if (this.locked)
	{
		this.checkLock();
	}

	if ( ( this.input.jump.isDown && this.sprite.body.velocity.y <= 0 ) || this.isGripping )
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

	if ( this.isGripping )
	{
		this.setAnimation( 'crouch' );
		//Global.Audio.play( 'drag' );
	}
	else if ( this.canAttack && this.input.attack.isDown ) {
		this.setAnimation( 'prepare' );
	}
	else if ( !this.canAttack ) {
		this.setAnimation( 'attack' );
	}
	/*else if ( this.isClimbing )
	{
		this.setAnimation( 'climb' );

		if ( this.step2 == null )
			this.step2 = 0;
		this.step2 += v.getMagnitude() / this.climbSpeed;
		var oldScale = this.sprite.scale.x;
		this.sprite.scale.x = this.xScale - 2*this.xScale*(Math.round( this.step2 / 10 ) % 2);

		if ( oldScale != this.sprite.scale.x )
		{
			Global.Audio.play( oldScale > 0 ? 'climb1' : 'climb2' );
		}
	}*/
	else if ( !onFloor )
	{
		this.setAnimation( 'jump' );
	}
	else if ( down )
	{
		this.setAnimation( 'crouch' );
	}
	else if ( Math.abs( v.x ) > 20 )
	{
		this.sprite.scale.x = v.x > 0 ? this.xScale : -this.xScale;
		this.setAnimation( 'walk' );

		if ( ( v.x > 0 && this.input.dir.x < 0 ) || ( v.x < 0 && this.input.dir.x > 0 ) )
		{
			this.setAnimation( 'skid' );
			Global.Audio.play('skid');
		}
	}
	else
	{
		this.setAnimation( 'idle' );
	}

	this.step += 1;
	var a = this.animations[this.state];
	var f = Math.round( this.step / 10 );
	this.sprite.frame = a[f % a.length];


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
		Global.game.debug.body( this.sprite, YELLOW );
		Global.game.debug.body( this.gripper, RED );
		//Global.game.debug.body( this.cutter, RED );
	}
};


/* Logic */

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

Player.prototype.attemptGrip = function (dx, dy)
{
	this.gripDir.set(dx, dy);

	if ( dy != 0 )
		dx = 0;
	this.gripper.x = 120 * dx * (this.sprite.scale.x > 0 ? 1 : this.sprite.scale.x < 0 ? -1 : 0);
	this.gripper.y = 120 * dy;

	this.gripTimer = 1;
};

Player.prototype.gripWall = function (gripper, wall)
{
	if ( !this.isGripping ) {

		// Change to movement direction
		if ( this.gripDir.y == 0 )
			this.gripDir.set(0, -1);
		else
			this.gripDir.y = 0;

		this.isGripping = true;
	}

	if (this.locked)
	{
		this.cancelLock();
	}

	this.gripTimer = 1;
	this.sprite.body.allowGravity = false;
};

Player.prototype.releaseGrip = function ()
{
	this.isGripping = false;
	this.gripper.x = 0;
	this.gripper.y = 0;
	this.sprite.body.allowGravity = true;
};