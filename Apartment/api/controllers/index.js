(function (controllers) {

    var blockController = require('./blockController');
    var maintananceController = require('./maintanaceController');



    controllers.init = function (app) {
        blockController.init(app);
        maintananceController.init(app);



    }
})(module.exports)