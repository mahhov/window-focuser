// const {ipcRenderer: ipc} = require('electron');
// const Texts = require('./Texts');
//
// const $ = document.querySelector.bind(document);
// const $c = document.createElement.bind(document);
//
// let texts = [];
// let selected = 0;
//
// ipc.on('window-command', (_, command) => {
// 	console.log('received', command);
// 	switch (command.name) {
// 		case 'setText':
// 			texts = command.texts;
// 			break;
// 		case 'open':
// 			selected = 0;
// 			updateView();
// 			break;
// 		default:
// 			console.error('Unknown window command:', command);
// 	}
// });
//
// let updateView = () => {
// 	let container = $('#container');
// 	while (container.firstChild)
// 		container.firstChild.remove();
//
// 	texts.getLinesForDisplay().forEach(({text, textColor = '#000', backColor = '#fff'}) => {
// 		let lineTextEl = $c('span');
// 		lineTextEl.textContent = text;
// 		lineTextEl.style.color = textColor;
// 		lineTextEl.style.backgroundColor = backColor;
// 		let lineEl = $c('div');
// 		lineEl.appendChild(lineTextEl);
// 		container.appendChild(lineEl);
// 	})
// };
//
// document.body.addEventListener('keydown', ({code}) => {
// 	switch (code) {
// 		case 'ArrowLeft':
// 			texts.selectFirst();
// 			updateView();
// 			break;
// 		case 'ArrowUp':
// 			texts.selectPrev();
// 			updateView();
// 			break;
// 		case 'ArrowRight':
// 			texts.selectLast();
// 			updateView();
// 			break;
// 		case 'ArrowDown':
// 			texts.selectNext();
// 			updateView();
// 			break;
// 		case 'Delete':
// 		case 'Backspace':
// 			texts.removeSelected();
// 			updateView();
// 			break;
// 		case 'Enter':
// 			ipcSend({name: 'close', selected: texts.getSelected()});
// 			break;
// 		case 'Escape':
// 			ipcSend({name: 'close'});
// 			break;
// 	}
// });
//
// let ipcSend = message => ipc.send('window-request', message);
