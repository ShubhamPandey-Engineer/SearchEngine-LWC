import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default  function showToast(cmpTitle , cmpMessage , cmpVariant){
    const event = new ShowToastEvent({
        title: cmpTitle,
        message: cmpMessage, 
        variant : cmpVariant         
    });
    return event;
}