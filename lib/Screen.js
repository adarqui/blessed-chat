var blessed = require('blessed')

var _Screen = function(config) {
		var Screen = this
		$ = {}
		$.config = config

		Screen.render = function() {
			return Screen.obj.render()
		}

		Screen.append = function(element) {
			return Screen.obj.append(element)
		}

		Screen.key = function(a, b) {
			return Screen.obj.key(a,b)
		}

		Screen.self = function() {
			return Screen.obj
		}

		Screen.init = function() {
				Screen.obj = blessed.screen()
				$.config.screen = Screen.obj
		}

		Screen.init()
}

module.exports = _Screen
