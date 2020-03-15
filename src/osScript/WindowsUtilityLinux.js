const util = require('util');
const exec_ = util.promisify(require('child_process').exec);
const exec = cmd => exec_(cmd).then(({stdout}) => stdout.trim()).catch((...err) => '');

let sleep = (t = 100) => new Promise(r => setTimeout(r, t));

class Window {
	constructor(id) {
		this.init(id);
	}

	async init(id) {
		this.id = id;
		this.class = (await exec(`xprop -id ${id} WM_CLASS`)).matchG(/"(.*?)"/).last[1];
	}

	async getClosestWindowId() {
		let desktop = await exec('xdotool get_desktop');
		return (await exec(`xdotool search --desktop ${desktop} ''`)).split('\n').includes(this.id) ?
			this.id :
			(await exec(`xdotool search --desktop ${desktop} --class ${this.class}`)).split('\n').last;
	}

	async focus() {
		let id = await this.getClosestWindowId();
		exec(`xdotool windowactivate ${id}`);
	}
}

class WindowsUtility {
	static async getFocused() {
		let id = await exec('xdotool getactivewindow');
		return new Window(id);
	}

	static async setFocused(window) {
		window.focus();
	}

	static async focusOrCreateFromClass(clazz, run) {
		let desktop = await exec('xdotool get_desktop');
			let windowId = (await exec(`xdotool search --desktop ${desktop} --class ${clazz}`))
				.split('\n')
				.last;
		if (windowId)
			new Window(windowId).focus();
		else
			exec(run);
	}

	static async moveWorkspace(delta) {
		let desktopCount = parseInt(await exec('xdotool get_num_desktops'));
		let desktop1 = parseInt(await exec('xdotool get_desktop'));
		let desktop2 = desktop1 + delta;
		if (desktop2 < 0 || desktop2 >= desktopCount)
			return;

		let windowIds1 = (await exec(`xdotool search --desktop ${desktop1} ''`)).split('\n');
		let windowIds2 = (await exec(`xdotool search --desktop ${desktop2} ''`)).split('\n');
		windowIds1.filter(a => a).forEach(id => exec(`xdotool set_desktop_for_window ${id} ${desktop2}`));
		windowIds2.filter(a => a).forEach(id => exec(`xdotool set_desktop_for_window ${id} ${desktop1}`));

		exec(`xdotool set_desktop ${desktop2}`);
	}
}

module.exports = WindowsUtility;
