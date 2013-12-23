/*
 * hipchat-blessed
 */

var
	Screen = require('./lib/Screen.js'),
	Input = require('./lib/Input.js'),
	Rooms = require('./lib/Rooms.js'),
	Users = require('./lib/Users.js'),
	Title = require('./lib/Title.js'),
	Chat = require('./lib/Chat.js'),
	Irc = require('./lib/IRC.js'),
	Hipchat = require('./lib/Hipchat.js'),
	Misc = require('./lib/Misc.js'),
	UI = require('./lib/UI.js'),
	Debug = require('./lib/Debug'),
	Null = require('./lib/Null'),
	wobot = require('wobot'),
	irc = require('irc'),
	blessed = require('blessed'),
	fs = require('fs'),
	events = require('events'),
	logger = require('winston'),
	_ = require('underscore');

var c = {
	irc : [],
	hipchat : [],
	other : [],
	chats : {}
};

/*
 * OMG GLOBALS!
 *
 * current = current module + {name,convo} for example: convo = { irc, "efnet", "#blessed" }
 *
 * global variables, making life easier, one global at a time
 */
state = {
	config : c,
	current : {
		mod : {},
		name : "",
		convo : ""
	}
}

var init = {
	debug : function() {
		debug = new Debug("/tmp/blessed.log")
		logger.info("Initialized", { hello: "world" })
	},
	configs : function() {
		if(process.env['CONF']) {
			c.chats = require(process.env['CONF'])
		} else {
		c.chats = require('./config.js')
		}

		if(process.env['LAYOUT']) {
			c.layout = require(process.env['LAYOUT'])
		} else {
			c.layout = require('./layout.js')
		}
	},
	eventEmitter : function() {
		c.ev = new events.EventEmitter()
	},
	parseServers : function() {
		c.irc = []
		c.hipchat = []
		c.other = []

		/* Add null session, for default data when not in a /use */
		c.chats["blessed"] = {
			type : "null",
		}

		/* Input references c.chats to find the chat module */
		_.each(c.chats, function(value,key,list) {
			logger.info("app.js:Found config entry", { key : key, value : value })
			if (value.active == false) {
				logger.info("app.js:Skipping config entry", { key : key, value : value })
				return
			}
//			value.name = value.type
			value.name = key
			switch(value.type) {
				case 'irc': {
					var irc = new Irc(c, value)
					c.irc.push(irc)
					c.chats[key].mod = irc
					break;
				}
				case 'hipchat' : {
					var hipchat = new Hipchat(c, value)
					c.hipchat.push(hipchat)
					c.chats[key].mod = hipchat
					break;
				}
				case 'null' : {
					var other = new Null(c, value)
					c.other.push(other)
					c.chats[key].mod = other
					break;
				}
				case 'facebook' : {
					break;
				}
				default : break;
			}
		})
	},
	everything : function() {
		init.debug()
		init.configs()
		init.eventEmitter()
		screen = new Screen(c)
		input = new Input(c)
		rooms = new Rooms(c)
		users = new Users(c)
		title = new Title(c)
		chat = new Chat(c)
		ui = new UI(c)

		screen.render()

		c.panes = {
			input : input,
			screen : screen,
			rooms : rooms,
			users : users,
			title : title,
			chat : chat,
			ui : ui,
		}

		c.panesArray = []
		for (var v in c.panes) {
			var pane = c.panes[v]
			if (typeof pane.focusPane === 'function') {
				c.panesArray.push(pane)
			}
		}
		c.panesIndex = 0

		init.parseServers(c)

		for (var v in c.panes) {
			try {
				var pane = c.panes[v]
				pane.deferredInit()
			} catch(err) {
				logger.info("app:DeferredInit", { who: v, err: err.toString() })
			}
		}
	}
}

init.everything()
