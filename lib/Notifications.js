var blessed = require('blessed');

var _Notifications = function(config) {
  var Notifications = this

  $ = {}
  $.config = config
  $.screen = {}
  $.tpl = $.config.layout.notifications
}


module.exports = Notifications
