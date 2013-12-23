/*
 * hipchat-blessed
 */

var
	logger = require('winston'),
	blessed = require('blessed'),
	Cmd = require('./Cmd.js')
	;

var _Input = function(config) {
	var Input = this

	var $ = {}
	$.config = config
	$.pane = {}
	$.tpl = $.config.layout.input

	$.cmd = new Cmd("Input commands");
	$.state = {
		history : [],
		history_ptr : 0,
	}


	/*
	$.commands = {
	  'quit' : Input.cmd_Quit,
	  'msg' : Input.cmd_Msg,
	  'join' : Input.cmd_Join,
	  'part' : Input.cmd_Part,
	  'win' : Input.cmd_Win,
	}
	*/

	Input.initInputBox = function() {

		$.pane = blessed.textbox({
			bottom :true,
			width: '100%',
			height: '10%',
			border: $.tpl.border,
			fg : $.tpl.fg,
			bg : $.tpl.bg,
			content: '',
			tags: true,
			hoverEffects : $.tpl.hoverEffects,
			input : true,
			keys : true,
			vi : false,
			inputOnFocus : true
		});

		screen.append($.pane)
		$.pane.focus()
	}

	Input.initInputHandler = function() {
		$.pane.on('keypress',function(ch,key) {
			/* Some pre-processing: history */
//			console.log(ch,key)
			var line
//			console.log(ch,key)
			//console.log(ch,key)
			if (ch == undefined && typeof key === 'object') {
				switch(key.full) {
					case 'up': {
						line = Input.getHistoryUp()
						break
					}
					case 'down' : {
						line = Input.getHistoryDown()
						break
					}
					case 'home' : {
						$.pane.readEditor()
						return
					}
					case 'delete' : {
						Input.clear()
					}
					default: {
						return
					}
				}
				if (line == null) {
					return
				}
				Input.clear()
				$.pane.setValue(line.line)
				$.pane.screen.render()
			}
		})

		/*
		$.pane.key(['tab'],function(ch,key) {
//			console.log("yo")
			state.config.panesIndex++
			if (state.config.panesIndex == state.config.panesArray.length) {
				state.config.panesIndex = 0
			}
			var pane = state.config.panesArray[state.config.panesIndex]
			pane.focusPane()
		})
		*/

		$.pane.key(['enter'],function(ch,key) {
			var input = $.pane.getValue().replace(/\r/g,'')
			var tokens = input.split(' ')

			Input.resetHistory()

			if(tokens.length == 0) return

			var cmd = tokens[0]

			$.config.ev.emit("input", { cmd : cmd, line : tokens.concat(tokens, ' ') })

			/*
			$.pane.clearValue()
			$.pane.focus()
			*/
			Input.clear()

			if(tokens[0].length == 0 && tokens.length == 1) return

//			$.config.panes.chat.addLine(10,"hi:"+tokens)
			Input.add2History(cmd, tokens, input)

			logger.info("Input:Chats", { chats: $.config.chats })
			try {
				/* Try Input commands first */
				var fn = $.cmd.getCmd(cmd)
				fn(tokens)
			} catch (err) {
				/* Next, try the current sub module's commands */
				logger.info("Input:Err:",{error:err.toString()})
				try {
//					$.config.chats[$.state.cur].mod.tryCmd(cmd, tokens)
					state.current.mod.tryCmd(cmd,tokens)
				} catch (err) {
					logger.info("Input:Err2:",{error:err.toString()})
					$.config.panes.chat.addLine("Input: Command not found.")
					return
				}
				return
			}
		})
	}


	Input.clear = function() {
		$.pane.clearValue()
		$.pane.focus()
		$.pane.screen.render()
	}

	Input.initScreenHandler = function() {
		screen.key(['C-c'], function(ch,key) {
			return process.exit()
		})
	}


	Input.cmdUse = function(tokens) {
		try {
			state.current.mod = $.config.chats[tokens[1]].mod
			state.current.name = tokens[1]
			state.current.convo = "default"
		} catch(err) {
			state.current.mod = $.config.chats["blessed"].mod
			state.current.name = "blessed"
			state.current.convo = "default"
		}
	}

	Input.cmdExit = function(tokens) {
		process.exit(0)
	}

	Input.cmdClear = function(tokens) {
	}

	Input.cmdHelp = function(tokens) {
	}

	Input.cmdInfo = function(tokens) {
	}

	Input.initCommands = function() {
		$.cmd.addCmd("/use",Input.cmdUse)
		$.cmd.addCmd("/exit",Input.cmdExit)
		$.cmd.addCmd("/clear",Input.cmdClear)
		$.cmd.addCmd("/help",Input.cmdHelp)
		$.cmd.addCmd("/info",Input.cmdInfo)
	}


	Input.init = function() {
		Input.initInputBox()
		Input.initInputHandler()
		Input.initScreenHandler()
		Input.initCommands()
	}

	Input.add2History = function(cmd, tokens, line) {
		if ($.state.history.length != 0) {
			/* No duplicates */
			var prev_line = $.state.history[$.state.history.length-1].line
			if (prev_line === line) return
		}
		$.state.history.push({ cmd: cmd, tokens: tokens, line: line })
	}

	Input.getHistoryUp = function() {
		return Input.getHistory(true)
	}

	Input.getHistoryDown = function() {
		return Input.getHistory(false)
	}

	Input.getHistory = function(type) {
		/* true = get history from top to bottom -> latest value to oldest
		 * false = get history from bottom to top -> oldest value to newest
		 * top = most recent
		 */
		var idx
		if (type == false) {
			/* oldest to latest */
			if ($.state.history_ptr == null) {
				$.state.history_ptr = 0
			}
			idx = $.state.history_ptr
			if ($.state.history_ptr < ($.state.history.length-1)) {
				$.state.history_ptr += 1
			}
		} else if (type == true) {
			/* latest to oldest */
			if ($.state.history_ptr == null) {
				$.state.history_ptr = $.state.history.length-1
			}
			idx = $.state.history_ptr
			if ($.state.history_ptr > 0) {
				$.state.history_ptr -= 1
			}
		}
		var val = $.state.history[idx]
		if (val == undefined) {
			val = null
		} else if (val.line == undefined) {
			val = null
		}
		return val
	}

	Input.resetHistory = function() {
		//$.state.history_ptr = $.state.history.length
		$.state.history_ptr = null
	}

	Input.deferredInit = function() {
		state.current.mod = state.config.chats["blessed"].mod
		state.current.name = "blessed"
		state.current.convo = "default"
	}

	Input.focusPane = function() {
		$.pane.focus()
	}

	Input.init()
}

module.exports = _Input
