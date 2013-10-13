var blessed = require('blessed');

var _Rooms = function(config) {
  var Rooms = this

  $ = {}
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

  Rooms.populate = function() {
    $.pane.setItems($.members)
  }

  Rooms.init = function() {
    Rooms.initPane()
  }

  Rooms.init()
}

module.exports = _Rooms
