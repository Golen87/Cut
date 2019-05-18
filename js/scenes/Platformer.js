class Platformer extends Phaser.Scene {
	constructor() {
		super({key: 'Platformer'});
	}

	preload() {
	}

	create() {
		this.add.image(400, 300, 'sky');
	}

	update(delta) {
	}
}