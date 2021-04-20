const util = require('util');
const exec_ = require('child_process').exec;
const exec = cmd => util.promisify(exec_)(cmd)
	.then(({stdout}) => stdout.trim())
	.catch(() => '');

let getDesktop = () => exec('xdotool get_desktop');
let getWindowId = async () => Number(await exec('xdotool getActiveWindow'));
let getAllWindows = async () => (await exec('wmctrl -xl'))
	.split('\n')
	.map(line => line.split(/\s+/))
	.map(([id, desktop, clazz]) => ({id: Number(id), desktop, clazz}));
let focusWindow = id => exec(`xdotool windowActivate ${id}`);

let switchClazz = async (clazz, run) => {
	let activeDesktop = await getDesktop();
	let activeId = await getWindowId();
	let windows = (await getAllWindows())
		.filter(w => w.desktop === activeDesktop && w.clazz.includes(clazz));

	if (!windows.length)
		exec(run);
	else {
		windows = windows.filter(w => w.id !== activeId);
		if (windows.length)
			focusWindow(windows[0].id);
	}
};

module.exports = switchClazz;
