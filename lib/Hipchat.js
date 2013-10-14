var wobot = require('wobot');

var _Hipchat = function(server_info) {
  var Hipchat = this
  var $ = {}
  $.info = server_info
  $.conn = {}

  Hipchat.getJid = function() {
    return $.info.jid
  }

  Hipchat.getHost = function() {
    return $.info.host
  }

  Hipchat.getMucHost = function() {
    return $.info.mucHost
  }

  Hipchat.getPassword = function() {
    return $.info.password
  }

  Hipchat.connect = function() {
    $.conn = new wobot.Bot({
      jid : Hipchat.getJid(),
      password : Hipchat.getPassword(),
      debug : $.info.debug,
      host : Hipchat.getHost(),
      mucHost : Hipchat.getMucHost(),
    })

    $.conn.connect()

    $.conn.onError(function(condition,text,stanza) {
    })

    Hipchat.setHooks()

  }

  Hipchat.setHooks = function() {
    $.conn.onConnect(function(err,data) {

      $.conn.onPing(function(data) {
      })

      $.conn.getRooms(function(err,items,stanza) {
      })

      $.conn.getRoster(function(err,items,stanza) {
      })

    })
  }

  Hipchat.init = function() {
    Hipchat.connect()
  }

  Hipchat.init()
}


module.exports = _Hipchat
