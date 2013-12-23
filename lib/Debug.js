var
	fs = require('fs'),
	winston = require('winston')
	;

var _Debug = function(log_file) {
	var Debug = this

	Debug.init = function() {
		fs.truncate(log_file,0)
		winston.add(winston.transports.File, { filename : log_file }).remove(winston.transports.Console);
	}

	Debug.init()
}

module.exports = _Debug
