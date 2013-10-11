var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen();

// Create a box perfectly centered horizontally and vertically.
/*
var outer = blessed.box({
  fg: 'blue',
  bg: 'default',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  tags: true,
  content: '{center}{red-fg}Hello{/red-fg}{/center}\n'
         + '{right}world!{/right}',
  width: '50%',
  height: '50%',
  top: 'center',
  left: 'center'
});

// Append our box to the screen.
screen.append(outer);

// Create a child box perfectly centered horizontally and vertically.
var inner = blessed.box({
  parent: outer,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'white',
  bg: 'magenta',
  content: 'Click {bold}me{/bold}!',
  tags: true,
  hoverEffects: {
    bg: 'green'
  }
});

// If our box is clicked, change the content.
inner.on('click', function(data) {
  inner.setContent('{center}You clicked {red-fg}me{/red-fg}.{/center}');
  screen.render();
});

var tog = 0;

// If box is focused, handle `enter` and give us some more content.
inner.key('enter', function() {
  inner.setContent('{right}You pressed {black-fg}enter{/black-fg}.{/right}\n');
  inner.setLine(1, 'bar');
  inner.insertLine(1, 'foo');
  screen.render();
});

inner.key('tab', function() {
  var pane

  if(tog == 0) {
    pane = outer
    prev = inner
    tog = 1
  }
  else {
    tog = 0
    pane = inner
    prev = outer
  }

  var d = new Date()

  var x = prev.getContent()
//  console.log('prev', x)
  prev.setContent('{black-bg}')
  pane.setContent('{white-bg}{black-fg}'+d.toString() + '\n');
//  pane.focus();
  screen.render();
});
*/



// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
/*
inner.focus();

// Render the screen.
screen.render();
*/







var input = blessed.box({
//  bottom : 'center',
//  left : 'xtop',
//  left: 'center',
  bottom :true,
  width: '100%',
  height: '10%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'white',
  bg: 'magenta',
  content: 'Click {bold}me{/bold}!',
  tags: true,
  hoverEffects: {
    bg: 'green'
  }
});

// If our box is clicked, change the content.
input.on('click', function(data) {
  inner.setContent('{center}You clicked {red-fg}me{/red-fg}.{/center}');
  screen.render();
});


screen.append(input)
screen.render()







var title = blessed.box({
//  bottom : 'center',
//  left : 'xtop',
//  left: 'center',
//  top: true,
  left : 'center',
  width: '80%',
  height: '10%',
  border: {
    type: 'line',
    fg: '#ffffff'
  },
  fg: 'white',
  bg: 'magenta',
  content: '{bold}Title{/bold}!',
  tags: true,
  hoverEffects: {
    bg: 'green'
  }
});

// If our box is clicked, change the content.
/*
bottom.on('click', function(data) {
  inner.setContent('{center}You clicked {red-fg}me{/red-fg}.{/center}');
  screen.render();
});
*/


screen.append(title)
screen.render()





var rooms = blessed.list({
  parent : screen,
  width : "10%",
  height : "92%",
  top: "left",
//  left: "center",
//  align : "center",
  fg: "blue",
  border : {
    type : "line",
  },
  selectedBg : "green",
  mouse: true,
  keys : true,
  vi : true
})

rooms.setItems([
  "alerts",
  "fun",
  "poop"
])

rooms.prepend(new blessed.Text({
    left : 2,
    content : 'rooms',
  })
)

rooms.select(0)

rooms.focus()

screen.render()






var nicks = blessed.list({
  parent : screen,
  right : true,
  width : "10%",
  height : "92%",
  fg: "blue",
  border : {
    type : "line",
  },
  selectedBg : "green",
  mouse: true,
  keys : true,
  vi : true
})

nicks.setItems([
  "adarq",
  "git",
  "foop"
])

nicks.prepend(new blessed.Text({
    left : 2,
    content : 'nicks',
  })
)

nicks.select(0)

nicks.focus()

screen.render()





var chat = blessed.scrollabletext({
  parent : screen,
mouse:true,
keys:true,
vi:true,
border : {
  type : 'line',
  color : '#00ff00',
},
width : "80%",
height: "80%",
content : 'loading',
tags : true,
top : '10%',
left : '10%'
})

screen.render()


var panes = [
  rooms,
  title,
  nicks,
  input,
  chat
]

var index = 0

panes[index].focus()
screen.render()

screen.key(['tab'], function(ch,key) {
//console.log("key", ch, key, panes[index])
  index = index + 1;
  if(index >= panes.length) index = 0;

console.log(index)

  panes[index].focus()
  screen.render()
})

var line = 1

setInterval(function() {
//  chat.setContent('hi')
  chat.setLine(line, "hi "+line)
  chat.scrollTo(line)
  screen.render()
  line++
}, 1000)
