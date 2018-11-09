var libCum = require('./source/Cumulation.js');

var _UserSession = 'SES0x59bd610c7b000000';

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
_MaterialStorage.graph.get("Material", {IDCustomer:10, Name:'Smith', IDMixSpecification:7, IDLab:[159,13], IDOrganization:17211},
    (pError, pData)=>
    {
        if (pError)
        {
            _MaterialStorage.log.error(`Error getting entity records via graph connections: ${pError}`);
        }
        //_MaterialStorage.log.info(JSON.stringify(pData));
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
