const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

const Op = Sequelize.Op;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });


  
  
// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);
// ROUTE HANDLER
function getFilmRecommendations(req, res) {
	var film_id = req.params.id 
	res.status(500).send('Not Implemented');

	// Request film reviews based on film_id passed by API GET query
	request("http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=" + film_id, function(error, response, body) {
		var apiRes = JSON.parse(body)[0];	
		var avg;
		var sum = 0;
		for (var i = 0; i < apiRes.reviews.length; i++) {
			sum += (apiRes.reviews[i].rating);
		}; 
		avg = sum/(apiRes.reviews.length);
		console.log(avg);
		console.log(apiRes.reviews);
		// get reviews by film id, if rating > 4 then goes on in the filtering process
	});
}
// First get all films with the same genre
// Check release date of the film, makes sure it's within 15 years, before or after the film 
// then those with minimum of 5 reviews
// then only those that are greater than 4 stars average rating
// sort based on id
// do offset by pagination - still gotta figure out what that means exactly 
// maybe that we have a limit of how many results are returned and paginate them based
// on developers criteria
// figure out how to process missing routes and client/server failure



module.exports = app;

// Sequelize model definitions
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




var film_id = 7264;
	connection.sync().then( function () {
		Films.findById(film_id).then( function (films) {
			var film_genre = (films.genre_id);
			console.log(films.genre_id);
			Films.findAll({
				where: {
					genre_id: film_genre

				       }	
			}).then( function ( films ) {
			console.log("Number of records with genre 19:" + films.length);
			});
		});
		

		Genres.findAll().then( function ( genres ) {
		console.log("Number of records in genre table:" + genres.length);
		});
		Artist_films.findAll().then( function ( artist_films ) {
		console.log("Number of records in genre table:" + artist_films.length);
		});
		Artists.findAll().then( function ( artists ) {
		console.log("Number of records in genre table:" + artists.length);
		}).catch(function(error){
		  console.log(error);
		});
	});
