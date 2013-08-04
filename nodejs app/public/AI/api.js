//pokebot ai api:
// Constructor to be called by client-battle
// Make all variables global and private which can only be accessed by GET functions.

 // put this in client-battle

// Constructor
function api(){
	this.ownTeam = null;
}

api.prototype.getOwnTeam = function() {
	// Returns an array of JSON objects.
	return this.ownTeam;
}

api.prototype.setOwnTeam = function(team){
	this.ownTeam = team;
}

api.prototype.getChanges = function() {
	/*data reported back to the ai:
		1) hp change
		2) status change
		3) ability change
		4) ability activation
		5) item activation
		6) item change
		7) active pokemon change
		8) stat change
		9) weather change
		10) critical hit trigger
		11) type change*/
}


/*=====================
OTHER FUNCTIONS (KIV)
======================*/



