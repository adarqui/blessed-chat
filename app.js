/*
 * hipchat-blessed
 */

var
  Input = require('./lib/input.js'),
  Rooms = require('./lib/rooms.js'),
  Users = require('./lib/users.js'),
  Title = require('./lib/title.js'),
  Chat = require('./lib/chat.js'),
  wobot = require('wobot'),
  irc = require('irc'),
  blessed = require('blessed'),
  fs = require('fs');


var c = require('./config.js');

var init = {
  input : function() {
  },
  everything : function() {
    console.log(Input)
    c.input = new Input(c)
    c.rooms = new Rooms(c)
    c.users = new Users(c)
    c.title = new Title(c)
    c.chat = new Chat(c)
    setInterval(function() { } , 2000)
  }
}

init.everything()
