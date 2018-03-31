///get maintanace payment for a month (/flat/api/:block/collections/:monYear)
/// save maintanance recevied from a flat (/flat/api/:block/collections/received/:flatNo)
/// Delete maintance recevied from a flat for the month (/flat/api/:block/collections/:flatNo/:monYear)
/// get pending collections for a month(/flat/api/:block/collection/:monYear/Pending)
(function(maintenance){
   
    var templates = require('../common/controllerTemplates')
    var service = require('../services/maintananceService');
    maintenance.init = function(app){

        app.get("/apartment/api/block/:block/collections/:mon/:year",function(req,res){
            var block = req.params.block;
            var mon = parseInt(req.params.mon,10);
            if(isNaN(mon)){
                templates.response(res,"invalid argument",null);
            };
            var year = parseInt(req.params.year,10);
            if(isNaN(year)){
                templates.response(res,"invalid argument",null);
            };

            service.getMaintananceCollectionByBlock(block,mon,year,function(err,collections){
                templates.response(res,err,collections);

            })
        })

        app.get("/apartment/api/block/:block/collections/due/:mon/:year",function(req,res){
            var block = req.params.block;
            var mon = parseInt(req.params.mon,10);
            if(isNaN(mon)){
                templates.response(res,"invalid argument",null);
            };
            var year = parseInt(req.params.year,10);
            if(isNaN(year)){
                templates.response(res,"invalid argument",null);
            };
            service.maintainanceChargesDue(block,mon,year,function(err,flats){
                templates.response(res,err,flats);
            })
        })

        app.post("/apartment/api/block/:block/flat/:flatNo",function(req,res){
            var block = req.params.block;
            var flatNo = req.params.flatNo;
            var collection = req.body;

            service.saveMaintananceCharge(block,flatNo,collection,function(err,result){
                templates.response(res,err,result);
            })
        })
    }

})(module.exports)
