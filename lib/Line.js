var _Line = function(mod_name, from, to, message) {
	var Line = this
	var $ = {}

	$.name = mod_name
	$.from = from
	$.to = to
	$.message = message

	Line.setName = function(name) {
		$.name = name
	}

	Line.setFrom = function(from) {
		$.from = from
	}

	Line.setTo = function(to) {
		$.to = to
	}

	Line.setMessage = function(message) {
		$.message = message
	}

	Line.getName = function() {
		return $.name
	}

	Line.getFrom = function() {
		return $.from
	}

	Line.getTo = function() {
		return $.to
	}

	Line.getMessage = function() {
		return $.message
	}

	Line.get = function() {
		return { name : $.name, from : $.from, to : $.to, message : $.message }
	}
}

module.exports = _Line
