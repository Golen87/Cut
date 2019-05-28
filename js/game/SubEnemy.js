function Walker() {}

Walker.prototype.create = function ( group, x, y )
{
	Enemy.prototype.create.call( this, group, x, y );
}

Walker.prototype.setupAnimation = function ()
{
	this.animations = {};
	this.animations['idle'] = [2];
	this.animations['crouch'] = [2];
	this.animations['walk'] = [0,1];
	this.animations['jump'] = [2];
	this.animations['skid'] = [2];
	this.animations['climb'] = [2];

	this.setAnimation( 'idle' );
};

Walker.prototype.update = function ()
{
	if (Math.random() <= 0.05) { 
		this.right = !this.right;
	}
	this.left = !this.right;
	this.up = false;
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
extend(Enemy, Walker);