const os = require('os');
const path = require('path');
const fs = require('fs');
const envPaths = require('env-paths')('window-focuser');
const preferencesPath = path.resolve(envPaths.data, 'preferences.json');
const defaultPreferencesPath = path.resolve(`resources/defaultPreferences${os.platform() === 'linux' ? 'Linux' : 'Windows'}.json`);

let init = async () => {
	await fs.promises.mkdir(envPaths.data, {recursive: true});
	try {
		await fs.promises.copyFile(defaultPreferencesPath, preferencesPath, fs.constants.COPYFILE_EXCL);
	} catch {
		// if preferences already existed, we don't need to overwrite them.
	}
};

let initPromise = init();

let reloadPreferences = async () => {
	await initPromise;
	delete require.cache[require.resolve(preferencesPath)];
	return require(preferencesPath);
};

module.exports = {
	preferencesPath,
	reloadPreferences,
};
