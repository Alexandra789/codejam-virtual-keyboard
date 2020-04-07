let currentLang = 'ru';
let upperCase = false;
let shifted = false;
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

let infoWrapper = document.createElement('div');
infoWrapper.className = 'info-wrapper';
document.body.append(infoWrapper);

let infoAboutOS = document.createElement('h3');
infoAboutOS.className = 'info-about-os';
infoAboutOS.innerText += "Клавиатура создана в операционной системе Windows";
infoWrapper.append(infoAboutOS);

let infoAboutLang = document.createElement('h3');
infoAboutLang.className = 'info-about-lang';
infoAboutLang.innerText += 'Для переключения языка комбинация: левыe shift + alt';
infoWrapper.append(infoAboutLang);

function createButton(keyCode, lang) {
    let keyboardKey = document.createElement('button');
    keyboardKey.className = 'keyboard__key';
    keyboardKey.type = 'button';
    keyboardKey.value = keyCode;
    keyboardKey.innerText = KEY_LAYOUTS[lang][keyCode];

    if (keyCode in SPECIAL_KEYS)
        keyboardKey.className += ` ${ SPECIAL_KEYS[keyCode] }
    `;

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
        }
    })
}

function keyboardClickButton(e) {
    e.preventDefault();
    let keyboardKey = document.querySelectorAll('.keyboard__key')
    for (let i = 0; i < keyboardKey.length; i++) {
        let code = e.keyCode;
        if (e.location === 2)
            code = -code;
        if (code == keyboardKey[i].value) {
            keyboardKey[i].className += ' active';
        }
    }

    if (e.keyCode == 16) { // shift
        toggleShift(true);
    }

    if (!pressedKeys.includes(e.keyCode))
        pressedKeys.push(e.keyCode);
    handleKeyPress(e.keyCode, e.location);
    checkKeyCombinations();
}

function rewriteKeyboard() {
    let keyboardKey = document.querySelectorAll('.keyboard__key')
    for (let i = 0; i < keyboardKey.length; i++) {
        let keyCode = keyboardKey[i].value;
        keyboardKey[i].innerText = KEY_LAYOUTS[currentLang][keyCode];

        if (!(keyCode in SPECIAL_KEYS)) {
            if (shifted && keyCode in SHIFT_KEYS[currentLang]) {
                keyboardKey[i].innerText = SHIFT_KEYS[currentLang][keyCode];
            }

            if (upperCase != shifted) {
                keyboardKey[i].innerText = keyboardKey[i].innerText.toUpperCase();
            }
        }
    }
}

function keyboardReleaseButton(e) {
    e.preventDefault();
    let keyboardKey = document.querySelectorAll('.keyboard__key')
    for (let i = 0; i < keyboardKey.length; i++) {
        let code = e.keyCode;
        if (e.location === 2)
            code = -code;
        if (code == keyboardKey[i].value) {
            keyboardKey[i].classList.remove('active');
        }
    }

    if (e.keyCode == 16) { // shift
        toggleShift(false);
    }

    var index = pressedKeys.indexOf(e.keyCode);
    if (index !== -1) pressedKeys.splice(index, 1);
}

function eraseLetter() {
    let caretPos = textarea.selectionStart;
    let text = textarea.innerHTML;
    textarea.innerHTML = text.slice(0, caretPos - 1) + text.slice(caretPos);
    textarea.selectionStart = caretPos - 1;
}

function deleteNextLetter() {
    let caretPos = textarea.selectionStart;
    let text = textarea.innerHTML;
    textarea.innerHTML = text.slice(0, caretPos) + text.slice(caretPos + 1);
    textarea.selectionStart = caretPos;
}

function printLetter(letter) {
    if (!letter) return;

    if (upperCase != shifted)
        letter = letter.toUpperCase();
    let caretPos = textarea.selectionStart;
    let text = textarea.innerHTML;
    textarea.innerHTML = `${text.slice(0, caretPos)}${letter}${text.slice(caretPos)}`;
    textarea.selectionStart = caretPos + 1;
}

function toggleCaps() {
    upperCase = !upperCase;
    rewriteKeyboard();
}

function toggleShift(toggle) {
    if (shifted === toggle) return;

    shifted = toggle;
    rewriteKeyboard();
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
    rewriteKeyboard();
}

function handleSpecialKey(key) {
    if (key == 32) {
        printLetter(' ');
    } else if (key == 8) {
        eraseLetter();
    } else if (key == 20) {
        toggleCaps();
    } else if (key == 38) {
        printLetter('▲');
    } else if (key == 37) {
        textarea.selectionStart -= 1;
        textarea.selectionEnd = textarea.selectionStart;
    } else if (key == 39) {
        textarea.selectionStart += 1;
        textarea.selectionEnd = textarea.selectionStart;
    } else if (key == 40) {
        printLetter('▼');
    } else if (key == 9) {
        printLetter('\t');
    } else if (key == 13) {
        printLetter('\n');
    } else if (key == 46) {
        deleteNextLetter();
    }
}

function handleKeyPress(keyCode) {
    if (keyCode in SPECIAL_KEYS)
        handleSpecialKey(keyCode);
    else {
        if (shifted && keyCode in SHIFT_KEYS[currentLang])
            printLetter(SHIFT_KEYS[currentLang][keyCode]);
        else
            printLetter(KEY_LAYOUTS[currentLang][keyCode]);
    }
}

function checkKeyCombinations() {
    if (pressedKeys.length == 2 && pressedKeys.includes(16) && pressedKeys.includes(18)) {
        switchLang();
    }
}

window.onbeforeunload = function() {
    localStorage.setItem("lang", currentLang);
}

window.onload = function() {
    var lang = localStorage.getItem("lang");
    if (lang !== null)
        currentLang = lang;

    window.onkeydown = keyboardClickButton;
    window.onkeyup = keyboardReleaseButton;
    createKeyboard();
    bindMouseClicks();
}