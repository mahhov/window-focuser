require('./initProto');
const path = require('path');
const {TrayHelper, keyHook} = require('js-desktop-base');
const WindowsUtility = require('./WindowsUtility');
// const SwitcherViewHandle = require('./SwitcherViewHandle');

let trayIcon = path.join(__dirname, '../resources/hat-wizard-solid.png'); // todo
TrayHelper.createExitTray(trayIcon, 'Switcher');

let preferences = require('../resources/preferences'); // todo

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

// let viewHandle = new SwitcherViewHandle();

// keyHook.addShortcut('{SUPER}', ' ', () =>
// 	console.log('woah'));
