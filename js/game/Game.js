var Global = Global || {};

Global.Game = function()
{
};

Global.Game.prototype.create = function ()
{
	Global.game.stage.backgroundColor = '#3798f9';
	Global.game.stage.backgroundColor = '#328CC1';
	Global.game.physics.arcade.gravity.y = 1300;

	//Global.Audio.loop( 'music' );

	this.skyGroup = Global.game.add.physicsGroup();	
	this.sky = this.skyGroup.create( 0, 0, 'sky' );
	this.sky.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
	this.sky.body.allowGravity = false;
	this.sky.body.immovable = true;
	this.sky.scale.set( SCREEN_WIDTH / 320 );
	this.sky.fixedToCamera = true;

	this.Stage = new Stage();
	this.Stage.create();
	Global.game.world.setBounds( 0, 0, this.Stage.width*64, this.Stage.height*64 );

	this.playerGroup = Global.game.add.physicsGroup();
	this.enemyGroup = Global.game.add.physicsGroup();
	this.Player = new Player();
	this.Enemy = new Enemy();
	this.SubEnemy = new SubEnemy();
	this.Hopper = new Hopper();
	
	this.Player.create(
		this.playerGroup,
		7 * 64,
		8 * 64
	);
	
	this.Enemy.create(
		this.enemyGroup,
		7 * 64,
		8 * 64
	);
	this.SubEnemy.create(
		this.enemyGroup,
		7 * 64,
		8 * 64
	);
	this.Hopper.create(
		this.enemyGroup,
		7 * 64,
		8 * 64
	);

	this.camera.follow( this.Player.sprite );

	this.debugToggle = Global.game.input.keyboard.addKey( Phaser.Keyboard.Q );

	Global.game.world.bringToTop( this.skyGroup );
	Global.game.world.bringToTop( this.Stage.vines );
	Global.game.world.bringToTop( this.Stage.stationary );
	Global.game.world.bringToTop( this.Stage.clouds );
	Global.game.world.bringToTop( this.Stage.balloons );
	Global.game.world.bringToTop( this.Stage.goal );
	Global.game.world.bringToTop( this.playerGroup );
	Global.game.world.bringToTop( this.enemyGroup );
};

Global.Game.prototype.preRender = function ()
{
	if ( this.game.paused )
	{
		return;
	}

	this.Player.preRender();
	this.Enemy.preRender();
	this.SubEnemy.preRender();
};

Global.Game.prototype.update = function ()
{
	this.handleCollisions();

	this.Player.update();
	this.Enemy.update();
	this.SubEnemy.update();
	this.Hopper.update();

	if ( this.Player.sprite.y > Global.game.world.bounds.height )
	{
		this.state.start( 'Game' );
	}

	if ( this.debugToggle.justDown )
		Global.debug = !Global.debug;
};

Global.Game.prototype.handleCollisions = function ()
{
	this.physics.arcade.collide( this.Player.sprite, this.Stage.stationary );
	this.physics.arcade.overlap( this.Player.gripper, this.Stage.stationary, this.Player.gripWall, null, this.Player );
	this.physics.arcade.collide( this.Player.sprite, this.Stage.clouds, this.customSep, null, this );

	this.physics.arcade.collide( this.Enemy.sprite, this.Stage.stationary );
	this.physics.arcade.collide( this.SubEnemy.sprite, this.Stage.stationary );
	this.physics.arcade.collide( this.Hopper.sprite, this.Stage.stationary );

	Global.game.physics.arcade.overlap( this.Player.sprite, this.Stage.vines, function( playerSprite, vinesSprite ) {
		playerSprite.owner.onVine();
	}, null, this );

	Global.game.physics.arcade.overlap( this.Player.sprite, this.Stage.balloons, function( playerSprite, balloonSprite ) {
		balloonSprite.kill();
		Global.Audio.play( 'pop' );
	}, null, this );

	Global.game.physics.arcade.overlap( this.Player.sprite, this.Stage.balloons, function( playerSprite, balloonSprite ) {
		balloonSprite.kill();
	}, null, this );

	Global.game.physics.arcade.overlap( this.Player.sprite, this.Stage.goal, function() {
		//this.state.start( 'Game', Phaser.Plugin.StateTransition.Out.SlideUp, Phaser.Plugin.StateTransition.In.SlideUp );
		this.state.start( 'Game' );
	}, null, this );
};

Global.Game.prototype.customSep = function ( playerSprite, platformSprite )
{
	if ( !playerSprite.owner.locked && playerSprite.body.velocity.y > 0 && Global.game.time.now > platformSprite.owner.lockTimer )
	{
		playerSprite.owner.locked = true;
		playerSprite.owner.lockedTo = platformSprite;
		platformSprite.owner.playerLocked = true;

		playerSprite.body.velocity.y = 0;
	}

	this.physics.arcade.collide( playerSprite, platformSprite );
};

Global.Game.prototype.render = function ()
{
	this.Player.render();
	this.Enemy.render();
	this.SubEnemy.render();
	this.Stage.render();
};
