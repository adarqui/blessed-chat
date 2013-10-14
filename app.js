/*
 * hipchat-blessed
 */

var
  Screen = require('./lib/Screen.js'),
  Input = require('./lib/Input.js'),
  Rooms = require('./lib/Rooms.js'),
  Users = require('./lib/Users.js'),
  Title = require('./lib/Title.js'),
  Chat = require('./lib/Chat.js'),
  Irc = require('./lib/IRC.js'),
  Hipchat = require('./lib/Hipchat.js'),
  Misc = require('./lib/Misc.js'),
  wobot = require('wobot'),
  irc = require('irc'),
  blessed = require('blessed'),
  fs = require('fs'),
  events = require('events'),
  _ = require('underscore');


var c = {};

var init = {
  configs : function() {
    if(process.env['CONF']) {
      c.chats = require(process.env['CONF'])
    } else {
      c.chats = require('./config.js')
    }

    if(process.env['LAYOUT']) {
      c.layout = require(process.env['LAYOUT'])
    } else {
      c.layout = require('./layout.js')
    }
  },
  eventEmitter : function() {
    c.ev = new events.EventEmitter()
  },
  parseServers : function() {
    c.irc = []
    c.hipchat = []
    _.each(c.chats, function(value,key,list) {
      console.log("key", key, value)
      switch(value.type) {
        case 'irc': {
          console.log("irc")
          var irc = new Irc(value)
          c.irc.push(irc)
          break;
        }
        case 'hipchat' : {
          console.log("hipchat")
          var hipchat = new Hipchat(value)
          c.hipchat.push(hipchat)
          break;
        }
        default : break;
      }
    })
  },
  everything : function() {
    init.configs()
    init.eventEmitter()
    screen = new Screen(c)
    input = new Input(c)
    rooms = new Rooms(c)
    users = new Users(c)
    title = new Title(c)
    chat = new Chat(c)
    screen.render()
    init.parseServers()
  }
}

init.everything()
