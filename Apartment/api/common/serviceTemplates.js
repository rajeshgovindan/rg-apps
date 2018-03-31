(function (template) {
    var database = require("../data/database");
    template.dbConHandler = function (func) {
        if (database.getDb(function (err, db) {
            if (err) {
                ///Data connection error
                console.log("Error in connecting the database " + err);

            } else {
                func(db);
            }
        }));  

    }


})(module.exports)

