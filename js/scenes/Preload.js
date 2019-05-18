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
	}

	create() {
		this.scene.start("Platformer");
	}
}