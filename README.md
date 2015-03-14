#PokeApp
PokeApp is a web app built on top of an old version of Pokemon Showdown to enhance the Pokemon battling experience. Users can create accounts and login to store simple battle statistics (e.g. wins and losses), compare themselves to others on a leaderboard and accumulate various achievements through winning in specific tiers. Players can also submit JavaScript scripts to automate their fights for them.

## Installation

Part 1: Setting up the client server

1. Install Node.js from http://nodejs.org/.
2. Install Node Package Manager (NPM) You can refer to a tutorial at http://blog.nodeknockout.com/post/33857791331/how-to-install-node-npm to learn how to install node and npm.
3. Install MongoDB from http://www.mongodb.org/. Installation instructions can be found at http://docs.mongodb.org/manual/installation/. Start mongod.exe as per the instructions (if you close the command window, that will shut off the database, so you will have to restart mongod.exe each time you do that).
4. After installing both, use command-line prompts to navigate to pokemonai/nodejs app.
5. Install jquery module using NPM. (start your command-line/terminal and type ‘npm install jquery’)
6. Run the command ‘node pokebot’. Again, if you shut off the command window, you will have to repeat this step to get the app to work.
7. In the addressbar, type ‘localhost:3000’ and the app should appear. To use the simulator, create an account. The account details will be stored on your local database.

The simulator will not work until the other server is set up.

Part 2: Setting up the Showdown server

1. Follow the instructions at https://github.com/Zarel/Pokemon-Showdown (but don’t download the files as they are already in our repository, with a few changes made, in the folder showdown-server). 
2. Navigate to the showdown-server folder and install jquery module using NPM. (open your command-line/terminal and type ‘npm install jquery’).
3. To access the simulator, go through the Play page of the app.
4. For the battle simulator to work, please click on the Home button in the simulator first. To fight a battle, choose any name on the simulator (it’s temporary). 

## License

This project is licensed under the terms of the MIT license.
