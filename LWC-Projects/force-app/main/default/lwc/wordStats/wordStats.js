import { LightningElement, track } from 'lwc';

import {name} from 'c/commonJS'

export default class WordStats extends LightningElement {
    @track trackProp = {
        wordCount: 0,
        charCount: 0,
        lineCount: 0
    }
    usertext = '';
    //Capture total words , characters , lines
   connectedCallback(){
    console.log(name)
   }

    getUserInput(event) {
        this.usertext = event.detail.value
        this.trackProp.charCount = [...this.usertext].filter(str => str != ' ').length
        this.trackProp.wordCount = this.usertext.trim().split(' ').filter(str => str != "" || str != '.').length
        this.trackProp.lineCount = this.usertext.split('.').length - 1
    }

    get getWordCount() {
        return `Words Count : ${this.trackProp.wordCount}`;
    }

    get getCharCount() {
        return `Characters Count : ${this.trackProp.charCount}`;
    }

    get getLineCount() {
        return `Lines Count : ${this.trackProp.lineCount}`;
    }




}