(function (apartment) {



    apartment.init = function (app, initParams) {
        
        var database = require("./api/data/database");
        database.init(initParams.db);
        var controllers = require("./api/controllers");
        var services = require("./api/services");
        controllers.init(app);


    }
})(module.exports)
