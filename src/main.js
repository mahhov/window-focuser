const os = require('os');
const path = require('path');
const {shell} = require('electron');
const {TrayHelper, keyHook} = require('js-desktop-base');
const appData = require('./appData');
const WindowFocuserWindows = './osScript/WindowFocuserWindows';
const switchClazzLinux = require('./osScript/switchClazzLinux.js');

let reloadPreferences = async () => {
	let preferences = await appData.reloadPreferences();
	keyHook.clearShortcuts();
	if (os.platform() === 'linux')
		preferences.forEach(({clazz, run, key}) =>
			keyHook.addShortcut('{SUPER}', key, () => switchClazzLinux(clazz, run)));
	else {
		let focuser = new WindowFocuserWindows();
		preferences.forEach(({clazz, run, key}) =>
			keyHook.addShortcut('{ALT}{CTRL}', key, () =>
				focuser.focusOrCreateFromClass(clazz, run)));
	}
};

let trayIcon = path.join(__dirname, '../resources/hat-wizard-solid.png');
let trayMenuOptions = [
	{label: 'Edit Shortcuts', click: () => shell.openPath(appData.preferencesPath)},
	{label: 'Reload Shortcuts', click: reloadPreferences},
];
TrayHelper.createExitTray(trayIcon, 'Switcher', trayMenuOptions);

reloadPreferences();
