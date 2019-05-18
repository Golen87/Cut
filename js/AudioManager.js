function AudioManager()
{
	this.sounds = {};

	/*
	var name = 'walking_grass';
	var vol = 0.2;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( '6', 2.300, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];

	var name = 'music';
	var vol = Global.music;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol*0.8;
	this.sounds[name].sound.loop = true;

	var name = 'ambience';
	var vol = Global.ambience;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol*0.1;
	this.sounds[name].sound.loop = true;
	*/
};

AudioManager.prototype.getMarkers = function ( name, marker=null )
{
	if ( marker ) {
		if ( this.sounds[name].markers ) {
			return this.sounds[name].markers[marker];
		}
		else {
			return [marker];
		}
	}
	else {
		return this.sounds[name].markers;
	}
};

AudioManager.prototype.play = function ( name, marker=null )
{
	if ( !Global.sound )
		return;

	var vol = this.sounds[name].sound.volume;
	var index = '';
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do {
			index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1
		);

		this.sounds[name].lastPlayed = index;
		vol = this.sounds[name].sound.markers[index]['volume'];
	}

	this.sounds[name].sound.play( index, 0, Global.sound * vol );
};

AudioManager.prototype.updateMusic = function ()
{
	//this.sounds['music'].sound.volume = Global.music*0.8;
	//this.sounds['ambience'].sound.volume = Global.ambience*0.1;
};