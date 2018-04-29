(function(view){
   
    var fs = require("fs");
    var _ = require("underscore");
    var addCollectionPageUrl = __dirname + "/addCollection.html";

    view.showError = function(res,err){

    }

    view.render = function(res,model){
        fs.readFile(addCollectionPageUrl, function (err, htmlContent) {
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

})(module.exports)