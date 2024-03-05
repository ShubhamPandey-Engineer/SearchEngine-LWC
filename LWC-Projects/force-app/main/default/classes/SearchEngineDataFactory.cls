@isTest

public class SearchEngineDataFactory {
	
    public static SearchWrapper createSearchInput(Map<String,String> filterFieldsMap){
    	SearchWrapper wrapperObject = new SearchWrapper();
        wrapperObject.SObjectName= 'Contact';
        wrapperObject.fields = filterFieldsMap;
        wrapperObject.resultFields = 'Name,Email';
        return wrapperObject;
    }
    
    public static void createTestSObject(SObjectType sObjectType, Map<Schema.SObjectField , String> fieldsValues){
        //SObject obj = (SObject) Type.forName('Schema', sobjectName).newInstance();
        Sobject obj = sObjectType.newSObject();
        system.debug(obj);
        for(Schema.SObjectField field : fieldsValues.keyset()){
            obj.put(field,fieldsValues.get(field));
        }
        insert obj;
    }
    
    
    public static List<Search_Engine_Setting__mdt> createTestMetadataRecords(){
        // Create test data
        List<Search_Engine_Setting__mdt> settings = new List<Search_Engine_Setting__mdt>();
        settings.add(new Search_Engine_Setting__mdt(
            DeveloperName = 'Test_Object_Configuration',
            SObject__c = 'TestObject__c',
            Result_Fields__c = 'Name, Description__c',
            Search_Fields__c = 'Name',
            Is_Seachable__c = true
        ));
        return settings;
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