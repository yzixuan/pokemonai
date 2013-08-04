(function()
{
		var obj = {
		team: [], // Array to store the pokemon team
		init: function() {
			// Should store its own team

		},
		teamPreviewChoice: function(){
			// Handles team preview (not called for random battles)
			// Return a string with a value from 0 to 5 corresponding to the Pokemon to start with.

		},
		
		decideMove: function() {
			/* Return either a string corresponding to the move made,
			or a string corresponding to the position of the Pokemon to be switched in, 
			starting from 1, up to 5 if you're playing Singles. 
			Your current Pokemon is at position 0. */

		},
		getChanges: function() {
		

		},
		handleKnockout: function() {
		
			/* Should return a string corresponding to the position of the Pokemon to be switched in, 
			starting from 1, up to 5 if you're playing Singles. Your current Pokemon is at position 0. */

		}
	}
	return obj;
})()