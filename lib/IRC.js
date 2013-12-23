var
	logger = require('winston'),
	irc = require('irc'),
	misc = require('./Misc.js'),
	Data = require('./Data.js'),
	Cmd = require('./Cmd.js')
	;

var _Irc = function(config, server_info) {
	var Irc = this
	var $ = {}
	$.config = config
	$.info = server_info
	$.conn = {}

	$.data = new Data({ name: server_info.name })
	$.cmd = new Cmd("IRC Commands")
	$.scmd = new Cmd("IRC Server Commands")

	/*
	 * nick = current nick
	 * convo = current convo {tag:channel_or_nick}
	 */
	$.state = {
		nick : "",
		convo : "",
	}

	$.data.switchConvo("default")

	Irc.getNick = function() {
		if($.info.nicks instanceof Array) {
			return $.info.nicks[misc.rand($.info.nicks.length-1)]
		}
		else {
			return $.info.nicks
		}
	}

	Irc.getServer = function() {
		if($.info.servers instanceof Array) {
			return $.info.servers[misc.rand($.info.servers.length-1)]
		}
		else {
			return $.info.servers
		}
	}

	Irc.connect = function() {
		$.state.nick = Irc.getNick()
		$.conn = new irc.Client(Irc.getServer(), $.state.nick, /*{ channels : $.info.channels }*/ $.info)

		$.conn.addListener('message', function(from, to, message) {
			logger.info("Irc:Message", { from: from, to: to, data: message })
			$.data.recvMessage(from, to, message)
		})

		$.conn.addListener('pm', function(from, message) {
			logger.info("Irc:Pm", { from: from, data: message })
			$.data.recvMessage(from, $.state.nick, message)
		})

		$.conn.addListener('raw', function(message) {
			logger.info("Irc:Raw", { data: message })
			try {
				var fn = $.scmd.getCmd(message.command)
				fn(message)
			} catch(err) {
				logger.info("Irc:Raw:UnknownCommand", { command: message.command })
			}
		})

		$.conn.addListener('error', function(message) {
			logger.info("Irc:Error", { data: message })
		})
	}


	/* User Functions */

	Irc.cmdQuit = function(tokens) {
	}

	Irc.cmdConnect = function(tokens) {
	}

	Irc.cmdJoin = function(tokens) {
		$.data.switchConvo(tokens[1])
		$.conn.join(tokens[1])
	}

	Irc.cmdTalk = function(tokens) {
		$.data.addConvo(tokens[1])
	}

	Irc.cmdAll = function(tokens) {
		$.data.switchConvo("default")
	}

	Irc.cmdPart = function(tokens) {
		$.data.partConvo(tokens[1])
		$.conn.part(tokens[1])
	}

	Irc.cmdMsg = function(tokens) {
		var message = tokens.splice(0,1)
		message = message.join(" ")
		$.data.sendMessage(tokens[1], tokens)
	}

	Irc.cmdSend = function(tokens) {
		var current_convo = $.data.getCurrentConvo()
		if (current_convo == "" || current_convo == "default") {
			$.data.printError("Please join a channel or privmsg query")
			return
		}
		var message
//		tokens.splice(0,1)
		message = tokens.join(" ")
//		console.log(tokens, message)
		$.data.sendMessageCurrent(message)
		$.conn.say(current_convo, message)
	}

	Irc.cmdNick = function(tokens) {
	}

	Irc.cmdTopic = function(tokens) {
	}

	Irc.cmdClear = function(tokens) {
	}

	Irc.cmdHelp = function(tokens) {
	}

	Irc.cmdInfo = function(tokens) {
	}

	Irc.cmdHello = function(tokens) {
		$.config.panes.chat.addLine("Wurld.")
	}

	Irc.initCommands = function() {
		$.cmd.addCmd("/quit",Irc.cmdQuit)
		$.cmd.addCmd("/connect",Irc.cmdConnect)
		$.cmd.addCmd("/join",Irc.cmdJoin)
		$.cmd.addCmd("/talk",Irc.cmdTalk)
		$.cmd.addCmd("/all",Irc.cmdAll)
		$.cmd.addCmd("/part",Irc.cmdPart)
		$.cmd.addCmd("/msg",Irc.cmdMsg)
		$.cmd.addCmd("/send",Irc.cmdSend)
		$.cmd.addCmd("/nick",Irc.cmdNick)
		$.cmd.addCmd("/topic",Irc.cmdTopic)
		$.cmd.addCmd("/clear",Irc.cmdClear)
		$.cmd.addCmd("/help",Irc.cmdHelp)
		$.cmd.addCmd("/info",Irc.cmdInfo)
		$.cmd.addCmd("/hello",Irc.cmdHello)
	}


	/* Server Functions */

	Irc.scmdJOIN = function(message) {
		$.data.xJoinedConvo(message.nick, message.args[0])
	}

	Irc.scmdPART = function(message) {
		$.data.xPartedConvo(message.nick, message.args[0])
	}

	Irc.scmdNames = function(message) {
		var args = message.args[3]
		args = args.split(' ')
		for (var v in args) {
			var user = args[v]
			var to = message.args[2]
			$.data.xJoinedConvo(user, to)
		}
	}

	Irc.initServerCommands = function() {
		$.scmd.addCmd("JOIN",Irc.scmdJOIN)
		$.scmd.addCmd("PART",Irc.scmdPART)
		$.scmd.addCmd("rpl_namreply",Irc.scmdNames)
	}


	Irc.tryCmd = function(cmd, tokens) {
		try {
			cmd = (cmd[0] == '/' ? cmd : '/send')
			var fn = $.cmd.getCmd(cmd)
			fn(tokens)
		} catch(err) {
			logger.info("IRC: Command not found", { error: err })
			$.config.panes.chat.addLine("IRC: Command not found.")
			return null
		}
	}

	Irc.init = function() {
		Irc.initServerCommands()
		Irc.initCommands()
		Irc.connect()
	}

	Irc.init()
}

module.exports = _Irc
