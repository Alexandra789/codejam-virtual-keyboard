import {TextArea} from './TextArea.js';
import {VirtualKeyboard} from './VirtualKeyboard.js';


export class Layout {
    constructor() {
        let contentWrapper = document.createElement('div');
        contentWrapper.classList.add('content-wrapper');
        document.body.append(contentWrapper);

        let textarea = document.createElement('textarea');
        textarea.classList.add('textarea');
        textarea.onblur = function() { this.focus() };
        contentWrapper.appendChild(textarea);

        let keyboard = document.createElement('div');
        keyboard.classList.add('keyboard');
        contentWrapper.appendChild(keyboard);

        let keyboardKeys = document.createElement('div');
        keyboardKeys.classList.add('keyboard__keys');
        keyboard.appendChild(keyboardKeys);

        let infoWrapper = document.createElement('div');
        infoWrapper.classList.add('info-wrapper');
        document.body.append(infoWrapper);

        let infoAboutOS = document.createElement('h3');
        infoAboutOS.classList.add('info-about-os');
        infoAboutOS.innerText += "Клавиатура создана в операционной системе Windows";
        infoWrapper.append(infoAboutOS);

        let infoAboutLang = document.createElement('h3');
        infoAboutLang.classList.add('info-about-lang');
        infoAboutLang.innerText += 'Для переключения языка комбинация: левыe shift + alt';
        infoWrapper.append(infoAboutLang);

        textarea.focus();

        this.output = new TextArea(textarea);
        this.input = new VirtualKeyboard(keyboard, this.output, keyboardKeys);
        this.loadstorage();
    };

    loadstorage() {
        let self = this;

        window.onbeforeunload = function() {
            let currentLang = self.input.getCurrentLang;
            localStorage.setItem("lang", currentLang);
        };
         
        window.onload = function() {
            var lang = localStorage.getItem("lang");
            if (lang !== null){
                self.input.changeLang(lang);
            };
        };
    };
};