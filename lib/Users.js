var blessed = require('blessed');

var _Users = function(config) {
  var Users = this

  $ = {}
  $.config = config
  $.tpl = $.config.layout.users

  $.members = []

  Users.initPane = function() {
    $.pane = blessed.list({
      parent : screen.self(),
      width : '10%',
      height : '92%',
      right : true,
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

  Users.populate = function() {
    $.pane.setItems($.members)
  }

  Users.init = function() {
    Users.initPane()
  }

  Users.init()
}


module.exports = _Users
