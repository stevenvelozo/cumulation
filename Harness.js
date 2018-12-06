var libCum = require('./source/Cumulation.js');
var _ = require('underscore');
var _UserSession = 'SES00x88eaaca7d48b4c4eaa588dfae6400a14';

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
    "IDSample": [
        11118685,
        8111687
        //15048,
        //15047
    ],
    "HINTS": {
        "IDLabParent": [
            "TestLabJoin"
        ]
    },
    "PROPERTIES":
    {
        "ForceJoins": true
    },
    "IGNORES": [
        "IDProject"
    ],
    "PAGING": {
        "PageSize": 250,
        "Page": 0
    },
    "FILTERS": {
        "Test": "FSF~Name~ASC~0"
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
