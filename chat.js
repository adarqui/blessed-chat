/*
 * hipchat-blessed
 */

var wobot = require('wobot'),
  irc = require('irc'),
  blessed = require('blessed'),
  fs = require('fs');


var c = require('./config.js');


var Layout = function() {
  var self = this
  self.screen = {}
  self.panes = {
    input : {},
    rooms : {},
    users : {},
    title : {},
    chat : {},
  }
  self.initInputBox = function() {

    self.panes.input = blessed.textbox({
      bottom :true,
      width: '100%',
      height: '10%',
      border: c.layout.input.border,
      fg : c.layout.input.fg,
      bg : c.layout.input.bg,
      content: '',
      tags: true,
      hoverEffects : c.layout.input.hoverEffects,
      input : true,
//      keys : true,
//      vi : true,
      inputOnFocus : true
    });

    self.screen.append(self.panes.input)
    self.panes.input.focus()
  }
  self.initInputHandler = function() {
    self.panes.input.on('keypress',function(ch,key) {
    })
    self.panes.input.key(['enter'],function(ch,key) {
//      console.log("enter")
      self.panes.input.clearValue()
      self.panes.input.focus()
      //self.screen.render()
    })
  }
  self.initScreenHandler = function() {
    self.screen.key(['C-c'], function(ch,key) {
      return process.exit()
    })
  }
  self.init = function() {
    self.screen = blessed.screen()
    self.initInputBox()
    self.initInputHandler()
    self.initScreenHandler()
    self.screen.render()
  }

  self.init()
}

var init = {
  everything : function() {
    c.layout = new Layout()
    setInterval(function() { } , 2000)
  }
}

init.everything()
