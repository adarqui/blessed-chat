var
  irc = require('irc'),
  misc = require('./Misc.js')
  ;

var _Irc = function(server_info) {
  var Irc = this
  var $ = {}
  $.info = server_info
  $.conn = {}

  Irc.getNick = function() {
    if($.info.nicks instanceof Array) {
      return $.info.nicks[misc.rand($.info.nicks.length-1)]
    }
    else {
      return $.info.nicks
    }
  }

  Irc.getServer = function() {
    if($.info.servers instanceof Array) {
      return $.info.servers[misc.rand($.info.servers.length-1)]
    }
    else {
      return $.info.servers
    }
  }

  Irc.connect = function() {
    $.conn = new irc.Client(Irc.getServer(), Irc.getNick(), { channels : $.info.channels })

    $.conn.addListener('message', function(from, to, message) {
    })

    $.conn.addListener('pm', function(from, message) {
    })

    $.conn.addListener('raw', function(message) {
    })

    $.conn.addListener('error', function(message) {
    })

  }

  Irc.init = function() {
    Irc.connect()
  }

  Irc.init()
}

module.exports = _Irc
