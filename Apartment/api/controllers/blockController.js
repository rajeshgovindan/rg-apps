// get all flat details for a block (/flat/api/:block)
// get a flat of a block (/flat/api/:block/:flatNo)
// create  flats under block (/flat/api/:block/)
// delete flats under block (/flat/api/:block/)
// delete a flat of  block (/flat/api/:block/:flatNo)
// Update flat details of a block (/flat/api/:block/:flatNo)

(function(blockController){
    
    var responseHanlder = require("../common/controllerTemplates");
    var blockService = require("../services/blockService");

    blockController.init = function(app){
        //var service = require('../services');

        app.post("/apartment/api/block", function(req,res){
            var block = req.body;
            blockService.addBlock(block,function(err){
                responseHanlder.response(res,err,"Block " + block.code + "has been created successfuly");

            })
        });
        app.get("/apartment/api/:block",function(req,res,next){
            var block = req.params.block;
            blockService.getFlatDetails(block,function(err,flats){

                responseHanlder.response(res,err,flats);
            });

            


            
        })

    }

})(module.exports)