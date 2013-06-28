/**
 * Command parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the command parser. Call it with CommandParser.parse
 * (scroll down to its definition for details)
 *
 * Individual commands are put in:
 *   commands.js - "core" commands that shouldn't be modified
 *   config/commands.js - other commands that can be safely modified
 *
 * The command API is (mostly) documented in config/commands.js
 *
 * @license MIT license
 */

/*

To reload chat commands:

/hotpatch chat

*/

const MAX_MESSAGE_LENGTH = 300;

const BROADCAST_COOLDOWN = 20*1000;

const MESSAGE_COOLDOWN = 5*60*1000;

const MAX_PARSE_RECURSION = 10;

var crypto = require('crypto');

var modlog = exports.modlog = modlog || fs.createWriteStream('logs/modlog.txt', {flags:'a+'});

/**
 * Command parser
 *
 * Usage:
 *   CommandParser.parse(message, room, user, connection)
 *
 * message - the message the user is trying to say
 * room - the room the user is trying to say it in
 * user - the user that sent the message
 * connection - the connection the user sent the message from
 *
 * Returns the message the user should say, or a falsy value which
 * means "don't say anything"
 *
 * Examples:
 *   CommandParser.parse("/join lobby", room, user, connection)
 *     will make the user join the lobby, and return false.
 *
 *   CommandParser.parse("Hi, guys!", room, user, connection)
 *     will return "Hi, guys!" if the user isn't muted, or
 *     if he's muted, will warn him that he's muted, and
 *     return false.
 */
var parse = exports.parse = function(message, room, user, connection, levelsDeep) {
	var cmd = '', target = '';
	if (!message || !message.trim().length) return;
	if (!levelsDeep) levelsDeep = 0;

	if (message.substr(0,3) === '>> ') {
		// multiline eval
		message = '/eval '+message.substr(3);
	} else if (message.substr(0,4) === '>>> ') {
		// multiline eval
		message = '/evalbattle '+message.substr(4);
	}

	if (message.substr(0,2) !== '//' && message.substr(0,1) === '/') {
		var spaceIndex = message.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = message.substr(1, spaceIndex-1);
			target = message.substr(spaceIndex+1);
		} else {
			cmd = message.substr(1);
			target = '';
		}
	} else if (message.substr(0,1) === '!') {
		var spaceIndex = message.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = message.substr(0, spaceIndex);
			target = message.substr(spaceIndex+1);
		} else {
			cmd = message;
			target = '';
		}
	}
	cmd = cmd.toLowerCase();
	var broadcast = false;
	if (cmd.charAt(0) === '!') {
		broadcast = true;
		cmd = cmd.substr(1);
	}

	var commandHandler = commands[cmd];
	if (typeof commandHandler === 'string') {
		// in case someone messed up, don't loop
		commandHandler = commands[commandHandler];
	}
	if (commandHandler) {
		var context = {
			sendReply: function(data) {
				if (this.broadcasting) {
					room.add(data, true);
				} else {
					connection.sendTo(room, data);
				}
			},
			sendReplyBox: function(html) {
				this.sendReply('|raw|<div class="infobox">'+html+'</div>');
			},
			popupReply: function(message) {
				connection.popup(message);
			},
			add: function(data) {
				room.add(data, true);
			},
			send: function(data) {
				room.send(data);
			},
			privateModCommand: function(data) {
				for (var i in room.users) {
					if (room.users[i].group in {'%':1, '@':1, '&':1, '~':1}) {
						room.users[i].sendTo(room, data);
					}
				}
				this.logEntry(data);
				this.logModCommand(data);
			},
			logEntry: function(data) {
				room.logEntry(data);
			},
			addModCommand: function(result) {
				this.add(result);
				this.logModCommand(result);
			},
			logModCommand: function(result) {
				modlog.write('['+(new Date().toJSON())+'] ('+room.id+') '+result+'\n');
			},
			can: function(permission, target) {
				if (!user.can(permission, target)) {
					this.sendReply('/'+cmd+' - Access denied.');
					return false;
				}
				return true;
			},
			canBroadcast: function() {
				if (broadcast) {
					message = this.canTalk(message);
					if (!message) return false;
					if (!user.can('broadcast')) {
						connection.send("You need to be voiced to broadcast this command's information.");
						connection.send("To see it for yourself, use: /"+message.substr(1));
						return false;
					}

					this.add('|c|'+user.getIdentity(room.id)+'|'+message);

					// broadcast cooldown
					var normalized = toId(message);
					if (CommandParser.lastBroadcast === normalized &&
							CommandParser.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN) {
						return false;
					}
					CommandParser.lastBroadcast = normalized;
					CommandParser.lastBroadcastTime = Date.now();

					this.broadcasting = true;
				}
				return true;
			},
			parse: function(message) {
				if (levelsDeep > MAX_PARSE_RECURSION) {
					return this.sendReply("Error: Too much recursion");
				}
				return parse(message, room, user, connection, levelsDeep+1);
			},
			canTalk: function(message, relevantRoom) {
				var innerRoom = (relevantRoom !== undefined) ? relevantRoom : room;
				return canTalk(user, innerRoom, connection, message);
			},
			targetUserOrSelf: function(target) {
				if (!target) return user;
				this.splitTarget(target);
				return this.targetUser;
			},
			splitTarget: splitTarget
		};

		var result = commandHandler.call(context, target, room, user, connection, cmd, message);
		if (result === undefined) result = false;

		return result;
	} else {
		// Check for mod/demod/admin/deadmin/etc depending on the group ids
		for (var g in config.groups) {
			if (cmd === config.groups[g].id) {
				return parse('/promote ' + toUserid(target) + ',' + g, room, user, connection);
			} else if (cmd === 'de' + config.groups[g].id || cmd === 'un' + config.groups[g].id) {
				var nextGroup = config.groupsranking[config.groupsranking.indexOf(g) - 1];
				if (!nextGroup) nextGroup = config.groupsranking[0];
				return parse('/demote' + toUserid(target) + ',' + nextGroup, room, user, connection);
			}
		}

		if (message.substr(0,1) === '/' && cmd) {
			// To guard against command typos, we now emit an error message
			return connection.send('The command "/'+cmd+'" was unrecognized. To send a message starting with "/'+cmd+'", type "//'+cmd+'".');
		}
	}

	message = canTalk(user, room, connection, message);
	if (!message) return false;

	return message;
};

function splitTarget(target, exactName) {
	var commaIndex = target.indexOf(',');
	if (commaIndex < 0) {
		targetUser = Users.get(target, exactName)
		this.targetUser = targetUser;
		this.targetUsername = (targetUser?targetUser.name:target);
		return '';
	}
	var targetUser = Users.get(target.substr(0, commaIndex), exactName);
	if (!targetUser) {
		targetUser = null;
	}
	this.targetUser = targetUser;
	this.targetUsername = (targetUser?targetUser.name:target.substr(0, commaIndex));
	return target.substr(commaIndex+1).trim();
}

/**
 * Can this user talk?
 * Shows an error message if not.
 */
function canTalk(user, room, connection, message) {
	if (!user.named) {
		connection.popup("You must choose a name before you can talk.");
		return false;
	}
	if (room && user.locked) {
		connection.sendTo(room, 'You are locked from talking in chat.');
		return false;
	}
	if (room && user.mutedRooms[room.id]) {
		connection.sendTo(room, 'You are muted and cannot talk in this room.');
		return false;
	}
	if (config.modchat && room && room.id === 'lobby') {
		if (config.modchat === 'crash') {
			if (!user.can('ignorelimits')) {
				connection.sendTo(room, 'Because the server has crashed, you cannot speak in lobby chat.');
				return false;
			}
		} else {
			if (!user.authenticated && config.modchat === true) {
				connection.sendTo(room, 'Because moderated chat is set, you must be registered to speak in lobby chat. To register, simply win a rated battle by clicking the look for battle button');
				return false;
			} else if (config.groupsranking.indexOf(user.group) < config.groupsranking.indexOf(config.modchat)) {
				var groupName = config.groups[config.modchat].name;
				if (!groupName) groupName = config.modchat;
				connection.sendTo(room, 'Because moderated chat is set, you must be of rank ' + groupName +' or higher to speak in lobby chat.');
				return false;
			}
		}
	}
	if (room && !(user.userid in room.users)) {
		connection.popup("You can't send a message to this room without being in it.");
		return false;
	}

	if (message) {
		if (message.length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
			connection.popup("Your message is too long:\n\n"+message);
			return false;
		}

		// hardcoded low quality website
		if (/\bnimp\.org\b/i.test(message)) return false;

		// remove zalgo
		message = message.replace(/[\u0300-\u036f]{3,}/g,'');

		if (room && room.id === 'lobby') {
			var normalized = message.trim();
			if ((normalized === user.lastMessage) &&
					((Date.now() - user.lastMessageTime) < MESSAGE_COOLDOWN)) {
				connection.popup("You can't send the same message again so soon.");
				return false;
			}
			user.lastMessage = message;
			user.lastMessageTime = Date.now();
		}

		if (config.chatfilter) {
			return config.chatfilter(user, room, connection.socket, message);
		}
		return message;
	}

	return true;
}

exports.package = {};
fs.readFile('package.json', function(err, data) {
	if (err) return;
	exports.package = JSON.parse(data);
});

exports.uncacheTree = function(root) {
	var uncache = [require.resolve(root)];
	do {
		var newuncache = [];
		for (var i = 0; i < uncache.length; ++i) {
			if (require.cache[uncache[i]]) {
				newuncache.push.apply(newuncache,
					require.cache[uncache[i]].children.map(function(module) {
						return module.filename;
					})
				);
				delete require.cache[uncache[i]];
			}
		}
		uncache = newuncache;
	} while (uncache.length > 0);
};

// This function uses synchronous IO in order to keep it relatively simple.
// The function takes about 0.023 seconds to run on one tested computer,
// which is acceptable considering how long the server takes to start up
// anyway (several seconds).
exports.computeServerVersion = function() {
	/**
	 * `filelist.txt` is a list of all the files in this project. It is used
	 * for computing a checksum of the project for the /version command. This
	 * information cannot be determined at runtime because the user may not be
	 * using a git repository (for example, the user may have downloaded an
	 * archive of the files).
	 *
	 * `filelist.txt` is generated by running `git ls-files > filelist.txt`.
	 */
	var filenames;
	try {
		var data = fs.readFileSync('filelist.txt', {encoding: 'utf8'});
		filenames = data.split('\n');
	} catch (e) {
		return 0;
	}
	var hash = crypto.createHash('md5');
	for (var i = 0; i < filenames.length; ++i) {
		try {
			hash.update(fs.readFileSync(filenames[i]));
		} catch (e) {}
	}
	return hash.digest('hex');
};

exports.serverVersion = exports.computeServerVersion();

/*********************************************************
 * Commands
 *********************************************************/

var commands = exports.commands = require('./commands.js').commands;

var customCommands = require('./config/commands.js');
if (customCommands && customCommands.commands) {
	Object.merge(commands, customCommands.commands);
}
