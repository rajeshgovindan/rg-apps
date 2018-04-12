(function (service) {
    var template = require('../common/serviceTemplates');
    service.getMaintananceCollectionByBlock = function (block, month, year, next) {
        template.dbConHandler(function (db) {
            var pipeline = [
                {
                    "$match": { "code": block, "flats.maintanaceChrgs.mon": { "$eq": month } }
                },
                {
                    "$unwind": "$flats"

                },
                {
                    "$unwind": "$flats.maintanaceChrgs"
                },
                {
                    "$match": { "code": block, "flats.maintanaceChrgs.mon": { "$eq": month } }
                },
                {
                    
                    "$group": {
                        "_id": "$code",
                        "flats" : {"$push" : {
                            "block" : "$blockName",
                            "flatNo": "$flats.flatNo",
                            "ownerName": "$flats.ownerName",
                            "paymentDate": "$flats.maintanaceChrgs.date",
                            "amountPaid": "$flats.maintanaceChrgs.paidAmount",
                            "excessAmountPaid" :"$flats.maintanaceChrgs.excessAmount",
                            "isSubmitted": "$flats.maintanaceChrgs.isSubmitted"
                        }} 
                    }
                }

            ]
            db.apartment.aggregate(pipeline).toArray(function (err, collections) {
                next(err, collections);

            })
        })
    };

    service.maintainanceChargesDue = function (block, month, year, next) {
        template.dbConHandler(function (db) {
            // var pipeline = [
            //     {
            //         "$match": { "code": block, "flats.maintananceChrgs.mon": { "$nin": [month] } }
            //     },
            //     {
            //         "$unwind": "$flats"

            //     },
            //     {
            //         "$unwind": "$flats.maintanaceChrgs"
            //     },
            //     {
            //         "$match": { "code": block, "flats.maintananceChrgs.mon": { "$nin": [month] } }
            //     }

            // ]

            // //db.col.find({"code":block,"flats.maintananceChrgs.mon": {"$nin":[month]}} ).toArray(function(err,flats){
            //     db.col.aggregate(pipeline).toArray(function (err, flats) {
            //     next(err, flats);
            // })

            service.getMaintananceCollectionByBlock(block, month, year, function (err, flats) {
                var ids = flats.map(function (result) {
                    return result.flats.flatNo;
                });

                var pipeline = [
                    // {
                    //     "$match": { "code": block, "flats.flatNo": { "$nin": ids } }
                    // },
                    {
                        "$unwind": "$flats"

                    },
                    {
                        "$match": { "code": block, "flats.flatNo": { "$nin": ids } }
                    }

                ]
                db.apartment.aggregate(pipeline).toArray(function (err, dues) {
                    next(err, dues);

                })
            })
        })
    }
    service.saveMaintananceCharge = function (block, flatNo, collection, next) {

        template.dbConHandler(function (db) {

            var newValues = {
                $push: {
                    "flats.$.maintanaceChrgs": {
                        "date": collection.date,
                        "mon": collection.mon,
                        "year": collection.year,
                        "paidAmount": collection.paidAmount,
                        "excessAmount": collection.excessAmount,
                        "isSubmitted": "N"

                    }
                }
            };
            db.apartment.update({ "code": block, "flats.flatNo": flatNo }, newValues, function (err, result) {
                next(err, result);
            })

        })

    }



})(module.exports)