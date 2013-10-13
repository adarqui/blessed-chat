/*
 * hipchat-blessed
 */

var blessed = require('blessed');

var _Input = function(config) {
  var Input = this

  $ = {}
  $.config = config
  $.screen = {}
  $.panes = {
    input : {},
    rooms : {},
    users : {},
    title : {},
    chat : {},
  }
  $.tpl = $.config.layout.input

  Input.initInputBox = function() {

    $.panes.input = blessed.textbox({
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

    $.screen.append($.panes.input)
    $.panes.input.focus()
  }
  Input.initInputHandler = function() {
    $.panes.input.on('keypress',function(ch,key) {
    })
    $.panes.input.key(['enter'],function(ch,key) {
      $.panes.input.clearValue()
      $.panes.input.focus()
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
