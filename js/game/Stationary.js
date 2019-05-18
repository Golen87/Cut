Stationary = function (x, y, key, group)
{
	this.sprite = group.create( x, y, key );
	this.sprite.owner = this;

	this.sprite.body.allowGravity = false;
	this.sprite.body.immovable = true;
};