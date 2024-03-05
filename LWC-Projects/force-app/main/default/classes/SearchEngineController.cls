public with sharing class SearchEngineController {
    
	@AuraEnabled(cacheable =true)
    public static List<Search_Engine_Setting__mdt> getObjectConfigurations(){
        try{
            return [Select SObject__c, Result_Fields__c , Search_Fields__c from Search_Engine_Setting__mdt where Is_Seachable__c =true];
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable =true)
    public static String getSearchedRecords(String clientData){
        try{
        String soqlString ='';
        SearchWrapper wrapperObj = (SearchWrapper)JSON.deserialize(clientData,SearchWrapper.Class);
        if(wrapperObj != null){
            String data = '';
            Integer count = 0;
            for(String str : wrapperObj.fields.keyset()){
                data += str + ' = ' +  '\''+ wrapperObj.fields.get(str) + '\'';
                count++;
                if(wrapperObj.fields.size() > count && count >0){
                    data += ' AND ';
                }
            }
            system.debug(data);
            soqlString = 'SELECT  '+ wrapperObj.resultFields + '  FROM  ' + wrapperObj.SObjectName ;
            if(!String.isBlank(data)){
                soqlString += ' WHERE ' + data  + '  LIMIT 50000';
            }
            else{
                soqlString += ' LIMIT 50000';
            }
            System.debug(soqlString);
        }
            List<Sobject> searchedRecords = Database.query(soqlString);
            if(searchedRecords.size() != 0) return JSON.serialize(searchedRecords);
            return null;
        }
        catch(Exception e){
        	throw new AuraHandledException(e.getMessage());
        }
    }
    
    public class SearchWrapper{
        
        @AuraEnabled()
        public String SObjectName{get;set;}
        
        @AuraEnabled()
        public Map<String,String> fields{get;set;}
        
        @AuraEnabled()
        public String resultFields{get;set;}
    }
    
    
    
}