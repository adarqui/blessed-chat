var blessed = require('blessed');

var _Title = function(config) {
  var Title = this

  $ = {}
  $.config = config
  $.screen = {}
  $.tpl = $.config.layout.title

}


module.exports = Title
