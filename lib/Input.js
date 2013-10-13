/*
 * hipchat-blessed
 */

var blessed = require('blessed');

var _Input = function(config) {
  var Input = this

  var $ = {}
  $.config = config
  $.pane = {}
  $.tpl = $.config.layout.input

  /*
  $.commands = {
    'quit' : Input.cmd_Quit,
    'msg' : Input.cmd_Msg,
    'join' : Input.cmd_Join,
    'part' : Input.cmd_Part,
    'win' : Input.cmd_Win,
  }
  */

  Input.initInputBox = function() {

    $.pane = blessed.textbox({
      bottom :true,
      width: '100%',
      height: '10%',
      border: $.tpl.border,
      fg : $.tpl.fg,
      bg : $.tpl.bg,
      content: '',
      tags: true,
      hoverEffects : $.tpl.hoverEffects,
      input : true,
//      keys : true,
      vi : true,
      inputOnFocus : true
    });

    screen.append($.pane)
    $.pane.focus()
  }
  Input.initInputHandler = function() {
    $.pane.on('keypress',function(ch,key) {
    })
    $.pane.key(['enter'],function(ch,key) {
      var input = $.pane.getValue()
      var tokens = input.split(' ')
      if(tokens.length == 0) return

      var cmd = tokens[0]
      tokens.splice(0,1)

      $.config.ev.emit(cmd, { line : tokens.concat(tokens, ' ') })

      $.pane.clearValue()
      $.pane.focus()

      if(tokens.length == 0) return
    })
  }
  Input.initScreenHandler = function() {
    screen.key(['C-c'], function(ch,key) {
      return process.exit()
    })
  }
  Input.init = function() {
    Input.initInputBox()
    Input.initInputHandler()
    Input.initScreenHandler()
  }

  Input.init()
}

module.exports = _Input
