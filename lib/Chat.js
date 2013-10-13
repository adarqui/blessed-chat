var blessed = require('blessed');

var _Chat = function(config) {
  var Chat = this

  $ = {}
  $.config = config
  $.screen = {}
  $.tpl = $.config.layout.chat

}

module.exports = Chat
