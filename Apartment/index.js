(function (apartment) {



    apartment.init = function (app, initParams) {
        
        //app.set('views', __dirname + '/views');
        var database = require("./api/data/database");
        database.init(initParams.db);
        var controllers = require("./api/controllers");
        var services = require("./api/services");
        var viewControllers = require("./viewControllers");
        controllers.init(app);
        viewControllers.init(app);


    }
})(module.exports)
