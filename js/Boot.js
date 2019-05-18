var Kid = Kid || {};

Kid.Boot = function() {};

Kid.Boot.prototype = {
	preload: function() {
		this.load.image( 'preloader-bar', 'assets/sprites/preloader-bar.png' );
	},
	create: function() {
		this.game.physics.startSystem( Phaser.Physics.ARCADE );
		this.state.start( 'Preload' );
	},
};
