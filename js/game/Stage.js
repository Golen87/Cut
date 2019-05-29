
function Stage ()
{
}

Stage.prototype.create = function ( x, y )
{
	var level = 'test_room';

	this.stationary = Global.game.add.physicsGroup();
	this.vines = Global.game.add.physicsGroup();
	this.clouds = Global.game.add.physicsGroup();
	this.balloons = Global.game.add.physicsGroup();
	this.goal = Global.game.add.physicsGroup();

	this.width = Global.game.cache.getImage( level ).width;
	this.height = Global.game.cache.getImage( level ).height;

	this.tileMap = [...Array( this.height ).keys()].map( i => Array( this.width ) );
	this.makePixelMap( level );
};


/* Add Stationary */

Stage.prototype.addWall = function ( x, y, s )
{
	//var wall = new Stationary( x*64, y*64, 'tree_' + s, this.stationary );
	//wall.sprite.scale.set( 64 / 260 );
	//var size = s == 's' ? 260 : s == 'm' ? 260*2 : 1000;
	//wall.sprite.body.setSize( size, 201, 20, 0 );
	var wall = new Stationary( x*64, y*64, 'stone', this.stationary );
	wall.sprite.scale.set( 1 );
	wall.sprite.body.setSize( 64, 64 );
};

Stage.prototype.addVines = function ( x, y )
{
	var vines = new Stationary( x*64, y*64, 'leaves', this.vines );
	vines.sprite.scale.set( 4 );
	vines.sprite.body.setSize( 6, 6, 4, 4 );
	vines.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
};


/* Add Entity */

Stage.prototype.addBalloon = function ( x, y )
{
	var balloon = new Entity( x*64, y*64, 'pizza', this.balloons );
	balloon.sprite.scale.set( 1 );
	balloon.sprite.body.setCircle( 48, 16, 8 );
	balloon.sprite.animations.add( 'anim', [0,1,2], 6, true );
	balloon.sprite.animations.play( 'anim' );
	balloon.sprite.scale.set(0.5);
	/*balloon.sprite.tint = Phaser.ArrayUtils.getRandomItem( [
		0xd65a35,
		0xd6355a,
		0x5ad635,
		0x5a35d6,
		0x355ad6,
		0x35d65a,
	] );*/
	balloon.makeBalloon();
};

Stage.prototype.addCloudPlatform = function ( x, y, inv=false )
{
	var cloud = new Entity( x*64, y*64, 'cloud', this.clouds );
	cloud.sprite.scale.set( 2 );
	cloud.sprite.animations.add( 'anim', [0,1], 6, true );
	cloud.sprite.animations.play( 'anim' );
	cloud.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	cloud.sprite.body.setSize( 100, 10, 10, 8 );
	if (inv)
		cloud.makeVerticalCloudInv();
	else
		cloud.makeVerticalCloud();

	cloud.sprite.body.customSeparateX = true;
	cloud.sprite.body.customSeparateY = true;
};

Stage.prototype.addGoal = function ( x, y )
{
	var goal = new Entity( x*64, y*64, 'balloon', this.goal );
	goal.sprite.scale.set( 128 / 409 );
	goal.makeBalloon();
};


Stage.prototype.update = function ()
{
};

Stage.prototype.render = function ()
{
	if ( Global.debug )
	{
		for (var i = this.stationary.children.length - 1; i >= 0; i--) {
			Global.game.debug.body( this.stationary.children[i], BLUE );
		}
		for (var i = this.vines.children.length - 1; i >= 0; i--) {
			Global.game.debug.body( this.vines.children[i], PURPLE );
		}
		for (var i = this.balloons.children.length - 1; i >= 0; i--) {
			Global.game.debug.body( this.balloons.children[i], YELLOW );
		}
		for (var i = this.clouds.children.length - 1; i >= 0; i--) {
			Global.game.debug.body( this.clouds.children[i], CYAN );
		}
		for (var i = this.goal.children.length - 1; i >= 0; i--) {
			Global.game.debug.body( this.goal.children[i], GREEN );
		}
	}
};


/* Room creation */

Stage.prototype.makePixelMap = function ( worldFile )
{
	var bmd = Global.game.make.bitmapData( this.width, this.height );
	bmd.draw( Global.game.cache.getImage( worldFile ), 0, 0 );
	bmd.update();

	for ( var y = 0; y < this.height; y++ )
	{
		for ( var x = 0; x < this.width; x++ )
		{
			var hex = bmd.getPixel32( x, y );
			var r = ( hex >>  0 ) & 0xFF;
			var g = ( hex >>  8 ) & 0xFF;
			var b = ( hex >> 16 ) & 0xFF;
			var a = ( hex >> 24 ) & 0xFF;
			var key = [r, g, b].toString();

			if ( a != 0 )
				this.addObject( key, x, y );
		}
	}
};

Stage.prototype.addObject = function ( key, x, y )
{
	if ( key == '0,0,0' )
	{
		this.addWall( x, y, 's' );
	}
	else if ( key == '50,50,50' )
	{
		this.addWall( x, y, 'm' );
	}
	else if ( key == '100,100,100' )
	{
		this.addWall( x, y, 'l' );
	}
	else if ( key == '0,255,255' )
	{
		this.addCloudPlatform( x, y, false );
	}
	else if ( key == '0,255,128' )
	{
		this.addCloudPlatform( x, y, true );
	}
	else if ( key == '0,255,0' )
	{
		//this.addVines( x, y );
	}
	else if ( key == '255,0,0' )
	{
		this.addBalloon( x, y );
	}
};
