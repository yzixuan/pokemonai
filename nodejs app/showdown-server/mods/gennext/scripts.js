exports.BattleScripts = {
	init: function() {
		this.modData('Pokedex', 'cherrimsunshine').types = ['Grass', 'Fire'];

		// Give Hurricane to all the Bug/Flying Quiver-dancers
		// Precedent: Volcarona
		this.modData('Learnsets', 'masquerain').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'butterfree').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'beautifly').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'mothim').learnset.hurricane = ['5L100'];

		// Masquerain also gets Surf because we want it to be viable
		this.modData('Learnsets', 'masquerain').learnset.surf = ['5M'];

		// Shuckle gets Leech Seed
		this.modData('Learnsets', 'shuckle').learnset.leechseed = ['5L100'];

		// Roserade gets Sludge
		this.modData('Learnsets', 'roserade').learnset.sludge = ['5L100'];

		// Meloetta: Fiery Dance
		this.modData('Learnsets', 'meloetta').learnset.fierydance = ['5L100'];

		// Galvantula: Zap Cannon
		this.modData('Learnsets', 'galvantula').learnset.zapcannon = ['5L100'];

		// Virizion: Horn Leech
		this.modData('Learnsets', 'virizion').learnset.hornleech = ['5L100'];

		// Scolipede, Milotic, Steelix: Coil
		this.modData('Learnsets', 'milotic').learnset.coil = ['5L100'];
		this.modData('Learnsets', 'scolipede').learnset.coil = ['5L100'];
		this.modData('Learnsets', 'steelix').learnset.coil = ['5L100'];

		// Rotoms: lots of moves
		this.modData('Learnsets', 'rotomwash').learnset.bubblebeam = ['5L100'];
		this.modData('Learnsets', 'rotomfan').learnset.hurricane = ['5L100'];
		this.modData('Learnsets', 'rotomfan').learnset.twister = ['5L100'];
		this.modData('Learnsets', 'rotomfrost').learnset.frostbreath = ['5L100'];
		this.modData('Learnsets', 'rotomheat').learnset.heatwave = ['5L100'];
		this.modData('Learnsets', 'rotommow').learnset.magicalleaf = ['5L100'];

		// Zororark: much wider movepool
		this.modData('Learnsets', 'zoroark').learnset.earthquake = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.stoneedge = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.icebeam = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.xscissor = ['5M'];
		this.modData('Learnsets', 'zoroark').learnset.gigadrain = ['5T'];
		this.modData('Learnsets', 'zoroark').learnset.superpower = ['5T'];

		// Aipom: eggSketch! :D
		this.modData('Learnsets', 'aipom').learnset.sketch = ['5E'];

		// Azumarill: free Belly Drum
		this.modData('Learnsets', 'azumarill').learnset.bellydrum = ['5L100'];

		// Spinda: free Superpower
		this.modData('Learnsets', 'spinda').learnset.superpower = ['5L100'];

		// Venusaur
		this.modData('Pokedex', 'venusaur').abilities['1'] = 'Leaf Guard';
		// Charizard
		this.modData('Pokedex', 'charizard').abilities['1'] = 'Flash Fire';
		// Blastoise
		this.modData('Pokedex', 'blastoise').abilities['1'] = 'Shell Armor';
		// Meganium
		this.modData('Pokedex', 'meganium').abilities['1'] = 'Harvest';
		// Typhlosion
		this.modData('Pokedex', 'typhlosion').abilities['1'] = 'Flame Body';
		// Feraligatr
		this.modData('Pokedex', 'feraligatr').abilities['1'] = 'Intimidate';
		// Sceptile
		this.modData('Pokedex', 'sceptile').abilities['1'] = 'Limber';
		// Blaziken
		this.modData('Pokedex', 'blaziken').abilities['1'] = 'Reckless';
		// Swampert
		this.modData('Pokedex', 'swampert').abilities['1'] = 'Hydration';
		// Torterra
		this.modData('Pokedex', 'torterra').abilities['1'] = 'Weak Armor';
		// Infernape
		this.modData('Pokedex', 'infernape').abilities['1'] = 'No Guard';
		// Empoleon
		this.modData('Pokedex', 'empoleon').abilities['1'] = 'Ice Body';
		// Serperior
		this.modData('Pokedex', 'serperior').abilities['1'] = 'Own Tempo';
		// Emboar
		this.modData('Pokedex', 'emboar').abilities['1'] = 'Sheer Force';
		// Samurott
		this.modData('Pokedex', 'samurott').abilities['1'] = 'Technician';

		// Every DW ability that isn't Shadow Tag becomes released
		for (var i in this.data.FormatsData) {
			if (i !== 'chandelure' && i !== 'gothitelle') {
				this.modData('FormatsData', i).dreamWorldRelease = true;
			}
		}
	}
};
