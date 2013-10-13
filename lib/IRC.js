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
    console.log(misc.rand(4), $.info,"server", Irc.getServer(1), "nick", Irc.getNick(1))
    $.conn = new irc.Client(Irc.getServer(), Irc.getNick(), { channels : $.info.channels })

    $.conn.addListener('message', function(from, to, message) {
      console.log("from to message", from, to, message)
    })

    $.conn.addListener('pm', function(from, message) {
      console.log("pm", from, message)
    })

    $.conn.addListener('raw', function(message) {
      console.log("raw", message)
    })

    $.conn.addListener('error', function(message) {
      console.log("error", message)
    })

  }

  Irc.init = function() {
    Irc.connect()
  }

  Irc.init()
}

module.exports = _Irc
