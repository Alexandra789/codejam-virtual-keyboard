let contentWrapper = document.createElement('div');
contentWrapper.className = 'content-wrapper';
document.body.append(contentWrapper);

let textarea = document.createElement('textarea');
textarea.className = 'textarea';
textarea.onblur = function() { this.focus() };
contentWrapper.appendChild(textarea);
textarea.focus();

let keyboard = document.createElement('div');
keyboard.className = 'keyboard';
contentWrapper.appendChild(keyboard);

let keyboardKeys = document.createElement('div');
keyboardKeys.className = 'keyboard__keys';
keyboard.appendChild(keyboardKeys);