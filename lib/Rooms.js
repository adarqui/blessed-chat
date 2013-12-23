var blessed = require('blessed');

var _Rooms = function(config) {
	var Rooms = this

	var $ = {}
	$.config = config
	$.tpl = $.config.layout.rooms
	$.members = []

	Rooms.initPane = function() {
		$.pane = blessed.list({
			parent : screen.self(),
			width : '10%',
			height : '92%',
			top : $.tpl.top,
			fg : $.tpl.fg,
			bg : $.tpl.bg,
			border : $.tpl.border,
			selectedBg : $.tpl.selectedBg,
			mouse : true,
			keys : true,
			vi : true
		})

		$.pane.prepend(new blessed.Text({
			left : 2,
			content : $.tpl.title,
		}))

	$.pane.select(0)

	}

	Rooms.setMembers = function(arr) {
		$.members = arr
	}

	Rooms.getMembers = function() {
		return $.members
	}

	Rooms.populate = function() {
		$.pane.setItems($.members)
		$.pane.screen.render()
	}

	Rooms.init = function() {
		Rooms.initPane()
	}

	Rooms.focusPane = function() {
		$.pane.focus()
	}

	Rooms.init()
}

module.exports = _Rooms
