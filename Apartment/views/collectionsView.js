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
                var content = contentTemplate({
                    "status": "Pending", "dues": [{
                        "flatNo": "D1",
                        "ownerName": "Rajesh",
                        "monYear": "Apr 2018",
                        "amount": 2400
                    },
                    {
                        "flatNo": "D2",
                        "ownerName": "Ravi",
                        "monYear": "Apr 2018",
                        "amount": 2400
                    }]
                });

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(content);
            }
            res.end();
        })


    }

    view.renderPendingDetails = function (res, model) {

    }

    view.renderPaidDetails = function (res, model) {

    }
})(module.exports)