(function (collections) {

    var http = require("http");
    var collectionsView = require("../views/collectionsView");
    
    

    collections.init = function (app) {


        app.get("/apartment/Collections/block/:block/:mon?/:year?", function (req, res) {
            var apiRespModel = {};
            
            var currentDate = new Date();

            var block = req.params.block;
            var mon = parseInt(req.params.mon,10);
            if(isNaN(mon)){
               
                mon= currentDate.getMonth()+1;   
            };
            var year = parseInt(req.params.year,10);
            if(isNaN(year)){
                year = currentDate.getFullYear();
            };
           
            
            const url = "http://" + req.headers.host + "/apartment/api/block/"+block+"/collections/"+mon+"/"+year;
            http.get(url, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    
                    apiRespModel = JSON.parse(data);

                    var model = {};

                    model.status = "Received";
                    model.payments = [];

                    var flats = apiRespModel[0].flats;

                    flats.forEach(flat => {
                        var payment = {};
                        payment.flatNo = flat.flatNo;
                        payment.ownerName= flat.ownerName;
                        payment.receivedDate = flat.paymentDate;
                        payment.amountPaid = flat.amountPaid;

                        model.payments.push(payment);
                    });

                    collectionsView.render(req, res, model);

                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });




        })

    }

})(module.exports)