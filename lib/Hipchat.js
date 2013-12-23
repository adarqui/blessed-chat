var
	logger = require('winston'),
	wobot = require('wobot'),
	Data = require('./Data.js'),
	Cmd = require('./Cmd.js')
	;

var _Hipchat = function(config, server_info) {
	var Hipchat = this
	var $ = {}
	$.config = config
	$.info = server_info
	$.conn = {}

	$.data = new Data({ name: server_info.name })
	$.cmd = new Cmd("Hipchat Commands")
	$.scmd = new Cmd("Hipchat Server Commands")

	$.state = {
		autojoin : false,
		nick : "",
		convo : "",
		rooms : {},
		roomsJid : {},
		users : {},
		usersJid : {},
	}

	$.data.switchConvo("default")

	Hipchat.getJid = function() {
		return $.info.jid
	}

	Hipchat.getHost = function() {
		return $.info.host
	}

	Hipchat.getMucHost = function() {
		return $.info.mucHost
	}

	Hipchat.getPassword = function() {
		return $.info.password
	}

	Hipchat.connect = function() {
		$.conn = new wobot.Bot({
			jid : Hipchat.getJid(),
			password : Hipchat.getPassword(),
			debug : $.info.debug,
			host : Hipchat.getHost(),
			mucHost : Hipchat.getMucHost(),
		})

		$.conn.connect()

		$.conn.onError(function(condition,text,stanza) {
//			console.log("error",condition,text,stanza)
			logger.info("Hipchat:Error", { condition: condition, text: text, stanza: stanza })
		})

		Hipchat.setHooks()
	}

	Hipchat.setHooks = function() {
		$.conn.onConnect(function(err,data) {

			$.conn.onPing(function(data) {
//				console.log("ping",data)
//				$.config.panes.screen
				logger.info("Hipchat:Ping", { data: data })
			})

			$.conn.getRooms(function(err,items,stanza) {
				//console.log("getRooms",err,items,stanza)
				logger.info("Hipchat:GetRooms", { err: err, items: items, stanza: stanza })

				for (var v in items) {
					var room = items[v]
					room.nameSanitized = room.name.replace(/ /g,'')
					$.state.rooms[room.nameSanitized] = room
					$.state.roomsJid[room.jid] = room
				}

				Hipchat.joinRooms()
			})

			$.conn.getRoster(function(err,items,stanza) {
//				console.log("getRoster",err,items,stanza)
				logger.info("Hipchat:GetRoster", { err: err, items: items, stanza: stanza })
				for (var v in items) {
					var user = items[v]
					user.nameSanitized = user.name.replace(/ /g, '')
					$.state.users[user.nameSanitized] = user
					$.state.usersJid[user.jid] = user
				}
			})


			$.conn.onMessage(function(channel, from, message) {
//				console.log("chan, from, msg", channel, from, message)
				logger.info("Hipchat:Message", { from : from, to : channel, data : message })
				var chan = Hipchat.translateConvoJid(channel)
				if (chan == null) {
					return
				}

				$.data.recvMessage(from, chan.nameSanitized, message)
			})

		})
	}



	Hipchat.joinRooms = function() {
		if ($.state.autojoin == true) {
			return
		}

		for (var v in $.info.rooms) {
			var room = $.info.rooms[v]
			Hipchat.joinRoom(room)
		}

		$.state.autojoin = true
	}

	Hipchat.joinRoom = function(room) {
		var room = $.state.rooms[room]
		if (room == undefined) return

		$.conn.join(room.jid,30)
	}

	Hipchat.partRoom = function(room) {
		var room = $.state.rooms[room]
		if (room == undefined) return
		$.conn.part(room.jid)
	}

	/* User Functions */

	Hipchat.cmdHello = function(tokens) {
		$.config.panes.chat.addLine("Wurld.")
	}

	Hipchat.cmdJoin = function(tokens) {
//		$.data.addConvo(tokens[1])
		$.data.switchConvo(tokens[1])
		Hipchat.joinRoom(tokens[1])
	}

	Hipchat.cmdTalk = function(tokens) {
		var room = $.state.rooms[tokens[1]]
		if (room == undefined) return

		$.data.addConvo(tokens[1])
	}

	Hipchat.cmdAll = function(tokens) {
//		$.data.partConvo(undefined)
		$.data.switchConvo("default")
	}

	Hipchat.cmdPart = function(tokens) {
		$.data.partConvo(tokens[1])
		Hipchat.partRoom(tokens[1])
	}

	Hipchat.cmdSend = function(tokens) {
		var current_convo = $.data.getCurrentConvo()
		if (current_convo == "" || current_convo == "default") {
			$.data.printError("Please join a channel or privmsg query")
			return
		}
		var room = $.state.rooms[current_convo]
		if (room == undefined) {
			return
		}

		var message
//		tokens.splice(0,1)
		message = tokens.join(" ")
		$.data.sendMessageCurrent(message)
		$.conn.message(room.jid, message)
	}

	Hipchat.initCommands = function() {
		$.cmd.addCmd("/join",Hipchat.cmdJoin)
		$.cmd.addCmd("/part",Hipchat.cmdPart)
		$.cmd.addCmd("/talk",Hipchat.cmdTalk)
		$.cmd.addCmd("/all",Hipchat.cmdAll)
		$.cmd.addCmd("/send",Hipchat.cmdSend)
		$.cmd.addCmd("/hello",Hipchat.cmdHello)
	}

	/* Server Functions */

	Hipchat.scmdJOIN = function(message) {
	}

	Hipchat.initServerCommands = function() {
		$.scmd.addCmd("JOIN",Hipchat.scmdJOIN)
	}


	/*
	 * Nick & Channel translation
	 */
	Hipchat.translateConvo = function(user_or_room) {
		var res
		try {
			res = $.state.rooms[user_or_room]
			return res
		} catch(err) {
		}

		try {
			res = $.state.users[user_or_room]
			return res
		} catch(err) {
		}

		return null
	}

	Hipchat.translateConvoJid = function(jid) {
		var res
		try {
			res = $.state.roomsJid[jid]
			return res
		} catch(err) {
		}

		try {
			res = $.state.usersJid[jid]
			return res
		} catch(err) {
		}

		return null
	}

	Hipchat.tryCmd = function(cmd, tokens) {
		try {
			cmd = (cmd[0] == '/' ? cmd : '/send')
			var fn = $.cmd.getCmd(cmd)
			fn(tokens)
		} catch(err) {
			logger.info("Hipchat: Command not found", { error : err })
			$.config.panes.chat.addLine("Hipchat: Command not found.")
		}
	}

	Hipchat.init = function() {
		Hipchat.initServerCommands()
		Hipchat.initCommands()
		Hipchat.connect()

		/* Need to pass this so we can translate usernames to jid's etc */
		$.data.addTranslateConvo(Hipchat.translateConvo)
	}

	Hipchat.init()
}


module.exports = _Hipchat
