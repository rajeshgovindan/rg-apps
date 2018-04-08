(function (collections) {

    var http = require("http");
    var collectionsView = require("../views/collectionsView");
    
    collections.init = function (app) {
        

        app.get("/apartment/Collections", function (req, res) {

            collectionsView.render(req,res,{});


        })

    }

})(module.exports)