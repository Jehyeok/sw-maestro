var environment = require('../config/environment');
var common = require('../lib/common');
var hash = require('../lib/hash');
var db_conn = require('../config/db_config').db_conn;
var EventEmitter = require('events').EventEmitter;
// var check = require('validator').check,
//     sanitize = require('validator').sanitize;
// var Validator = require('validator').Validator;
var crypto = require('crypto');
// var querystring = require('querystring');
var inspect = require('util').inspect;

// 
exports.index = function(req, res) {
	console.log("start controller pageWorkDetail");
	req.session.user_hash = 'a87d3107bb0167e960465a0dcf691879c6ec1992';
	console.log('req.session.user_hash in exports.index = ' + req.session.user_hash);
	/* Data from request */
	var user_url = req.params.user_url;
	var exhibition_url = req.params.exhibition_url || null;
	var work_url = req.params.work_url;
	var call_where;
	if (exhibition_url === null) call_where = 'works';
	else call_where = 'exhibition';

	/* Data from Database */
	var evt = new EventEmitter();
	var model_work_detail = require('../models/work_detail.js');
	var params = {
					work_url: work_url,
					user_url: user_url
					};
	model_work_detail.getWorkHashAndTitleByUrl(evt, db_conn, params);
	evt.on('result', function(rst) {
		console.log("model_work_detail - evt.on('result')");
		rst.on('row', function(row) {
			console.log("model_work_detail - evt.on('result').on('row')");
			var work_title = row.work_title;
			var work_hash = row.work_hash;

			var arguments = {
						title: work_title + " - AinnoGallery :: 아이노갤러리",
						work_hash: work_hash,
						call_where: call_where,
						user_url: user_url
						};
			console.log("arguments = " + inspect(arguments));

			res.render('work_detail/index', arguments);
		})
		.on('error', function(err) {
			console.log("model_work_detail - evt.on('result').on('error')");
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log("model_work_detail - evt.on('result').on('info')");
			console.log(inspect(info));
		});
	});
};

// 작품 상세보기 - 작품 상세보기 정보 가져오기
exports.getWorkDetail = function(req, res) {
	var result = {};

	var evt = new EventEmitter();
	var model_work_detail = require('../models/work_detail.js');
	var work_hash = req.query.work_hash;
	var params = {
					work_hash: work_hash
					};
	model_work_detail.getWorkDetail(evt, db_conn, params);
	evt.on('result', function(rst) {
		rst.on('row', function(row) {
			result = row;
			console.log(result);
			res.json(result);
		})
	});
};

// 작품 상세보기 - 작품 상세보기 창 소스 가져오기
exports.getSourceWorkDetailWindow = function(req, res) {
	res.render('work_detail/window_source', {});
};

// 작품 상세보기 - 댓글 등록하기
exports.registerReply = function(req, res) {
	var result = {};

	/* Data from request */
	var reg_ip = req.ip;
	var reg_date = common.getDateTimeForDBFromDate(new Date());
	var user_hash = req.session.user_hash || 'a87d3107bb0167e960465a0dcf691879c6ec1992'; //null;	// TODO: 이거 null로 바꿔야함
		console.log("var user_hash = " + user_hash);
		console.log("req.session.user_hash in exports.registerReply = " + req.session.user_hash);
	var exhibition_hash = req.body.exhibition_hash;
	var work_hash = req.body.work_hash;
	var comment = req.body.comment;
	var work_reply_hash = hash.makeWorkReplyHashByWorkHash(work_hash, reg_date);

	/* Data from Database */
	var evt = new EventEmitter();
	var model_work_detail = require('../models/work_detail.js');
	var params = {
					work_reply_hash: work_reply_hash,
					work_hash: work_hash,
					exhibition_hash: exhibition_hash,
					user_hash: user_hash,
					comment: comment,
					reg_ip: reg_ip,
					reg_date: reg_date
					};
	model_work_detail.registerReply(evt, db_conn, params);
	evt.on('result', function(rst) {
		rst.on('row', function(row) {
			console.log('<row>');
			console.log(row);
			console.log('</row>');
		})
		.on('end', function(info) {
			result.status = 'registered';
			res.json(result);
		});
	});
};

// 작품 상세보기 - 댓글 가져오기
exports.getReplyList = function(req, res) {
	var result = { items: [] };

	/* Data from body */
	var work_hash = req.body.work_hash;
	var loaded_count = req.body.loaded_count;
	var need_count = req.body.need_count;
	var sort_type = req.body.sort_type;

	/* Data from Database */
	var evt = new EventEmitter();
	var model_work_detail = require('../models/work_detail.js');
	var params = {
					work_hash: work_hash,
					loaded_count: loaded_count,
					need_count: need_count,
					sort_type: sort_type
					};
	model_work_detail.getRepliesOrderByTime(evt, db_conn, params);
	evt.on('result', function(rst) {
		console.log('<result>');
		console.log(result);
		console.log('</result>');
		rst.on('row', function(row) {
			console.log('[!] 새 row를 배열에 넣는다 : ' + inspect(row));
			result.items.push(row);			
		})
		.on('end', function(info) {
			/*
			서버에서 보내야 함
				{
					status: 'success',
					all_count: N,	// 해당 작품에 달린 총 댓글 수
					count: N,	// 서버에서 막 가져온 댓글 수
					is_more: true,	// 더 불러올 댓글이 있는지 여부
					items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_profile_photo}, ...]	// 서버에서 막 가져온 댓글들
				}
			*/
			result.status = 'success';
			result.count = info.numRows;
			result.is_more = (info.numRows > 0) ? false : true;
			res.json(result);
		});
	});
};

// 작품 상세보기 - 댓글 수정하기
exports.modifyReply = function(req, res) {

};

// 작품 상세보기 - 댓글 삭제하기
exports.removeReply = function(req, res) {
	var result = {};

	var evt = new EventEmitter();
	var model_work_detail = require('../models/work_detail.js');
	/* DB에 남겨줄 params 생성 시작 */
	var hash = req.body.hash;
	var deleted_date = common.getDateTimeForDBFromDate();
	var params = {
					deleted_date: deleted_date,
					hash: hash
					};
	/* DB에 남겨줄 params 생성 끝 */

	model_work_detail.removeReply(evt, db_conn, params);
	evt.on('result', function(rst) {
		result.status = 'removed';
		res.json(result);
	})
	.on('error', function(err) {
		result.status = 'error';
		console.log('[E] 오류났다 : ' + inspect(err));
		res.json(result);
	});
};

// 작품 상세보기 - 댓글 추천 적하기
exports.applyVoteReply = function(req, res) {
	
};

// 작품 상세보기 - 댓글 추천 취소하기
exports.cancelVoteReply = function(req, res) {

};