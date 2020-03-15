const {CustomOsScript} = require('js-desktop-base');
const fs = require('fs').promises;
const path = require('path');
const {spawn} = require("child_process");

class WindowFocuserWindows extends CustomOsScript {
	constructor() {
		super();

		this.addListener(({out, err}) => {
			if (err)
				console.error('Error from WindowFocuserBase script:', err);
			console.log('Output from WindowFocuserBase script:', out);
		});
	}

	async spawnProcess() {
		let script = fs.readFile(path.join(__dirname, './windowFocuser.ps1'))
			.catch(e => console.log('unable to read windowFocuser.ps1 script:', e));
		return spawn((await script).toString(), [], {shell: "powershell"});
	}

	focusOrCreateFromClass(clazz, run) {
		this.send(`${clazz},${run}`);
	}
}

module.exports = WindowFocuserWindows;
