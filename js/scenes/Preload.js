class Preload extends Phaser.Scene {
	constructor() {
		super({key: 'Preload'});
	}

	preload() {
		this.load.image('cat', 'assets/images/cat.jpeg');
		this.load.image('circle', 'assets/images/circle.png');
		this.load.image('sky', 'assets/images/sky.png');

		this.load.spritesheet(
			'items',
			'assets/images/items.png',
			{ frameWidth: 16, frameHeight: 16 }
		);

		this.load.audio('pop', [ 'assets/audio/pop.ogg', 'assets/audio/pop.mp3' ] );

		this.load.image('sky', 'assets/images/sky.png');
		this.load.image('ground', 'assets/images/platform.png');
		this.load.image('star', 'assets/images/star.png');
		this.load.image('bomb', 'assets/images/bomb.png');
		this.load.spritesheet('dude', 'assets/images/dude.png', { frameWidth: 32, frameHeight: 48 });
	}

	create() {
		this.scene.start("Platformer");
	}
}