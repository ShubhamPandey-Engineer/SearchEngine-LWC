import { LightningElement, track } from 'lwc';
export default class SearchEngineParentCmp extends LightningElement {

    filteredData
    objectResultFields

    handleFilterRequest(event) {
        console.log(event)
        const data = JSON.parse(JSON.stringify(event.detail))
        console.log(data)
        if (data != undefined) {
            this.filteredData = data
        }
    }


    handleObjectChange(event) {
        const data = JSON.parse(JSON.stringify(event.detail))
        console.log('obj change liasrtene', data)
        if(data != undefined){
            this.objectResultFields = data
        }
    }
}