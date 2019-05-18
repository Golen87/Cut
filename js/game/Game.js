
var Kid = Kid || {};

Kid.Game = function()
{
};

Kid.Game.prototype.create = function ()
{
	Kid.game.stage.backgroundColor = '#3798f9';
	Kid.game.stage.backgroundColor = '#328CC1';
	Kid.game.physics.arcade.gravity.y = 1300;

	Kid.Audio.loop( 'music' );

	//this.entities = Kid.game.add.group();

	this.skyGroup = Kid.game.add.physicsGroup();	
	this.sky = this.skyGroup.create( 0, 0, 'sky' );
	this.sky.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.sky.body.allowGravity = false;
	this.sky.body.immovable = true;
	this.sky.scale.set( SCREEN_WIDTH / 320 );
	this.sky.fixedToCamera = true;

	this.Stage = new Stage();
	this.Stage.create();
	Kid.game.world.setBounds( 0, 0, this.Stage.width*64, this.Stage.height*64 );

	this.playerGroup = Kid.game.add.physicsGroup();
	this.Player = new Player();
	this.Player.create(
		this.playerGroup,
		7 * 64,
		60 * 64
	);

	this.camera.follow( this.Player.sprite );

	this.debugToggle = Kid.game.input.keyboard.addKey( Phaser.Keyboard.Q );

	Kid.game.world.bringToTop( this.skyGroup );
	Kid.game.world.bringToTop( this.Stage.vines );
	Kid.game.world.bringToTop( this.Stage.stationary );
	Kid.game.world.bringToTop( this.Stage.clouds );
	Kid.game.world.bringToTop( this.Stage.balloons );
	Kid.game.world.bringToTop( this.Stage.goal );
	Kid.game.world.bringToTop( this.playerGroup );
};

Kid.Game.prototype.preRender = function ()
{
	if ( this.game.paused )
	{
		return;
	}

	this.Player.preRender();
};

Kid.Game.prototype.update = function ()
{
	this.handleCollisions();

	this.Player.update();

	if ( this.Player.sprite.y > Kid.game.world.bounds.height )
	{
		this.state.start( 'Game' );
	}

	if ( this.debugToggle.justDown )
		Kid.debug = !Kid.debug;
};

Kid.Game.prototype.handleCollisions = function ()
{
	this.physics.arcade.collide( this.Player.sprite, this.Stage.stationary );

	this.physics.arcade.collide( this.Player.sprite, this.Stage.clouds, this.customSep, null, this );

	Kid.game.physics.arcade.overlap( this.Player.sprite, this.Stage.vines, function( playerSprite, vinesSprite ) {
		playerSprite.owner.onVine();
	}, null, this );

	Kid.game.physics.arcade.overlap( this.Player.sprite, this.Stage.balloons, function( playerSprite, balloonSprite ) {
		balloonSprite.kill();
		Kid.Audio.play( 'pop' );
	}, null, this );

	Kid.game.physics.arcade.overlap( this.Player.sprite, this.Stage.balloons, function( playerSprite, balloonSprite ) {
		balloonSprite.kill();
	}, null, this );

	Kid.game.physics.arcade.overlap( this.Player.sprite, this.Stage.goal, function() {
		//this.state.start( 'Game', Phaser.Plugin.StateTransition.Out.SlideUp, Phaser.Plugin.StateTransition.In.SlideUp );
		this.state.start( 'Game' );
	}, null, this );
};

Kid.Game.prototype.customSep = function ( playerSprite, platformSprite )
{
	if ( !playerSprite.owner.locked && playerSprite.body.velocity.y > 0 && Kid.game.time.now > platformSprite.owner.lockTimer )
	{
		playerSprite.owner.locked = true;
		playerSprite.owner.lockedTo = platformSprite;
		platformSprite.owner.playerLocked = true;

		playerSprite.body.velocity.y = 0;
	}

	this.physics.arcade.collide( playerSprite, platformSprite );
};

Kid.Game.prototype.render = function ()
{
	this.Player.render();
	this.Stage.render();
};
