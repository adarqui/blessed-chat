var blessed = require('blessed');

var _Chat = function(config) {
  var Chat = this

  $ = {}
  $.config = config
  $.tpl = $.config.layout.chat

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
	  vi : true,
	  content : 'Loading...',
	})
  }

  Chat.init = function() {
	Chat.initPane()
  }

  Chat.init()
}

module.exports = _Chat
