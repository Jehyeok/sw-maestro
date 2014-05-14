/*
	controllers/exhibition.js

	일반 사용자 페이지 또는 작가 페이지와 관련된 컨트롤러
*/
var db_conn = require('../config/db_config.js').db_conn;
var EventEmitter = require('events').EventEmitter;
var inspect = require('util').inspect;
var environment = require('../config/environment.js');
var crypto = require('crypto');

// 전시 페이지 - 전시 커버부터
exports.index = function(req, res) {
	// length = 3; // 작품 개수. 나중에 DB에서 동적으로 받아옴
	// fileName = new Array();
	// console.log(typeof(fileName));
	// fileName.push('work_01', 'work_02', 'work_03', 'work_04', 'work_05', 'work_06'
	// 	,'work_07', 'work_08', 'work_09', 'work_10', 'work_11', 'work_12', 'work_13'
	// 	,'work_14', 'work_15', 'work_16', 'work_17', 'work_18', 'work_19', 'work_20'
	// 	,'work_21', 'work_22', 'work_23', 'work_24', 'work_25');
	// fileName = JSON.stringify(fileName);
	// var loadResult = repo.loadWorksInExhibition();

	var exhibition_url = req.params.exhibition_url;
	var user_url = req.params.user_url;
	var evt = new EventEmitter();
	var errors = {};
	var params = {exhibition_url: exhibition_url,
					user_url: user_url};
	var exhibition_works = require('../models/exhibition_works'); 
	var work_idx = [];
	console.log('contollers > index');
	console.log('req.params: ' + inspect(req.params));
	console.log("contollers.exhibion > exhibition_url: " + exhibition_url);

	// loadResult.on('end', function(err, results) {
		
	// 	var workArray = results[0].work_custom_info.split(',');
	// 	fileName = new Array();
	// 	// eval은 보안상의 문제로 쓰지 않는다.
	// 	// console.log(eval("("+workArray[0]+")").work);

	// 	// JSON.parse : string -> json. 보안상의 문제는 없지만 정확한 문법을 따라야 한다. {"work" : "1"}
	// 	fileName.push('work_0'+JSON.parse(workArray[0]).work);
	// 	fileName.push('work_0'+JSON.parse(workArray[1]).work);
	// 	fileName.push('work_0'+JSON.parse(workArray[2]).work);

	// 	fileName = JSON.stringify(fileName);
		
	// 	res.render('show', { length: 25,
	// 						 fileName: fileName,
	// 						 reply: '92'
	// 						});
	// });
	
	var getExhibitionWorksResult = exhibition_works.getExhibitionWorks(evt, db_conn, params);
	getExhibitionWorksResult.on('result', function(result) {
		// console.log("res: " + inspect(res));
		result.on('row', function(row) {
			console.log('Result row: ' + inspect(row));
			work_idx.push(row.work_idx);
			// console.log('work_idx: ' + work_idx);
		})
		.on('error', function(err) {
			console.log('Result error: ' + inspect(err));
		})
		.on('end', function(info) {
			console.log('work_idx.length: ' + work_idx.length);
			var length = work_idx.length;
			work_idx = JSON.stringify(work_idx);
			console.log('work_idx: ' + work_idx);

			res.render('show', { length: length,
							 exhibition_url: exhibition_url,
							 work_idx: work_idx,
							 // reply 개수는 나중에 동적으로 서버에서 받아
							 reply: '92'
							});
			console.log('Result finished successfully');
		})
	})
	.on('end', function() {
		console.log('Done with all results')
	})
};

// 전시 페이지 - 작품 상세보기
exports.work = function(req, res) {
	var user_url = req.params.user_url;
	var exhibition = req.params.exhibition;
	var work = req.params.work;

	var arguments = {
						title: "AinnoGallery",
						user_url: user_url,
						exhibition: exhibition,
						work: work
					};

	res.render('exhibition/work', arguments);
};