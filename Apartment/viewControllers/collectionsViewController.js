(function (collections) {

    var http = require("http");
    var collectionsView = require("../views/collectionsView");
    var collectionEntryView = require("../views/addCollectionView");


    collections.init = function (app) {


        app.get("/apartment/Collections/block/:block/:mon?/:year?", function (req, res) {
            var apiRespModel = {};

            var currentDate = new Date();

            var block = req.params.block;
            var mon = parseInt(req.params.mon, 10);
            if (isNaN(mon)) {

                mon = currentDate.getMonth() + 1;
            };
            var year = parseInt(req.params.year, 10);
            if (isNaN(year)) {
                year = currentDate.getFullYear();
            };


            const url = "http://" + req.headers.host + "/apartment/api/block/" + block + "/collections/" + mon + "/" + year;

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

                    var flats = {};
                    if (apiRespModel != null && apiRespModel.length > 0) {
                        flats = apiRespModel[0].flats;



                        flats.forEach(flat => {
                            var payment = {};
                            payment.flatNo = flat.flatNo;
                            payment.ownerName = flat.ownerName;
                            payment.receivedDate = flat.paymentDate;
                            payment.amountPaid = flat.amountPaid;

                            model.payments.push(payment);
                        });
                    }

                    collectionsView.render(req, res, model);

                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });




        });

        app.get("/apartment/Collection/Add", function (req, res) {
            var currentDate =
                new Date();
            var flats = [
                {
                    "flatNo": "D1",
                    "ownerName": "Rajesh Govindan"
                },
                {
                    "flatNo": "D2",
                    "ownerName": "Ravi Krishna Rao"
                },
                {
                    "flatNo": "D3",
                    "ownerName": "K.Jacob Varkey"
                },
                {
                    "flatNo": "D4",
                    "ownerName": "Madhusoodhanan"
                },
                {
                    "flatNo": "D5",
                    "ownerName": "D.Madhumathi"
                },
                {
                    "flatNo": "D6",
                    "ownerName": "T.Girija"
                },
                {
                    "flatNo": "D7A",
                    "ownerName": "Mathivanan"
                },
                {
                    "flatNo": "D7B",
                    "ownerName": "T.Vijayalaskhmi"
                }
            ];
            var model = {
                "message": "",
                "block": "D1",
                "flats": flats,
                "periodMonth": currentDate.getMonth() + 1,
                "periodYear": currentDate.getFullYear()
            }
            collectionEntryView.render(res, model);


        })

        app.post("/apartment/collection/Add", function (req, res) {
            //var block = req.params.block;
            var collection = req.body;
            var block = collection.block;
            var flatNo = collection.flat;

            // var reqbody = {};
            // reqbody.date = new Date(collection.receviedDate);
            // reqbody.mon = 4;
            // reqbody.year = 2018;
            // reqbody.paidAmount = collection.amount;
            // reqbody.excessAmount = 0;
            // reqbody.isSubmitted = "N";

            var reqbody = {
                "date": new Date(collection.receviedDate),
                "mon": collection.periodMonth, // 4,
                "year": collection.periodYear, //2018,
                "paidAmount": collection.amount,
                "excessAmount": 0,
                "isSubmitted": "N"
            }

            var reqbodyJson = JSON.stringify(reqbody);
            ///apartment/api/block/:block/flat/:flatNo
            //const url = "http://" + req.headers.host + "/apartment/api/block/" + block + "/flat/" + flatNo;
            // An object of options to indicate where to post to
            //var hostname = ( req.headers.host.match(/:/g) ) ? req.headers.host.slice( 0, req.headers.host.indexOf(":") ) : req.headers.host

            var hostName = req.headers.host;
            var port = "";
            if (req.headers.host.match(/:/g)) {
                hostName = req.headers.host.slice(0, req.headers.host.indexOf(":"));
                port = req.headers.host.slice(req.headers.host.indexOf(":") + 1);
            }

            var post_options = {
                host: hostName,//"localhost", //req.headers.host,
                port: port, //8080, //req.headers.port,
                path: "/apartment/api/block/" + block + "/flat/" + flatNo,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': reqbodyJson.length
                }
            };

            // Set up the request
            var post_req = http.request(post_options, function (postRes) {
                postRes.setEncoding('utf8');
                var data;
                res.on('data', function (chunk) {
                    data = data + chunk;
                    console.log('Response: ' + chunk);
                });
                res.on('end', function () {
                    console.log(data);

                });
                var currentDate =
                    new Date();
                    var flats = [
                        {
                            "flatNo": "D1",
                            "ownerName": "Rajesh Govindan"
                        },
                        {
                            "flatNo": "D2",
                            "ownerName": "Ravi Krishna Rao"
                        },
                        {
                            "flatNo": "D3",
                            "ownerName": "K.Jacob Varkey"
                        },
                        {
                            "flatNo": "D4",
                            "ownerName": "Madhusoodhanan"
                        },
                        {
                            "flatNo": "D5",
                            "ownerName": "D.Madhumathi"
                        },
                        {
                            "flatNo": "D6",
                            "ownerName": "T.Girija"
                        },
                        {
                            "flatNo": "D7A",
                            "ownerName": "Mathivanan"
                        },
                        {
                            "flatNo": "D7B",
                            "ownerName": "T.Vijayalaskhmi"
                        }
                    ];
                var model = {
                    "message": "added successfully",
                    //"block": "D1",
                    "flats":flats,
                    "periodMonth": currentDate.getMonth() + 1,
                    "periodYear": currentDate.getFullYear()
                };
                collectionEntryView.render(res, model);
            });

            // post the data
            post_req.write(reqbodyJson);
            post_req.end();




            // {
            //     "date":"2018-04-04 00:00:00.000",
            //     "mon" :4,
            //     "year" :2018,
            //     "paidAmount" : 2400,
            //     "excessAmount" : 0,
            //     "isSubmitted" :"N"
            // }
        })


    }

})(module.exports)