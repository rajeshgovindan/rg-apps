(function (service) {
    //var database = require('../../../api/data/database');
    var templates = require('../common/serviceTemplates');
    service.getFlatDetails = function (blockCode, next) {
        //var collectionName = "flat";
        templates.dbConHandler(function (db) {
            db.apartment.find({ "code": blockCode }).toArray(function (err, block) {
                next(err, block)
            })
        });

    }
    service.addBlock = function (block, next) {
        templates.dbConHandler(function (db) {
            db.apartment.insert(block, function (err) {
                next(err);

            })
        })
    }

    service.deleteBlock = function (block, next) {
        templates.dbConHandler(function (db) {
            db.apartment.deleteOne({ "code": block }, function (err, result) {
                next(err, result);
            })
        })
    }
    service.addFlat = function (blockCode, flat, next) {
        templates.dbConHandler(function (db) {
            var newFlat = {
                $push: {
                    "flats": flat
                }
            };
            db.apartment.update({
                "code": blockCode
            }, newFlat, function (err, result) {
                next(err, result);
            }
            )
        })
    }

    service.deleteFlat = function (blockCode, flatNo, next) {
        templates.dbConHandler(function (db) {
            var removeFlat = {
                $pull: {
                    "flats": { "flatNo": flatNo }
                }
            };
            db.apartment.update({
                "code": blockCode
            }, removeFlat, function (err, result) {
                next(err, result);
            }
            )
        })
    }

})(module.exports)