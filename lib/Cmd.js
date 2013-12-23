var _Cmd = function(desc) {

	var Cmd = this
	Cmd.hash = {}

	Cmd.addCmd = function(trigger, cb) {
		Cmd.hash[trigger] = cb
	}

	Cmd.getCmd = function(trigger) {
		try {
			return Cmd.hash[trigger]
		} catch (err) {
			return null
		}
	}

	Cmd.delCmd = function(trigger) {
		delete(Cmd.hash, trigger)
	}

}

module.exports = _Cmd
