@IsTest

public class SearchEngineControllerTest {
    
    @TestSetup
    private static void createRecords(){
        Map<Schema.SObjectField, String> fieldMap = new Map<Schema.SObjectField,String>();
        fieldMap.put(Contact.FirstName,'Shubham');
        fieldMap.put(Contact.LastName,'Pandey');
        fieldMap.put(Contact.Email,'test@demo.com');

        SearchEngineDataFactory.createTestSObject(Contact.Sobjecttype, fieldMap);
    }

    private static testmethod void testMetadataConfig(){
        
        List<Search_Engine_Setting__mdt> settings = SearchEngineDataFactory.createTestMetadataRecords();
        Test.startTest();
        List<Search_Engine_Setting__mdt> records = SearchEngineController.getObjectConfigurations();
        Test.stopTest();
        
        System.assertEquals(1,records.size());
        System.assertEquals(1,settings.size());
    }
    
    
    private static testmethod void testSearchResultSingleFilter(){
        Map<String ,String> fieldFilterMap = new Map<String,String>{'Name'=>'Shubham Pandey'};
    	String clientData = JSON.serialize(SearchEngineDataFactory.createSearchInput(fieldFilterMap));
        SearchEngineController.getSearchedRecords(clientData);
    }
    
     private static testmethod void testSearchResultMultipleFilter(){
        Map<String ,String> fieldFilterMap = new Map<String,String>{'Name'=>'Shubham Pandey','Email'=>'Test@demo.com'};
    	String clientData = JSON.serialize(SearchEngineDataFactory.createSearchInput(fieldFilterMap));
        SearchEngineController.getSearchedRecords(clientData);
    }
    
     private static testmethod void testSearchResultNoFilter(){
    	String clientData = JSON.serialize(SearchEngineDataFactory.createSearchInput(new Map<String,String>()));
        SearchEngineController.getSearchedRecords(clientData);
    }
    
    
    private static testmethod void testSearchResultNoData(){
        try{
    	String clientData = JSON.serialize(SearchEngineDataFactory.createSearchInput(null));
        SearchEngineController.getSearchedRecords(clientData);
        }
        catch(Exception e){
            system.debug(e.getmessage());
        }
    }
}