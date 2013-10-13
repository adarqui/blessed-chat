var blessed = require('blessed');

var _Notifications = function(config) {
  var Notifications = this

  $ = {}
  $.config = config
  $.tpl = $.config.layout.notifications
}


module.exports = _Notifications
