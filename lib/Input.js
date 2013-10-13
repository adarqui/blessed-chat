/*
 * hipchat-blessed
 */

var blessed = require('blessed');

var _Input = function(config) {
  var Input = this

  var $ = {}
  $.config = config
  $.screen = {}
  $.pane = {}
  $.tpl = $.config.layout.input

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

    $.screen.append($.pane)
    $.pane.focus()
  }
  Input.initInputHandler = function() {
    $.pane.on('keypress',function(ch,key) {
    })
    $.pane.key(['enter'],function(ch,key) {
      $.pane.clearValue()
      $.pane.focus()
    })
  }
  Input.initScreenHandler = function() {
    $.screen.key(['C-c'], function(ch,key) {
      return process.exit()
    })
  }
  Input.init = function() {
    $.screen = blessed.screen()
    Input.initInputBox()
    Input.initInputHandler()
    Input.initScreenHandler()
    $.screen.render()
  }

  Input.init()
}


/*

(function(Input) {

  Input.init = function() {
  }

  Input.init()

}(exports))

*/

module.exports = _Input
