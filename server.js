//  OpenShift sample Node application
var express = require('express'),
  app = express(),
 
  morgan = require('morgan'),
  bodyParser = require('body-parser');

Object.assign = require('object-assign')
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
  mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
    mongoPassword = process.env[mongoServiceName + '_PASSWORD']
  mongoUser = process.env[mongoServiceName + '_USER'];




  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    //mongoURLLabel = mongoURL;

  }
}
else {
  // Local database connection
  var mongoHost = "localhost";
  var mongoPort = "27017";
  var mongoDatabase = "rgappdb";
  var mongoURLLabel = mongoURL = 'mongodb://';
  var mongoUser = "";
  var mongoPassword = ""
  // Provide UI label that excludes user id and pw
  mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
  //mongoURLLabel = mongoURL;

}

//mongodb://user2SC:BGim3fx4BHindyH3@172.30.76.145:27017/sampledb
//mongoUser="rajesh";

var initParams = {
  db: {
    "mongoHost": mongoHost,
    "mongoPort": mongoPort,
    "mongoDbName": mongoDatabase,
    "mongoUser": mongoUser,
    "mongoPass": mongoPassword
  }
}

//mongoURLLabel += "\n db:" + initParams.db.mongoUser + ":" + initParams.db.mongoPass;
var apartment = require('./Apartment');
apartment.init(app, initParams);


var db = null,
  dbDetails = new Object();

var initDb = function (callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function (err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.

  
    dbDetails.url += "\n" + req.headers.host;
  if (!db) {
    initDb(function (err) { });
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ ip: req.ip, date: Date.now() });
    col.count(function (err, count) {
      if (err) {
        console.log('Error running count. Message:\n' + err);
      }
      res.render('index.html', { pageCountMessage: count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage: null });
  }
});

var fs = require("fs");
app.get("*.css", function (req, res) {
  var cssFilePath = __dirname + req.url;
  //var cssFilePath = __dirname + "/apartment/static/collections.css";
  fs.readFile(cssFilePath, function (err, data) {
    res.writeHead(200, { "Content-Type": "text/css" });
    res.write(data);
    res.end();
  })
});
app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function (err) { });
  }
  if (db) {
    db.collection('counts').count(function (err, count) {
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});



// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function (err) {
  console.log('Error connecting to Mongo. Message:\n' + err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);


module.exports = app;

