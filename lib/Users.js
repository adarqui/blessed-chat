var blessed = require('blessed');

var _Users = function(config) {
  var Users = this

  $ = {}
  $.config = config
  $.screen = {}
  $.tpl = $.config.layout.users

}


module.exports = Users
