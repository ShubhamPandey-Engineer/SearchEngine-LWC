import { LightningElement, track, api,wire } from 'lwc';
import getObjectConfigurations from '@salesforce/apex/SearchEngineController.getObjectConfigurations'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import showToast from 'c/searchEngineCmpUtility'


export default class SearchEngineObjectCmp extends LightningElement {


    @track filterConfig = { // object to store cmp filters info.
        showFilter: false,
        filterFields: new Set(),
        resultFields: undefined,
        selectedObj: undefined,
        disableSearchButtons: true
    }

    selectedFilters = new Set()  // to store unsaved checked filters

    dataToSend = {} // to store filters input values


    objectConfig = [] // to store all SObject configurations initially

    objectDropDropdownOptions;  // to display SOjbect from Metadata(dropdown).


    @wire(getObjectConfigurations)
    getSObjectMetadata({ error, data }) {
        try{
        if (data) {
            if (data != undefined) {
                const parseObj = JSON.parse(JSON.stringify(data))
                this.objectDropDropdownOptions = parseObj.map((object) => {
                    const obj = {
                        sobject: object?.SObject__c, searchFields: new Set(object?.Search_Fields__c.split(',')),
                        resultFields: object?.Result_Fields__c.split(',').map(field => field.toLowerCase()).join(',')
                    }
                    this.objectConfig.push(obj)
                    return { label: object?.SObject__c, value: object?.SObject__c }
                })
            }
            console.log('CONFIG', ...this.objectConfig)
        }
        else if (error) {
            /*const event = new ShowToastEvent({
                title: 'Error !',
                message: 'Error while fetching data.Please try again...', 
                variant : 'error'         
            });
            this.dispatchEvent(event);*/
            this.dispatchEvent(showToast('Error !','Error while fetching data.Please try again...','error'))
            console.error('Error:', error);
        }
        }
        catch(err){
            console.log({err})
        }

    }

    connectedCallback() {
        /*try {
            getObjectConfigurations().then(res => {
                if (res != undefined) {
                    const data = JSON.parse(JSON.stringify(res))
                    this.objectDropDropdownOptions = data.map((object) => {
                        const obj = {
                            sobject: object?.SObject__c, searchFields: new Set(object?.Search_Fields__c.split(',')),
                            resultFields: object?.Result_Fields__c.split(',').map(field => field.toLowerCase()).join(',')
                        }
                        this.objectConfig.push(obj)
                        return { label: object?.SObject__c, value: object?.SObject__c }
                    })
                }
                console.log('CONFIG', ...this.objectConfig)
            })
        }
        catch (err) {
            console.log({ err })
        }*/
    }


    renderedCallback() {
        console.log('render', this.objectConfig)
    }

    //getters


    get disableSearchButtons() {
        return (this.filterConfig.selectedObj === undefined)
    }



    get selectedValue() {
        return [...this.selectedFilters]
    }



    get filterCheckboxOptions() {
        try {
            console.log('mmm', this.objectConfig)
            const selectedSobject = this.objectConfig.find((element => element.sobject === this.filterConfig.selectedObj))
            if (selectedSobject != undefined && selectedSobject.searchFields != undefined) {
                const options = [...selectedSobject?.searchFields].map((field) => {
                    let relatedField = undefined;
                    if ((field.includes('.'))) {
                        let [first, second] = field.split('.')
                        first = first[0].toUpperCase() + first.slice(1)
                        second = second[0].toUpperCase() + second.slice(1)
                        relatedField = first + ' ' + second

                    }
                    return { label: (relatedField != undefined) ? relatedField : field[0].toUpperCase() + field.slice(1), value: field }
                })


                return options
            }
        }
        catch (err) {
            console.log({ err })
        }
    }

    get showFilterModal() {
        return this.filterConfig.showFilter
    }


    handleSObjectChange(event) {
        const objectName = event.target.value
        console.log(objectName)
        if (objectName != undefined) {
            this.filterConfig.selectedObj = objectName
            this.filterConfig.disableSearchButtons = false;
        }


        console.log('filter field', this.filterConfig.filterFields)
        this.dispatchEvent(new CustomEvent('objectchange',
            {
                detail: this.objectConfig.find(object => object.sobject === this.filterConfig.selectedObj).resultFields
            }))
        this.resetValues()


    }

    handleFieldsFilterBtn(event) {
        console.log('cliked')
        this.filterConfig.showFilter = true
    }

    handleCancelFilterBtn(event) {
        this.filterConfig.showFilter = false
    }



    handleInput(event) {
        try {
            const fieldLabel = event.target.label
            const fieldValue = event.target.value
            this.dataToSend = { ...this.dataToSend, [fieldLabel]: fieldValue }

            console.log(this.dataToSend[fieldLabel])

        }
        catch (err) {
            console.log({ err })
        }
    }

    get test() {
        return Object.values(this.dataToSend)
    }




    handleSubmitFilterBtn() {
        try {
            this.filterConfig.filterFields = [...this.selectedFilters]
            //this.filterConfig.searchQuery = `Select ${[...this.objectConfig.find(object => object.sobject === this.filterConfig.selectedObj)?.resultFields].join(' , ')} FROM ${this.filterConfig.selectedObj} WHERE `
            let fieldFields = Array.from(this.template.querySelectorAll('lightning-input')).reduce((acc, current) => {
                acc[current.label] = current.value
                return acc
            }, {})

            /*if(Object.keys(fieldFields).length === 0){   // no filter field is selected
                const emptyData = [...this.objectConfig.find((object=>object.sobject === this.filterConfig.selectedObj))?.searchFields].reduce((acc,current)=>{
                    acc[current] = ''
                    return acc
                },{})
                fieldFields = emptyData
            }*/



            const filterData = {
                SObjectName: this.filterConfig.selectedObj, fields: fieldFields,
                resultFields: this.objectConfig.find((object => object.sobject === this.filterConfig.selectedObj)).resultFields
            }

            console.log(filterData)

            const event = new CustomEvent('filter', { detail: filterData })
            this.dispatchEvent(event)
        }
        catch (err) {
            console.log({ err })
        }
        finally {
            this.filterConfig.showFilter = false

        }
    }


    handleSearchFields(event) {
        try {
            const selectedField = event.target.value
            console.log(selectedField)
            if (selectedField != undefined) {
                this.selectedFilters = new Set([...selectedField])

                //this.filterConfig.filterFields = new Set([...selectedField])
            }

            console.log('chekc', this.selectedFilters)
        }
        catch (err) {
            console.log({ err })
        }
    }

    handleRemovePill(event) {
        try {
            const removedPill = event.currentTarget.label
            if (removedPill != undefined) {
                //this.filterConfig.filterFields.delete(removedPill)
                //this.filterConfig.filterFields = new Set([...this.filterConfig.filterFields])  // to call render callback

                this.selectedFilters.delete(removedPill)
                this.selectedFilters = new Set([...this.selectedFilters])  // to call render callback
            }

            console.log('pill removed', this.filterConfig.filterFields)
        }
        catch (err) {
            console.log({ err })
        }
    }

    resetValues() {
        this.selectedFilters = new Set()
        this.filterConfig.filterFields = new Set()
    }



}