import { LightningElement, track } from 'lwc';

export default class GetMotivationalQuotes extends LightningElement {

    constructor() {
        super()
        this.getQuote()


    }

    renderedCallback() {

    }
    isLoading = true;
    @track content
    @track authorList
    @track filtered = []
    isFiltered = false
    authorSelected;

    async getQuote() {
        await fetch('https://type.fit/api/quotes').then(res => res.json()).then(data => {
            this.content = data.map((quote, index) => {
                return { text: quote.text || 'null', author: quote.author || 'unknown', index: index + 1 }

            })
            this.isLoading = false

            /* this.authorList = this.content.map((quote, index) => {
                 return { label: quote.author, value: quote.author }
             })*/

            this.authorList = [...new Set(this.content.map(quote => quote.author))].map((author) => {
                return { label: author, value: author }

            })
            this.authorList.unshift({ label: 'Reset', value: 'Reset' })
        })


    }


    get getContent() {
        console.log('fil', this.filtered)
        console.log('called')

        return (this.isFiltered && this.filtered.length != 0) ? this.filtered : (this.authorSelected === 'Reset') ? this.content : this.content

    }





    filterQuotes(event) {
        this.authorSelected = event.detail.value;
        this.isFiltered = true
        console.log(this.authorSelected)
        const originalContent = [...this.content]
        this.filtered = this.content.filter(quote => quote.author === this.authorSelected)
        console.log(this.filtered)

    }



}