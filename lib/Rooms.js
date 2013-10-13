var blessed = require('blessed');

var _Rooms = function(config) {
  var Rooms = this

  $ = {}
  $.config = config
  $.screen = {}
  $.tpl = $.config.layout.rooms

}


module.exports = Rooms
