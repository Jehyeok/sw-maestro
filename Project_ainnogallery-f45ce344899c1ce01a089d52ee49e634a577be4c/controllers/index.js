var db_conn = require('../config/db_config.js').db_conn;
var EventEmitter = require('events').EventEmitter;
var inspect = require('util').inspect;
var environment = require('../config/environment.js');
var crypto = require('crypto');

exports.index = function(req, res){
	res.render('index/index', { title: 'Ainnogallery' });

};

exports.join = function(req, res) {
	repo.insertUser(req.body, req.connection.remoteAddress, res);
}

// 인기
exports.loadHighlights = function(req, res) {

}

// 전시 목록 불러오기
exports.loadExhibitions = function(req, res) {

}

// 작가 불러오기
exports.loadArtists = function(req, res) {
	var evt = new EventEmitter();
	var model_index = require('../models/index.js');
	var params = {};
	var errors = {};
	var outputs = [];

	model_index.getArtistList(evt, db_conn, params);
	evt.on('result', function(res){
		res.on('row', function(row){
			if(typeof(row) == 'undefined'){
				errors = {row: "failed", msg:"아티스트 정보를 불러올 수 없습니다. (500)"}
			}
			else {
				var output = {
					user_url: '',
					user_name: '',
					user_profilePhoto: '',
					exhibition_url: '',
					exhibition_title: '',
					exhibition_schedule_start: '',
					exhibition_schedule_end: '',
					exhibition_image: ''
				};
				output.user_url = row.user_url;
				output.user_name = row.user_name;
				output.user_profilePhoto = row.user_profilePhoto;
				if(row.exhibition_url == null) {
					output.exhibition_title = 'Coming Soon';
				}
				else {
					output.exhibition_title = row.exhibition_title;
					output.exhibition_schedule_start = row.exhibition_schedule_start;
					output.exhibition_schedule_end = row.exhibition_schedule_end;
					output.exhibition_image = row.exhibition_image;
					output.exhibition_url = row.exhibition_url;
				}
				outputs.push(output);
			}
		}).on('error', function(err){
			console.log(inspect(err));
		}).on('info', function(info){
			console.log(insepct(info));
		});
	});
	evt.on('end', function(){
		console.log("DB Connection Fin");
		res.json(outputs);
	})
}