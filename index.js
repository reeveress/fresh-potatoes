const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res) {
  res.status(500).send('Not Implemented');
}

module.exports = app;


var  connection = new Sequelize('database', 'null', 'null', {
	host: "localhost", //your server
	port: 3000, //server port
	dialect: 'sqlite',
	storage: './db/database.db'
	});

var Genres = connection.define('genres', {
	id : {
		type: Sequelize.INTEGER,
    		primaryKey: true
	     },

	name: {
		type: Sequelize.STRING,
	}},
    	{
		timestamps: false,
		freezeTableName: true
	}

	
);

connection.sync().then( function () {
	Genres.findAll().then( function ( genres ) {
	console.log("Number of records in a talbe:" + genres.length);
	
	});

});


