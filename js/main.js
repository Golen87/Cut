var Kid = Kid || {};

var SCREEN_WIDTH = 64*14;
var SCREEN_HEIGHT = 64*10;
Kid.game = new Phaser.Game( SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS );

Kid.game.state.add( 'Boot', Kid.Boot );
Kid.game.state.add( 'Preload', Kid.Preload );
Kid.game.state.add( 'MainMenu', Kid.MainMenu );
Kid.game.state.add( 'Game', Kid.Game );
Kid.game.state.add( 'Credits', Kid.Credits );

Kid.game.state.start( 'Boot' );

Kid.debug = false;

var RED = 'rgba(255,0,0,0.4)';
var YELLOW = 'rgba(255,255,0,0.4)';
var GREEN = 'rgba(0,255,0,0.4)';
var CYAN = 'rgba(0,255,255,0.4)';
var BLUE = 'rgba(0,0,255,0.4)';
var PURPLE = 'rgba(255,0,255,0.4)';