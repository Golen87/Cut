
// Constructor
function AudioManager()
{
	this.sounds = {};

	this.init();
};

AudioManager.prototype.init = function ()
{
	//addMarker(name, start, duration, volume, loop)

	var masterVol = 0.6;

	var name = 'music';
	var vol = 0.5 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'jump';
	var vol = 0.3 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'land';
	var vol = 0.5 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'skid';
	var vol = 0.2 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'swing';
	var vol = 0.9 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );
	this.sounds[name].sound.allowMultiple = true;

	var name = 'climb1';
	var vol = 0.4 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'climb2';
	var vol = 0.4 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'pop';
	var vol = 0.3 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );

	var name = 'enemy_hurt';
	var vol = 0.4 * masterVol;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name, vol );
};

AudioManager.prototype.getMarkers = function ( name, marker=null )
{
	if ( marker )
		return this.sounds[name].markers[marker];
	else
		return this.sounds[name].markers;
};

AudioManager.prototype.play = function ( name, marker=null )
{
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do
		{
			var index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1 );

		this.sounds[name].lastPlayed = index;
		this.sounds[name].sound.play( index );
	}
	else
	{
		this.sounds[name].sound.play();
	}
};

AudioManager.prototype.loop = function ( name, marker=null )
{
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do
		{
			var index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1 );

		this.sounds[name].lastPlayed = index;
		this.sounds[name].sound.loopFull( index );
	}
	else
	{
		this.sounds[name].sound.loopFull();
	}
};
