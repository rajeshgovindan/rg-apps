(function (controllers) {

    var collectionViewController = require('./collectionsViewController');
//    var maintananceController = require('./maintanaceController');



    controllers.init = function (app) {
        collectionViewController.init(app);
       // maintananceController.init(app);



    }
})(module.exports)