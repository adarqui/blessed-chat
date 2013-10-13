/*
 * hipchat-blessed
 */

var
  Input = require('./lib/input.js'),
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
    setInterval(function() { } , 2000)
  }
}

init.everything()
