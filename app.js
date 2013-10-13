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
  wobot = require('wobot'),
  irc = require('irc'),
  blessed = require('blessed'),
  fs = require('fs');


var c = require('./config.js');

var init = {
  input : function() {
  },
  everything : function() {
    screen = new Screen(c)
    console.log(Screen)
    input = new Input(c)
    rooms = new Rooms(c)
    users = new Users(c)
    title = new Title(c)
    chat = new Chat(c)
    screen.render()
  }
}

init.everything()
