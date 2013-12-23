/*
 * DEPENDS ON: global state
 */

var
	Line = require('./Line.js')
	;

var _Data = function(opts) {
	var Data = this
	var $ = {}
	$.opts = opts
	$.state = {
		name : "",
		nick : "",
		current_convo : "",
		convos : {},
		translate : null
	}

	/* DEFAULT is convos[0], we should never delete this */
	$.convo = {
		users : [],
		topic : [],
		messages : [],
	}

	Data.pushConvo = function(line) {
		/* Push the line to it's specific convo */
		try {
			$.state.convos[line.to].push(line)
		} catch(Err) {
			Data.addConvo(line.to)
		}
	}

	Data.addTranslateConvo = function(cb) {
		$.state.translate = cb
	}

	Data.translateConvo = function(room_or_user) {
		var res = $.state.translate(room_or_user)
//		console.log("TRANSLATE",res)
		return res
	}

	Data.addConvo = function(room_or_user) {
		var convo

		if ($.state.convos[room_or_user] == undefined) {
			convo = {
				users : [],
				topic : [],
				messages : [],
			}
			$.state.convos[room_or_user] = convo
		} else {
			convo = $.state.convos[room_or_user]
		}

		return convo
	}

	Data.joinConvo = function(room_or_user) {

		var convo = Data.addConvo(room_or_user)
		$.state.current_convo = room_or_user

		var line = new Line("", "", "", "You are now talking in "+room_or_user)
		state.config.panes.chat.addLine(line.getMessage())
	}

	Data.partConvo = function(room_or_user) {
		if (room_or_user == undefined) {
			room_or_user = $.state.current_convo
		}
		$.state.current_convo = ""
		var line = new Line("", "", "", "You have left "+room_or_user)
		state.config.panes.chat.addLine(line.getMessage())
		$.state.current_convo = "default"
	}

	Data.delConvo = function(room_or_user) {
		if ($.state.current_convo === room_or_user) {
			$.state.current_convo = ""
		}
		delete($.state.convos, room_or_user)
	}

	Data.switchConvo = function(room_or_user) {
		var prev = $.state.current_convo
		Data.partConvo($.state.current_convo)
		Data.joinConvo(room_or_user)
		$.state.current_convo = room_or_user
		/*
		var line = new Line("", "", "", "You have left "+prev+" and are nore talking in "+room_or_user)
		state.config.panes.chat.addLine("You have left "+prev+" and are now talking in "+room_or_user)
		*/
	}

	Data.sendMessage = function(to, message) {
	}

	Data.sendMessageCurrent = function(message) {

		if (state.current.name === $.state.name) {
			/* Display this */
			state.config.panes.chat.addLine('> '+message)
		} else {
			/* Add this to the default windows and the specific window */
		}
	}

	Data.getCurrentConvo = function() {
		return $.state.current_convo
	}

	Data.printError = function(message) {
		state.config.panes.chat.addLine(message)
	}


	Data.whereAmI_Chat_Setter = function(msg) {
		state.config.panes.chat.addLine(msg)
	}

	Data.whereAmI_Chat = function(obj, cb_specific_joined, cb_specific_default, cb_default) {
		return Data.whereAmI(obj, cb_specific_joined, cb_specific_default, cb_default, Data.whereAmI_Chat_Setter, "chat")
	}

	Data.whereAmI_RoomsJoin_Setter = function(msg) {
		var arr = state.config.panes.rooms.getMembers()
		arr = arr.concat(msg)
		state.config.panes.rooms.setMembers(arr)
		state.config.panes.rooms.populate()
	}

	Data.whereAmI_RoomsJoin = function(obj, cb_specific_joined, cb_specific_default, cb_default) {
		return Data.whereAmI(obj, cb_specific_joined, cb_specific_default, cb_default, Data.whereAmI_RoomsJoin_Setter, "roomsJoin")
	}


	Data.whereAmI_RoomsPart_Setter = function(msg) {
		var arr = state.config.panes.rooms.getMembers()
		var idx = arr.indexOf(msg)
		arr.splice(idx,1)
		state.config.panes.rooms.setMembers(arr)
		state.config.panes.rooms.populate()
	}

	Data.whereAmI_RoomsPart = function(obj, cb_specific_joined, cb_specific_default, cb_default) {
		return Data.whereAmI(obj, cb_specific_joined, cb_specific_default, cb_default, Data.whereAmI_RoomsPart_Setter, "roomsPart")
	}



	Data.whereAmI_UsersJoin_Setter = function(msg) {
		var arr = state.config.panes.users.getMembers()
		arr = arr.concat(msg)
		state.config.panes.users.setMembers(arr)
		state.config.panes.users.populate()
	}

	Data.whereAmI_UsersJoin = function(obj, cb_specific_joined, cb_specific_default,cb_default) {
		return Data.whereAmI(obj, cb_specific_joined, cb_specific_default, cb_default, Data.whereAmI_UsersJoin_Setter, "usersJoin")
	}


	Data.whereAmI_UsersPart_Setter = function(msg) {
		var arr = state.config.panes.users.getMembers()
		var idx = arr.indexOf(msg)
		arr.splice(idx,1)
		state.config.panes.users.setMembers(arr)
		state.config.panes.users.populate()
	}

	Data.whereAmI_UsersPart = function(obj, cb_specific_joined, cb_specific_default,cb_default) {
		return Data.whereAmI(obj, cb_specific_joined, cb_specific_default, cb_default, Data.whereAmI_UsersPart_Setter, "usersPart")
	}


	Data.whereAmI = function(obj, cb_specific_joined, cb_specific_default, cb_default, pane_setter, desc) {
//state.config.panes.chat.addLine(desc+":"+JSON.stringify(obj))
		var msg
		if(state.current.name === $.state.name || state.current.name === "blessed") {
			var convo = $.state.current_convo
			if(convo == "") {
				convo = "default"
			}

			if (convo == "default") {
				if (state.current.name == "blessed") {
					msg = cb_default(obj)
//					console.log("default")
				} else {
					msg = cb_specific_default(obj)
//					console.log("s default")
				}
			}
			else {
				msg = cb_specific_joined(obj)
//				console.log("specific")
			}

//			state.config.panes.chat.addLine("desc="+desc+" convo="+convo+" obj.to="+obj.to)
			if (convo === obj.to || convo == "default") {
				//state.config.panes.chat.addLine(msg)
//state.config.panes.chat.addLine("inside:"+desc)
				pane_setter(msg)
			} else {
			}

			var line = new Line()
			line.setFrom = obj.from
			line.setTo = obj.to
			line.setMessage = obj.msg

//			convo = $.state.convos[convo]
			Data.pushConvo(line)
		}

	}

	/*
	Data.recvMessage = function(from, to, message) {

		if (state.current.name === $.state.name || state.current.name == "blessed") {
			var convo = $.state.current_convo
			var display_msg
			if (convo == "") {
				convo = "default"
			}

			var line = new Line()

			if (convo == "default") {
				if (state.current.name == "blessed") {
					display_msg = '< '+from+ ':'+to+':'+$.state.name+'>'+": "+message
				} else {
					display_msg = '< '+from+ ':'+to+'> '+message
				}
			} else {
				display_msg = '< '+from+'> '+message
			}

			if (convo === to || convo == "default") {
				state.config.panes.chat.addLine(display_msg)
			}

			line.setFrom = from
			line.setTo = to
			line.setMessage = display_msg

			convo = $.state.convos[convo]
			Data.pushConvo(line)
		}

	}
	*/

   Data.recvMessage = function(from, to, message) {
	   var obj = {
		   from : from,
		   to : to,
		   msg : message
	   }
	   var f1 = function(obj) {
		   return '< '+obj.from+'> '+obj.msg
	   }
	   var f2 = function(obj) {
		   return '< '+obj.from+ ':'+obj.to+'> '+obj.msg
	   }
	   var f3 = function(obj) {
		   return '< '+obj.from+ ':'+obj.to+':'+$.state.name+'>'+": "+obj.msg
	   }
	   Data.whereAmI_Chat(obj, f1, f2, f3)
   }

	Data.xJoinedConvo = function(from, to) {
		var obj = {
			from : from,
			to : to,
		}
		var f1 = function(obj) {
			return '*** ' + from + ' Joined ' + to
		}
		var f2 = function(obj) {
			return '*** ' + from + ':' + $.state.current_convo + ' Joined ' + to
		}
		var f3 = function(obj) {
			return '*** ' + from + ':' + $.state.current_convo + ':' + $.state.name + ' Joined ' + to
		}

		Data.whereAmI_Chat(obj, f1, f2, f3)

		var g1 = function() {
			return from
		}
		var g2 = function() {
			return from+":"+obj.to
		}
		var g3 = function() {
			return from+":"+obj.to+":"+$.state.name
		}

		Data.whereAmI_UsersJoin(obj, g1, g2, g3)
	}

	Data.xPartedConvo = function(from, to) {
		var obj = {
			from : from,
			to : to
		}
		var f1 = function(obj) {
			return '*** ' + from + ' Left ' + to
		}
		var f2 = function(obj) {
			return '*** ' + from + ':' + $.state.current_convo + ' Left ' + to
		}
		var f3 = function(obj) {
			return '*** ' + from + ':' + $.state.current_convo + ':' + $.state.name + ' Left ' + to
		}

		Data.whereAmI_Chat(obj, f1, f2, f3)

		var g1 = function() {
			return from
		}
		var g2 = function() {
			return from+":"+obj.to
		}
		var g3 = function() {
			return from+":"+obj.to+":"+$.state.name
		}

		Data.whereAmI_UsersPart(obj, g1, g2, g3)
	}

	Data.xQuitNetwork = function(user, message) {
		var obj = {
			from : user,
			to : "fixme",
			msg : message
		}
		var f1 = function(obj) {
			return '*** ' + user + ' Has quit ( ' + message + ' )'
		}
		var f2 = function(obj) {
			return '*** ' + user + ':' + $.state.current_convo + ' Has quit ( ' + message + ' ) '
		}
		var f3 = function(obj) {
			return '*** ' + user + ':' + $.sstate.current_convo + ':' + $.state.name + ' Has quit ( ' + message + ' )'
		}
		Data.whereAmI_Chat(obj,f1,f2,f3)



	}

	Data.setName = function(name) {
		$.state.name = name
	}

	Data.init = function() {
		// hi
		if ($.opts != undefined) {
			if ($.opts.name != undefined) {
				Data.setName ($.opts.name)
			}
		}

		Data.addConvo("default")
	}

	Data.init()
}

module.exports = _Data
