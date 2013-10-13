/*
 * hipchat-blessed
 */

var
  Input = require('./lib/Input.js'),
  Rooms = require('./lib/Rooms.js'),
  Users = require('./lib/Users.js'),
  Title = require('./lib/Title.js'),
  Chat = require('./lib/Chat.js'),
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
