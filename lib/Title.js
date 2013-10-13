var blessed = require('blessed');

var _Title = function(config) {
  var Title = this

  $ = {}
  $.config = config
  $.tpl = $.config.layout.title

  Title.initPane = function() {
	$.pane = blessed.box({
	  left : 'center',
	  width : '80%',
	  height : '10%',
	  border : $.tpl.border,
	  fg : $.tpl.fg,
	  bg : $.tpl.bg,
	  content : '{bold}Welcome{/bold}',
	  tags : true,
	  hoverEffects : $.tpl.hoverEffects
	})

	screen.append($.pane)
  }

  Title.init = function() {
	Title.initPane()
  }

  Title.init()

}


module.exports = _Title
