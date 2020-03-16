require('./initProto');
const os = require('os');
const path = require('path');
const {shell} = require('electron');
const {TrayHelper, keyHook} = require('js-desktop-base');
const appData = require('./appData');
const isLinux = os.platform() === 'linux';
const Focuser = require(isLinux ? './osScript/WindowsUtilityLinux' : './osScript/WindowFocuserWindows');

let focuser = new Focuser();

let reloadPreferences = async () => {
	let preferences = await appData.reloadPreferences();
	keyHook.clearShortcuts();
	if (isLinux)
		setupLinuxShortcuts(preferences);
	else
		setupWindowsShortcuts(preferences);
};

let setupLinuxShortcuts = preferences => {
	preferences.forEach(({clazz, run, key}) =>
		keyHook.addShortcut('{SUPER}', key, () =>
			WindowsUtility.focusOrCreateFromClass(clazz, run)));

	let focuses = [];
	for (let i = 0; i <= 9; i++) {
		keyHook.addShortcut('{SUPER}{SHIFT}', `{NUM_${i}}`, () =>
			focuses[i] = WindowsUtility.getFocused());
		keyHook.addShortcut('{SUPER}', `{NUM_${i}}`, async () =>
			await focuses[i] && WindowsUtility.setFocused(await focuses[i]));
	}

	keyHook.addShortcut('{CTRL}{SHIFT}{ALT}', '{UP}', () => WindowsUtility.moveWorkspace(-1));
	keyHook.addShortcut('{CTRL}{SHIFT}{ALT}', '{DOWN}', () => WindowsUtility.moveWorkspace(1));
};

let setupWindowsShortcuts = preferences =>
	preferences.forEach(({clazz, run, key}) =>
		keyHook.addShortcut('{ALT}{CTRL}', key, () =>
			focuser.focusOrCreateFromClass(clazz, run)));

let trayIcon = path.join(__dirname, '../resources/hat-wizard-solid.png');
let trayMenuOptions = [
	{label: 'Edit Shortcuts', click: () => shell.openExternal(appData.preferencesPath)},
	{label: 'Reload Shortcuts', click: reloadPreferences},
];
TrayHelper.createExitTray(trayIcon, 'Switcher', trayMenuOptions);

reloadPreferences();
