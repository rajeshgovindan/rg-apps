(function (view) {

    var fs = require("fs");
    var _ = require("underscore");
    ///Data/Technical/Git-Source/Nodejs/rg-apps/Apartment/views/Collections.html
    var collectionPageUrl = __dirname + "/Collections.html";
    view.render = function (req, res, model) {

        fs.readFile(collectionPageUrl, function (err, htmlContent) {
            if (err) {
                res.writeHead(404);
                res.write('Contents you are looking are Not Found');
            } else {

                var contentTemplate = _.template(htmlContent.toString());
                
                var content = contentTemplate(model);

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(content);
            }
            res.end();
        })


    }

    view.showError = function(res,err){
        res.writeHead(500);
        res.write('Oops Something went wrong' + err);
    }

    view.renderPendingDetails = function (res, model) {

    }

    view.renderPaidDetails = function (res, model) {

    }
})(module.exports)