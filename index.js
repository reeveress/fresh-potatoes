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

var Films = connection.define('films', {
	id : {
				type: Sequelize.INTEGER,
				primaryKey:true
	},
    	title: {
				type: Sequelize.STRING
	},
    	release_date: {
				type : Sequelize.STRING
	},
    	tagline: {
				type: Sequelize.TEXT 
	},
    	revenue: {
				type:Sequelize.INTEGER
	},
    	budget: {
				type: Sequelize.INTEGER
	},
    	runtime: {
				type:Sequelize.INTEGER
	},	
	original_language: {
				type: Sequelize.STRING
	},
	status: {
				type: Sequelize.STRING
	},
	genre_id: {
				type:Sequelize.INTEGER
	}
	},{
				timestamps: false,
				freezeTableName: true
	}
);

var Artist_films = connection.define('artist_films', {
	id: {
			type: Sequelize.INTEGER,
			primaryKey:true
	},
	credit_type: {
		     	type: Sequelize.STRING
	},
	role: {
			type: Sequelize.STRING
	},
    	description: {
		     	type: Sequelize.STRING
	},
	artist_id: {
		   	type: Sequelize.INTEGER
	},
    	film_id: {
		 	type: Sequelize.INTEGER
	}
	},{
			timestamps: false,
			freezeTableName: true
	}	
);

var Artists = connection.define('artists', {
	id: {
			type: Sequelize.INTEGER,
			primaryKey:true
	},
	name: {
		     	type: Sequelize.STRING
	},
	birthday: {
			type: Sequelize.STRING
	},
    	deathday: {
		     	type: Sequelize.STRING
	},
	gender: {
		   	type: Sequelize.INTEGER
	},
    	place_of_birth: {
		 	type: Sequelize.STRING
	}
	},{
			timestamps: false,
			freezeTableName: true
	}	
);




connection.sync().then( function () {
	Genres.findAll().then( function ( genres ) {
	console.log("Number of records in genre talbe:" + genres.length);
	});
	
	Films.findAll().then( function ( films ) {
	console.log("Number of records in genre talbe:" + films.length);
	});
	Artist_films.findAll().then( function ( artist_films ) {
	console.log("Number of records in genre talbe:" + artist_films.length);
	});
	Artists.findAll().then( function ( artists ) {
	console.log("Number of records in genre talbe:" + artists.length);
	});
});


