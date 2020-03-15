require('./initProto');
const os = require('os');
const path = require('path');
const {TrayHelper, keyHook} = require('js-desktop-base');

// todo tray icon for changing preferences
let trayIcon = path.join(__dirname, '../resources/hat-wizard-solid.png');
TrayHelper.createExitTray(trayIcon, 'Switcher');

let setupLinuxShortcuts = () => {
	const preferences = require('../resources/preferencesLinux'); // todo move outside project dir
	const Focuser = require('./osScript/WindowsUtilityLinux');
	let focuser = new Focuser();

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

let setupWindowsShortcuts = () => {
	const preferences = require('../resources/preferencesWindows'); // todo move outside project dir
	// const Focuser = require('./osScript/WindowFocuserWindows');
	let focuser = new Focuser();

	preferences.forEach(({clazz, run, key}) =>
		keyHook.addShortcut('{ALT}{CTRL}', key, () =>
			focuser.focusOrCreateFromClass(clazz, run)));
};

if (os.platform() === 'linux')
	setupLinuxShortcuts();
else
	setupWindowsShortcuts();
