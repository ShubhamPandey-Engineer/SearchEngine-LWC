import { LightningElement, api } from 'lwc';
import getSearchedRecords from '@salesforce/apex/SearchEngineController.getSearchedRecords'
import showToast from 'c/searchEngineCmpUtility'



export default class SearchEngineResultCmp extends LightningElement {

    @api cmpData
    runOnce = false
    columnsList
    dataList
    _cmpConfig
    _resultFieldsList
    isLoading = false

    @api
    set getData(value) {
        try {
            const recordToQuery = (value != undefined) ? JSON.parse(JSON.stringify(value)) : undefined
            console.log(recordToQuery)
            if (recordToQuery != undefined) {
                console.log('setting up table....')
            }

            if (recordToQuery != undefined) {
                this._cmpConfig = recordToQuery
                this.setDataTableRecords(recordToQuery)
            }

        }
        catch (err) {
            this.dispatchEvent(showToast('Error !', 'Something went wrong .Please contact your system administrator', 'error'))
            console.log(err)
        }


    }

    get getData() {

    }


    get objectResultFields() {

    }

    @api
    set objectResultFields(value) {
        if (value != undefined) {
            console.log(value)
            this._resultFieldsList = value
            this.setDataTableColumn()
        }
    }


    connectedCallback() {

        console.log('@@Result CMP connected', name)
    }

    renderedCallback() {

        console.log('result callback')
        if (!this.runOnce) {
            if (this._cmpConfig != undefined) {
                //this.setDataTableColumn()
                this.runOnce = true
            }

        }
    }

    async setDataTableRecords(objectConfig) {
        try {
            this.isLoading = true;
            const response = await getSearchedRecords({ clientData: JSON.stringify(objectConfig) })
            console.log('before', response)
            if (response !== null || (response != undefined && response.length != 0)) {
                console.log(response)
                const parsedObj = JSON.parse(response)
                const resultFieldSet = new Set([...this._cmpConfig.resultFields.split(',')])
                console.log({ parsedObj })
                this.dataList = parsedObj.map((record) => {
                    const obj = {}
                    for (let key in record) {

                        const prop = key.toLowerCase()
                        if (resultFieldSet.has(prop)) { // child  fields
                            obj[prop] = record[key]
                        }
                        if (key === 'Id') {
                            obj['recordLink' + key] = '/' + record[key]
                        }

                        if (this.parentObjConfig.has(prop)) {
                            for (let parentField in record[key]) {
                                obj[prop + '.' + parentField.toLowerCase()] = record[key][parentField]
                                if (parentField === 'Id') {
                                    obj['recordLink' + prop + '.name'] = '/' + record[key][parentField]
                                }
                            }
                        }
                    }

                    console.log({ obj })
                    return obj
                })



            }

            if (response === null || response === undefined || response?.length === 0) {
                this.dataList = []
                this.dispatchEvent(showToast('No records found...', '', 'warning'))

            }
        }
        catch (err) {
            this.dispatchEvent(showToast('Error !', 'Something went wrong .Please contact your system administrator', 'error'))
            console.log({ err })
        }

        finally {
            this.isLoading = false;
        }
    }

    setDataTableColumn() {
        try {
            console.log('setting columns....')
            this.dataList = []
            this.columnsList = this._resultFieldsList.split(',').map((column => {
                let columnConfig = { label: column.includes('.') ? column.split('.').join(' ') : column.toUpperCase(), fieldName: column }
                if (columnConfig.label === 'NAME') {
                    columnConfig = { typeAttributes: { label: { fieldName: 'name' }, target: '_blank' }, type: 'url', ...columnConfig }
                    columnConfig['fieldName'] = 'recordLinkId'
                }

                if (columnConfig.label === 'account name') {
                    columnConfig = { typeAttributes: { label: { fieldName: column }, target: '_blank' }, type: 'url', ...columnConfig }
                    columnConfig['fieldName'] = 'recordLink' + columnConfig.fieldName
                }
                return columnConfig
            }))

            console.log('data able column', this.columnsList)


            let parentObjMap = new Map()
            for (let item of this._resultFieldsList.split(',')) {
                if (item.includes('.')) {
                    const parentObj = item.split('.')[0].toLowerCase()
                    const fieldName = item.split('.')[1].toLowerCase()
                    if (parentObjMap.has(parentObj)) {
                        console.log('got', fieldName)
                        parentObjMap.set(parentObj, parentObjMap.get(parentObj).add(fieldName));
                    }
                    else {
                        parentObjMap.set(parentObj, new Set([fieldName]));
                    }
                }
            }
            console.log(parentObjMap)
            this.parentObjConfig = parentObjMap
        }
        catch (err) {
            this.dispatchEvent(showToast('Error !', 'Something went wrong .Please contact your system administrator', 'error'))
            console.log(err)
        }
    }


    errorCallback() {
        this.dispatchEvent(showToast('Error !', 'Something went wrong .Please contact your system administrator', 'error'))
    }


}