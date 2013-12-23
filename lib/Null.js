var
	Cmd = require('./Cmd.js'),
	Data = require('./Data.js')
	;

var _Null = function(config, server_info) {

	var Null = this

	var $ = {}

	$.state = {}

	$.data = new Data({ name: server_info.name })

	$.cmd = new Cmd("Null Commands")
	$.scmd = new Cmd("Null Server Commands")

	$.data.switchConvo("default")

	Null.init = function() {
	}

	Null.cmdNotSupp = function(tokens) {
	}

	Null.cmdClear = function(tokens) {
	}

	Null.cmdHello = function(tokens) {
	}

	Null.initCommands = function() {
		var cmds = [ "/quit", "/connect", "/join", "/part", "/msg", "/nick", "/topic" ]
		for (var v in cmds) {
			var cmd = cmds[v]
			$.cmd.addCmd(cmd,Null.cmdNotSupp)
		}

		$.cmd.addCmd("/clear",Null.cmdClear)
		$.cmd.addCmd("/hello",Null.cmdHello)
	}

	Null.init()
}

module.exports = _Null
