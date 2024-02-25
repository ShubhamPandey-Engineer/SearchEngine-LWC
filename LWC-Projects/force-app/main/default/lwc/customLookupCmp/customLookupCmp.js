import { LightningElement,api ,track,wire } from 'lwc';
import getRecordList from '@salesforce/apex/LookupCmpController.search';

export default class CustomLookupCmp extends LightningElement {

    searchedTextValue
    @api sobjectAPIName = 'Account'
    isRecordSelected=false
    selectedRecordDetail

    recordList

    
    handleNameChange(event){
        const searchedText = event.target.value
        if(searchedText != undefined || searchedText != ''){
            console.log('server call')
            this.searchedTextValue = searchedText

        }
    }

    @wire(getRecordList,{searchTerm : '$searchedTextValue' , myObject : '$sobjectAPIName' , filter:''})  // giving undefined won't call the function
    handleSearchedData({error ,data}){
        if(data){
            console.log('data fetched')
            console.log({data})
            this.recordList = data
        }

        else if(error){
            console.log('error')
            console.log({error})
        }
    }


    handleRecordSelect(event){
        console.log(event.target , event.currentTarget)
        const selectedRecordId = event.currentTarget.dataset?.recordId;
        if(selectedRecordId != undefined){
            this.isRecordSelected =true
            this.selectedRecordDetail = this.recordList.filter((record)=>record.Id === selectedRecordId)[0]
            console.log(this.selectedRecordDetail)
        }
    }

    handleRemovePill(event){
        this.isRecordSelected =false
        this.selectedRecordDetail = undefined
    }
    





}