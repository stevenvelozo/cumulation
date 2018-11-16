var libCum = require('./source/Cumulation.js');

var _UserSession = 'SES00xe46499401aa946a68296749c35229aac';

var _DataModel = require('/Pavia/headlight_model/json/Headlight-Extended.json')

// Compute a graph request
var _MaterialStorage = new libCum({
	Server:'https://fieldbook.headlightqa.paviasystems.com/1.0/',
    Entity:'Material',
    DataModel:_DataModel,
    DebugLog: true,
    Cookies:
    {
        'UserSession':_UserSession
    }
});
//_MaterialStorage.graph.get("Material", {IDCustomer:10, Name:'Smith', IDMixSpecification:5, IDLab:[10,20], IDOrganization:10},
// _MaterialStorage.graph.get("Material", {IDCustomer:10, Name:'Smith', IDMixSpecification:2, IDLab:[129], IDOrganization:16419, HINTS:{IDLab: ['LabMaterialAssignment','LabTestApproval']}},
//     (pError, pData)=>
//     {
//         if (pError)
//         {
//             _MaterialStorage.log.error(`Error getting entity records via graph connections: ${pError}`);
//         }
//         _MaterialStorage.log.info(JSON.stringify(pData));
//     });
    
 _MaterialStorage.graph.get("TestInstance", { "IDSample": 13797, "IDLab": 90, IGNORES: {'IDLab': true} },
//  _MaterialStorage.graph.get("Test", {"IDProject": 1125, "IDSample": 13797, "IDLab": 90, IGNORES: {IDProject: true}, HINTS:{ IDLab: ['TestLabJoin']}},
    (pError, pData)=>
    {
        if (pError)
        {
            _MaterialStorage.log.error(`Error getting entity records via graph connections: ${pError}`);
        }
        _MaterialStorage.log.info(JSON.stringify(pData));
    });
/*
// Get a list of records
var _SampleLogStorage = new libCum({
	Server:'https://fieldbook.headlightqa.paviasystems.com/1.0/',
    Entity:'SampleLog',
    DataModel:_DataModel,
    DebugLog: true,
    Cookies:
    {
        'UserSession':_UserSession
    }
});
_SampleLogStorage.getRecords("0/10", (pError, pData)=>
{
    _SampleLogStorage.log.info(Object.keys(pData));
});

// Get a single record
var _MaterialStorage = new libCum({
	Server:'https://fieldbook.headlightqa.paviasystems.com/1.0/',
    Entity:'Material',
    DataModel:_DataModel,
    DebugLog:true,
    Cookies:
    {
        'UserSession':_UserSession
    }
});
_MaterialStorage.getRecord(5832, (pError, pData)=>
{
    _MaterialStorage.log.info(Object.keys(pData));
});
*/
