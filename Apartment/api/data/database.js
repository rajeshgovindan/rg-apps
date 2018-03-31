(function(db){
    var mongodb = require("mongodb");
    var client = require("mongodb").MongoClient;
    //var dbUrl = "mongodb://localhost:27017/rg-todolist"
    var dbUrl = null;
    var dbName = null;
    var theDb = null;
    db.init = function(dbParams){

        //mongoHost,mongoPort,mongoDbName,mongoUser,mongoPass
        dbName=dbParams.mongoDbName;
        var hostName = dbParams.mongoHost|| "localhost";
        var port = dbParams.mongoPort|| "27017";
        
        dbUrl = "mongodb://";
        var mongoUser = dbParams.mongoUser;
        var mongoPass = dbParams.mongoPass;
        if (mongoUser && mongoPass) {
            dbUrl += mongoUser + ':' + mongoPass + '@';
          }

        dbUrl += hostName+ ":" + port +"/" + dbName ;

    }

    db.getDb = function (next) {
        if (!theDb) {
            /// Database instance is not created
            client.connect(dbUrl, function (err, db) {
                if (err) {
                    ///Database connection error
                    next(err, null);
                } else {
                    //var dbins = db.db('rg-todolist');
                    var dbins = db.db(dbName);
                    theDb = {
                        db: dbins,
                        apartment: dbins.collection("apartment"),
                        
                    }
                    next(null, theDb);
                }
            })
        }
        else {
            next(null, theDb);
        }
    }

})(module.exports)