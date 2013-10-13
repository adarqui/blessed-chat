module.exports = {
  layout : {
    input : {
      border : {
        type : 'line',
        fg : '#ffffff',
      },
      fg : 'white',
      bg : 'black',
      hoverEffects : {
        bg : 'green'
      },
    },
    rooms : {
      border : {
        type : 'line'
      },
      top : 'left',
      fg : 'blue',
      selectedBg : 'green',
      title : 'rooms',
    },
    users : {
      border : {
        type : 'line',
      },
      top : 'right',
      fg : 'blue',
      selectedBg : 'green',
      title : 'users',
    },
    title : {
      border : {
        type : 'line',
      },
      fg : 'white',
      bg : 'magenta',
      hoverEffects : {
        bg : 'green'
      }
    },
  }
}
