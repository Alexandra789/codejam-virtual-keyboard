export class TextArea {
    constructor(element) {
        this.element = element; 
    }

    printLetter(letter) {
        if (!letter) return;
    
        let caretPos = this.element.selectionStart;
        let text = this.element.innerHTML;
        this.element.innerHTML = `${text.slice(0, caretPos)}${letter}${text.slice(caretPos)}`;
        this.element.selectionStart = caretPos + 1;
    }

    eraseLetter() {
        let caretPos = this.element.selectionStart;
        let text = this.element.innerHTML;
        this.element.innerHTML = text.slice(0, caretPos-1) + text.slice(caretPos);
        this.element.selectionStart = caretPos-1;
    }
    
    deleteNextLetter() {
        let caretPos = this.element.selectionStart;
        let text = this.element.innerHTML;
        this.element.innerHTML = text.slice(0, caretPos) + text.slice(caretPos+1);
        this.element.selectionStart = caretPos;
    }

    moveCaret(delta) {
        this.element.selectionStart += delta;
        this.element.selectionEnd = this.element.selectionStart;
    }
}