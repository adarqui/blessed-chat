var blessed = require('blessed')

var _Screen = function(config) {
		var Screen = this
		var $ = {}
		$.pane
		$.config = config

		Screen.render = function() {
			return $.pane.render()
		}

		Screen.append = function(element) {
			return $.pane.append(element)
		}

		Screen.key = function(a, b) {
			return $.pane.key(a,b)
		}

		Screen.self = function() {
			return $.pane
		}

		Screen.hookKeys = function() {
			$.pane.key(['tab'],function(ch,key) {
				state.config.panesIndex++
				if (state.config.panesIndex == state.config.panesArray.length) {
					state.config.panesIndex = 0
				}
				var pane = state.config.panesArray[state.config.panesIndex]
				pane.focusPane()
			})
		}

		Screen.init = function() {
				//Screen.obj = blessed.screen()
				$.pane = blessed.screen()
				$.config.screen = $.pane
				Screen.hookKeys()
		}

		Screen.init()
}

module.exports = _Screen
