var Global = Global || {};

//loading the game assets
Global.Preload = function() {};

Global.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#eeeeee';


		/* Fonts */

		this.load.bitmapFont( 'Balsamiq', 'assets/fonts/balsamiq_regular.png', 'assets/fonts/balsamiq_regular.fnt' );
		this.load.bitmapFont( 'BalsamiqBold', 'assets/fonts/balsamiq_bold.png', 'assets/fonts/balsamiq_bold.fnt' );


		/* Sprites */

		this.load.image( 'walls', 'assets/rooms/walls.png' );
		this.load.image( 'test_room', 'assets/rooms/test_room.png' );

		this.load.spritesheet( 'kid', 'assets/sprites/kid.png', 48, 96 );
		this.load.spritesheet( 'kid2', 'assets/sprites/kid2.png', 48, 96 );
		this.load.spritesheet( 'balloon', 'assets/sprites/balloon.png', 48, 96 );

		this.load.image( 'tree_s', 'assets/sprites/tree_short.png' );
		this.load.image( 'tree_m', 'assets/sprites/tree_medium.png' );
		this.load.image( 'tree_l', 'assets/sprites/tree_long.png' );
		this.load.image( 'leaves', 'assets/sprites/leaves.png' );

		this.load.image( 'sky', 'assets/sprites/sky.png' );
		this.load.spritesheet( 'cloud', 'assets/sprites/cloud.png', 120, 46 );


		/* Audio */

		this.load.audio( 'music', 'assets/sounds/music.ogg' );
		this.load.audio( 'jump', 'assets/sounds/jump.ogg' );
		this.load.audio( 'land', 'assets/sounds/land.wav' );
		this.load.audio( 'skid', 'assets/sounds/skid.wav' );
		this.load.audio( 'climb1', 'assets/sounds/climb1.wav' );
		this.load.audio( 'climb2', 'assets/sounds/climb2.wav' );
		this.load.audio( 'pop', 'assets/sounds/pop.ogg' );


		// Loading progress bar
		var scale = 4;
		var x = this.game.world.centerX - this.game.cache.getImage( 'preloader-bar' ).width / 2 * scale;
		var y = this.game.world.centerY;
		var progressBg = this.game.add.sprite( x, y, 'preloader-bar' );
		var progressFg = this.game.add.sprite( x, y, 'preloader-bar' );
		progressBg.tint = 0x42A5F5;
		progressBg.anchor.set( 0, 0.5 );
		progressFg.anchor.set( 0, 0.5 );
		progressBg.scale.set( scale );
		progressFg.scale.set( scale );
		this.game.load.setPreloadSprite( progressFg );

	},
	create: function () {
		Global.Audio = new AudioManager();

		this.state.start( 'MainMenu', Phaser.Plugin.StateTransition.Out.ScaleUp );
	}
};
