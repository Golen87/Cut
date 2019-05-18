var Kid = Kid || {};

Kid.MainMenu = function() {};

Kid.MainMenu.prototype = {
	create: function() {
		Kid.game.stage.backgroundColor = '#eeeeee';

		var x = SCREEN_WIDTH - 50;
		var y = SCREEN_HEIGHT - 100;

		/* Title */
		var title = this.add.bitmapText( x, y, 'BalsamiqBold', 'Kactus Kid', 72 );
		title.tint = 0x777777;
		title.anchor.set( 1, 1 );

		y += 50;
		var subtitle = this.add.bitmapText( x, y, 'BalsamiqBold', '- press start to play -', 32 );
		subtitle.tint = 0x777777;
		subtitle.anchor.set( 1, 1 );

		/* Input */

		var key = Kid.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		key.onDown.add( function() {this.startGame();}, this );
	},
	startGame: function ()
	{
		this.state.start( 'Game' );
	},
};