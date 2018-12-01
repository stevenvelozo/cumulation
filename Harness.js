var libCum = require('./source/Cumulation.js');
var _ = require('underscore');
var _UserSession = '';

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

 _MaterialStorage.graph.get("Material", {
    "HINTS": {
        "IDProduct": [
            "Product"
        ],
        "IDOrganization": [
            "OrganizationMaterialJoin"
        ],
        "IDMixSpecification": [
            "MixSpecificationOrganizationMaterialJoin"
        ]
    },
    "IGNORES": {},
    "PAGING": {
        "PageSize": 10
    },
    "FILTERS": {
        "Material": "FBV~Active~EQ~1",
        "OrganizationMaterialJoin": "FBV~ExpirationDate~GE~2018-11-23"
    }
},


    (pError, pData)=>
    {
        if (pError)
        {
            _MaterialStorage.log.error(`Error getting entity records via graph connections: ${pError}`);
        }
        // _MaterialStorage.log.info(JSON.stringify( _.map(pData, 'IDTest') ) );
        _MaterialStorage.log.info( pData.length);
        
        // var testsIDS = _.map(pData, 'IDTestInstance');
        
        //  _MaterialStorage.graph.get("Lab", { "IDTestInstance": testsIDS, HINTS: {'IDTestInstance': ['TestInstance'] } },
        // (pError, pData)=>
        // {
        //     if (pError)
        //     {
        //         _MaterialStorage.log.error(`Error getting entity records via graph connections: ${pError}`);
        //     }
        //     _MaterialStorage.log.info(JSON.stringify(  _.map(pData, 'IDLab') ) );
        // });
        
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
