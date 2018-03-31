
    (function (services) {

        var template = require('../common/serviceTemplates')
        var seedData = require('./apartmentSeedData')
        services.seedData = function (data) {
            template.dbConHandler(function (db) {
                db.apartment.count(function(err,count){
                    if(err){
                        console.log("error occurred while reading collection");
                    }
                    if(count <= 0){
                        db.apartment.insert(data);
                    }
    
                })
    
            });
         }
    
         services.seedData(seedData.initRows)
    })(module.exports)
