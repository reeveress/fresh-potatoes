const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express(),
      moment = require('moment');

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;


const msecIn15Years = 15 * 3.154e7 * 1000;

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
	},
	//reviews_num: {
	//			type:Sequelize.INTEGER	     
	//},
	//rating: {
	//			type:Sequelize.INTEGER	
	//}
	},
	{
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






//connection.sync().then( function (){
//	Films.findAll().then( function( films ) {
//		console.log("ID of first film element:");
//		console.log(films[0].id);		
//		console.log(typeof(films[0].id));		
//		for (var i = 0; i < films.length; i++){
//			// Request film reviews based on film_id passed by API GET query
//			request("http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=" + films.id, function(error, response, body) {
//				var apiRes = JSON.parse(body)[0];	
//				var avg;
//				var sum = 0;
//				for (var i = 0; i < apiRes.reviews.length; i++) {
//					sum += (apiRes.reviews[i].rating);
//				}; 
//				reviews_num = apiRes.reviews.length;
//				avg = sum/(apiRes.reviews.length);
//				console.log(avg);
//				console.log(apiRes.reviews);
//				// get reviews by film id, if rating > 4 then goes on in the filtering process
//				Films.create({
//					reviews_num: reviews_num, 
//					rating: avg
//				
//				});
//			});
//			
//		
//		};
//			
//	});
//});



var film_id = 7264;

connection.sync().then( function () {
	Films.findById(film_id).then( function (films) {
		const Op = Sequelize.Op;
		var film_genre = (films.genre_id);
		console.log((films.release_date));
		film_date = (Date.parse(films.release_date));
		console.log(Sequelize.NOW);
			
		Films.findAll({
			where: {
				genre_id: film_genre,
				release_date: {
				[Op.gte]: moment(film_date).subtract(15, 'years').toDate(),
				[Op.lte]: moment(film_date).add(15, 'years').toDate()
				}
			       }	
		}).then( function ( films ) {
			
			for (var i = 0; i < films.length; i++){
				// Request film reviews based on film_id passed by API GET query
				
				request("http://credentials-api.generalassemb.ly/4576f55f-c427-4cfc-a11c-5bfe914ca6c1?films=" + films[i].id, function(error, response, body) {
					var queryRes = {};
					var apiRes = JSON.parse(body)[0];	
					var avg;
					var sum = 0;
					for (var i = 0; i < apiRes.reviews.length; i++) {
						sum += (apiRes.reviews[i].rating);
					}; 
					var reviews_num = apiRes.reviews.length;
					avg = sum/(apiRes.reviews.length);
					console.log(`Average for ${films[i].id} is ${avg}`);
					if (reviews_num >= 5 && avg >= 4){
						queryRes[i] = {
							"id": films[i].id,
							"title": films[i].title,
							"releaseDate": films[i].release_date,
							"averageRating": avg,
							"reviews": reviews_num		
						};
					};
					console.log(queryRes);
				});
			}
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
