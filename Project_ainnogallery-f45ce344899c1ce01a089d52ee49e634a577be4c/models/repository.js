/*var EventEmitter = require('events').EventEmitter;
var db_conn = require('../config/db_conf').db_conn;

// var mysql = require('mysql'),
var DATABASE = 'ainnogallery',
	USER_TABLE = 'umysqlser',
	EXHIBITION_TABLE = 'exhibition',
	WORKS_TABLE = 'works';
//     connection = mysql.createConnection({
// 		host: 'localhost',
// 		user: 'root',
// 		password: 'anm30925',
// 		database: 'ainnogallery',
// 		multipleStatements: true
// 	})
////////////////////////////////////////////////=======

var mysql = require('mysql'),
	DATABASE = 'ainnogallery',
	USER_TABLE = 'user',
	EXHIBITION_TABLE = 'exhibition',
	WORKS_TABLE = 'works';

var db_conn = mysql.createConnection({//client.createConnection({
	host: 'aurumplanet-vega.iptime.org',
	user: 'ainnogallery',
	password: 'vmffosltainnogallery',
	database: 'ainnogallery',
	multipleStatements: true
});

var connection = db_conn; /*mysql.createConnection({
		host: 'localhost',
		user: 'hyogu',
		password: '123456',
		database: 'ainnogallery'
	});*/

//>>>>>>> alpha1-hyogu
// connection.connect();
/*var mysqlUtil = module.exports = {
	insertUser: function(user, ip, res) {
		connection.connect(function (err) {
			if (err) throw err;
		});
		connection.query(
			'INSERT INTO ' + USER_TABLE + ' SET username = ?, email = ?, password = ?, url = ?, profilephoto = ?, shares = ?, reg_ip = ?',
			[user.username, user.email, user.password, user.url, user.profilephoto,	user.shares, ip],
			function (err) {
				if (err) throw err;
			}
		);
		connection.end();
	},
	loadWorksInExhibition: function() {
		// connection.connect(function (err) {
		// 	if (err) throw err;
		// });
		connection = db_conn;

		var evt = new EventEmitter();

		connection.query(
			'SELECT works_custom_info FROM ' + EXHIBITION_TABLE + ' WHERE idx = ?',
			[4],
			function (err, results, fields) {
				if (err) throw err;
				
				evt.emit('end', err, results);

				console.log('repository.js : loadworks');
			}
		);
		connection.end();
		return evt;
	},
	insertWorks: function(works, useridx, ip, res) {
		connection = db_conn;
		console.log(works);
		for (var i in works) {
			console.log(works[i]);
			connection.query(
				'INSERT INTO ' + WORKS_TABLE + ' SET user_idx = ?, width = ?, height = ?, title = ?, description = ?, depth = ?, material = ?, keywords = ?, price = ?, share_count = ?, reg_ip= ?',
				[useridx, works[i].width, works[i].height, works[i].title, 'description!', 999, 'material!', 'keyword!', 999, 999, 'ipip'],
				function (err) {
					if (err) throw err;
				}
			);
		}
		connection.end();
	},
	loadWorks: function() {
		connection = db_conn;

		var evt = new EventEmitter();

		connection.query(
			'SELECT title, width, height FROM ' + WORKS_TABLE + ' WHERE user_idx = ?',
			[1],
			function (err, results, fields) {
				if (err) throw err;
				
				evt.emit('end', err, results);

				console.log('repository.js : loadworks');
			}
		);
		connection.end();
		return evt;
	}
}*/