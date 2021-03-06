function Hopper() {}

Hopper.prototype.create = function ( group, x, y )
{
	Enemy.prototype.create.call( this, group, x, y );

	this.speed = 100;
}

Hopper.prototype.setupAnimation = function ()
{
	this.animations = {};
	this.animations['idle'] = [5];
	this.animations['crouch'] = [5];
	this.animations['walk'] = [3];
	this.animations['jump'] = [4];
	this.animations['skid'] = [4];
	this.animations['climb'] = [5];

	this.setAnimation( 'idle' );
};

Hopper.prototype.update = function ()
{
	if ( Math.random() <= 0.04 && this.onFloor ) { 
		this.willJump = true;
		this.left = Math.random() >= 0.5 ? true : false;
	}

	if ( this.willJump ) this.jump();


	this.right = !this.left;
	this.down = false;

	this.move();
	
	if ( !this.onFloor )
	{
		this.setAnimation( 'jump' );
		this.step += 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];
	}
	
	else if ( this.onlyDown )
	{
		this.setAnimation( 'crouch' );
		this.step += 1;
		var a = this.animations[this.state];
		var f = Math.round( this.step / 10 );
		this.sprite.frame = a[f % a.length];
	}
	
	else if ( Math.abs( this.v.x ) > 20 )
	{
		this.sprite.scale.x = this.v.x > 0 ? 1 : -1;
		this.setAnimation( 'walk' );

		if ( ( this.v.x > 0 && this.left ) || ( this.v.x < 0 && this.right ) )
		{
			this.setAnimation( 'skid' );
			//Global.Audio.play('skid');
		}

		this.step += this.v.getMagnitude()/2 / this.speed + 1;
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


	if ( this.v.y == 0 && this.prevVel && this.prevVel.y > 0 )
	{
		//Global.Audio.play('land');
	}
	this.prevVel.copyFrom(this.v);
	
};


extend(Enemy, Hopper);