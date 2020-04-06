let currentLang = 'ru';
let upperCase = false;
let pressedKeys = [];

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

function createButton(keyCode, lang) {
    let keyboardKey = document.createElement('button');
    keyboardKey.className = 'keyboard__key';
    keyboardKey.type = 'button';
    keyboardKey.value = keyCode;
    keyboardKey.innerText = KEY_LAYOUTS[lang][keyCode];

    if (keyCode >= 37 && keyCode <= 40)
        keyboardKey.innerText = '';

    if (keyCode in SPECIAL_KEYS)
        keyboardKey.className += ` ${ SPECIAL_KEYS[keyCode] }
    `;
    else if (upperCase) {
        keyboardKey.innerText = keyboardKey.innerText.toUpperCase();
    }

    return keyboardKey;
}

function createKeyboard() {
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < KEY_MAP.length; i++) {
        fragment.appendChild(
            createButton(KEY_MAP[i], currentLang)
        );
    }
    keyboardKeys.appendChild(fragment);
}

function bindMouseClicks() {
    keyboard.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            if (!(e.target.value in SPECIAL_KEYS))
                printLetter(e.target.innerText);
            else {
                handleSpecialKey(e.target.value);
            }

            textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
        }
    })
}

function keyboardClickButton(e) {
    e.preventDefault();
    let keyboardKey = document.querySelectorAll('.keyboard__key')
    for (let i = 0; i < keyboardKey.length; i++) {
        if (e.keyCode == keyboardKey[i].value) {
            keyboardKey[i].className += ' active';
        }
    }

    if (!pressedKeys.includes(e.keyCode))
        pressedKeys.push(e.keyCode);
    handleKeyPress(e.keyCode, e.location);
    checkKeyCombinations();
}

function keyboardReleaseButton(e) {
    e.preventDefault();
    let keyboardKey = document.querySelectorAll('.keyboard__key')
    for (let i = 0; i < keyboardKey.length; i++) {
        if (e.keyCode == keyboardKey[i].value) {
            keyboardKey[i].classList.remove('active');
        }
    }

    var index = pressedKeys.indexOf(e.keyCode);
    if (index !== -1) pressedKeys.splice(index, 1);
}

function printLetter(letter) {
    if (!letter) return;

    if (upperCase)
        letter = letter.toUpperCase();
    textarea.innerHTML += letter;
}

function switchLang() {
    let nextLang;
    let index = LANGS.indexOf(currentLang);
    if (index >= LANGS.length - 1)
        nextLang = LANGS[0];
    else
        nextLang = LANGS[index + 1];

    changeLang(nextLang);
}

function changeLang(lang) {
    currentLang = lang;
    keyboardKeys.innerHTML = '';
    createKeyboard();
}

function checkKeyCombinations() {
    if (pressedKeys.length == 2 && pressedKeys.includes(16) && pressedKeys.includes(18)) {
        switchLang();
    }
}