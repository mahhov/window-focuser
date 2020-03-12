const {ViewHandle} = require('js-desktop-base');

class SwitcherViewHandle extends ViewHandle {
	constructor() {
		super({
			width: 500,
			height: 500,
			frame: false,
			thickFrame: false,
			skipTaskbar: true,
			alwaysOnTop: true,
			show: false,
			webPreferences: {nodeIntegration: true}
		}, path.join(__dirname, './View.html'));

		this.addWindowListener('blur', () => this.hide());
	}

	onMessage(message) {
		switch (message.name) {
			case 'select':
				if (this.selectListener)
					this.selectListener(request.selected);
			case 'close':
				this.hide();
				break;
			default:
				console.error('Unknown window request:', message);
		}
	}

	addSelectListener(selectListener) {
		this.selectListener = selectListener;
	}

	setTexts(texts) {
		this.send({name: 'addText', text});
	}
}

module.exports = SwitcherViewHandle;
