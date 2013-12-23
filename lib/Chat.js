var blessed = require('blessed');

var _Chat = function(config) {
	var Chat = this

	var $ = {}
	$.config = config
	$.tpl = $.config.layout.chat

	$.state = {
		line_index : 0,
	}

	Chat.initPane = function() {
		$.pane = blessed.scrollabletext({
			parent : screen.self(),
			top : '10%',
			left : '10%',
			width : '80%',
			height : '84%',
			tags : true,
			border : $.tpl.border,
			mouse : true,
			keys : true,
			vi : false,
			content : 'Loading...',
		})
	}

	Chat.clear = function() {
		$.state.line_index = 0
	}

	Chat.addLine = function(line) {
		Chat.addPosLine($.state.line_index,line)
		$.state.line_index += 1
	}

	Chat.addLines = function(lines) {
		Chat.addPosLines($.state.line_index,lines)
		$.state.line_index += lines.length
	}

	Chat.addPosLine = function(no,line) {
		$.pane.setLine(no,line)
		$.pane.scrollTo(no+5)
		$.pane.screen.render()
	}

	Chat.addPosLines = function(no,lines) {
		for (var v in lines) {
			var line = lines[v]
			Chat.addLine(no,line)
			no += 1
		}
		$.pane.scrollTo(no+5)
		$.pane.screen.render()
	}

	Chat.removeLine = function() {
	}

	Chat.init = function() {
		Chat.initPane()
	}

	Chat.focusPane = function() {
		/*
		var content = $.pane.getContent()
		$.pane.setContent("{border-fg-red}"+content)
		*/
		$.pane.focus()
	}

	Chat.init()
}

module.exports = _Chat
