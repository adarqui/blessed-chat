var _UI = function(config) {
	var UI = this

	var $ = {}
	$.config = config

	UI.setControlC = function() {
		$.config.panes.screen.key(['C-c'], function(ch, key) {
			return process.exit(0)
		})
	}

	UI.init = function() {
	}

	UI.deferredInit = function() {
		UI.setControlC()
	}

	UI.init()
}

module.exports = _UI
