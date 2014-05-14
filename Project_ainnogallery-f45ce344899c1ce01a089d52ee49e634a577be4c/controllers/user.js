/*
	controllers/user.js

	일반 사용자 페이지 또는 작가 페이지와 관련된 컨트롤러
*/
var db_conn = require('../config/db_config.js').db_conn;
var EventEmitter = require('events').EventEmitter;
var inspect = require('util').inspect;
var environment = require('../config/environment.js');
var crypto = require('crypto');
var common = require('../lib/common');
var hash = require('../lib/hash');

// 작가 페이지 - 초기 화면
exports.index = function(req, res){
	//Data From Parameter
	var user_url = req.params.user_url;
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var params = {user_url: user_url};
	var output = {};
	model_exhibition.getUserHash(evt, db_conn, params);

	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			console.log("Exhibition Main Page Load");
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"전시관 리스트 호출 실패."};
			}
			else
			{
				var user_hash = row.user_hash;
				output = {user_hash: user_hash}
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});
	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(output));
        res.render('user/index', output);
	});
};

// 작가 페이지 - 작품 목록 - 스크롤 내릴 때 작품 추가 로딩
exports.loadAdditionalWorks = function(req, res) {
	console.log('load additional works!');
	console.log(req.body);
	console.log(req.body.currentLoadedWorkIdx);
	console.log(req.body.testId);
	res.send("hohoho");

}

// 작가 페이지 - 작품 목록
exports.works = function(req, res){
    console.log("user.works called");
    console.log("req.body: " + inspect(req.body));
    console.log("req.params: " + inspect(req.params));
    
    var user_url = req.params.user_url

    var evt = new EventEmitter();
    var errors = {};
    var params = {user_url: user_url};
    var user = require('../models/user'); 

    var work_idx = [];
    var work_width_height_ratio = [];
    var work_hash = [];

    user.getUserWorks(evt, db_conn, params);
    evt
    .on('result', function(result) {
        result.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
            work_idx.push(row.idx);
            work_width_height_ratio.push(row.width_height_ratio);
            work_hash.push(row.hash);
        })
        .on('error', function(err) {
            console.log('Result error: ' + inspect(err));
        })
        .on('end', function(info) {
            // console.log('work_idx.length: ' + work_idx.length);
            var length = work_idx.length;
            work_idx = JSON.stringify(work_idx);
            work_hash = JSON.stringify(work_hash);
            work_width_height_ratio = JSON.stringify(work_width_height_ratio);
            // console.log('work_idx: ' + work_idx);

            res.render('works', { length: length,
                                 work_idx: work_idx,
                                 work_width_height_ratio: work_width_height_ratio,
                                 work_hash: work_hash
                                });
            console.log('Result finished successfully');
        })
    });
};

// 작가 페이지 - 프로필
exports.profile = function(req, res){
	var user_hash = req.body.user_hash;

	//Data From Body
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = {user_hash: user_hash};
	model_exhibition.exhibitionMainProfile(evt, db_conn, params);
	var output = {
		name: '',
		profile_photo: '',
		user_url: ''
	};
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			console.log("Profile Data Load");
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"전시관 리스트 호출 실패."};
			}
			else{
				output.name = row.user_name;
				output.profile_photo = row.user_profile_photo;
				output.user_url = row.user_url;
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});
	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(output));
        res.json(output);
	});
};

exports.profileSourceLoad = function(req, res){
	res.render('user/profile', {});
};

exports.banner = function(req, res){
	var user_hash = req.body.user_hash;

	//Data From Body
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = {user_hash: user_hash}
	var outputs = [];

	model_exhibition.exhibitionMainBanner(evt, db_conn, params);
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"배너, 분석, 방명록, 댓글 리스트 호출 실패."};
			}
			else{
				var output = {
					title: '',
					subtitle: '',
					link: '',
					banner_image: '',
					banner_idx: 0
				};
				console.log("Banner : " + row);
				output.banner_image = row.user_banner_image;
				output.title = row.user_banner_title;
				output.subtitle = row.user_banner_subtitle;
				output.link = row.user_banner_link;
				output.banner_idx = row.user_banner_idx;
				outputs.push(output);
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});

	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(outputs));
        res.json(outputs);
	});
}

exports.bannerRegister = function(req, res){
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = req.body.params;
	for(var i=0; i<params.length; i++){
		params[i].reg_ip = req.ip;
		params[i].reg_date = common.getDateTimeForDBFromDate(new Date());
		model_exhibition.exhibitionMainBannerRegister(evt, db_conn, params[i]);
		evt
		.on('result', function(res) {
			res
			.on('row', function(row) {
				if(typeof(row) == "undefined"){
					errors = {row: "failed", msg:"배너, 분석, 방명록, 댓글 리스트 호출 실패."};
				}
				else{
					console.log("Success to insert Banner!");
				}
			})
			.on('error', function(err) {
				console.log(inspect(err));
			})
			.on('info', function(info) {
				console.log(inspect(info));
			});
		});

		evt
		.on('end', function(){
	        console.log("DB Connection Fin");
	        res.send("success");
		});
	}
}

exports.comment = function(req, res){
	var user_hash = req.body.user_hash;

	//Data From Body
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = {user_hash: user_hash}
	var outputs = [];
	model_exhibition.exhibitionMainComment(evt, db_conn, params);
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"배너, 분석, 방명록, 댓글 리스트 호출 실패."};
			}
			else{
				var output = {
					comment: '',
					reg_date: '',
					exhibition_title: '',
					work_title: ''
				};
				output.comment = row.user_comment;
				output.reg_date = row.user_reg_date;
				output.exhibition_title = row.user_exhibition_title;
				output.work_title = row.user_work_title;
				outputs.push(output);
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});

	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(outputs));
        res.json(outputs);
	});
}

exports.analytics = function(req, res){
	var user_hash = req.body.user_hash;

	//Data From Body
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = {user_hash: user_hash}
	var output = {
		total_artwork: 0,
		total_exhibition: 0,
		total_view: 0
	};

	model_exhibition.exhibitionMainAnalytics(evt, db_conn, params);
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"배너, 분석, 방명록, 댓글 리스트 호출 실패."};
			}
			else{
				console.log("Analytics : " + row);
				output.total_view = row.user_total_view;
				output.total_artwork = row.user_total_artwork;
				output.total_exhibition = row.user_total_exhibition;
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});
	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(output));
        res.json(output);
	});
}

exports.guestbook = function(req, res){
	var user_hash = req.body.user_hash;

	//Data From Body
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = {user_hash: user_hash}
	var outputs = [];

	model_exhibition.exhibitionMainGuestbook(evt, db_conn, params);
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"배너, 분석, 방명록, 댓글 리스트 호출 실패."};
			}
			else{
				var output = {
					guest_name: '',
					reg_date: '',
					comment: ''
				};
				console.log("Guestbook : " + row);
				output.comment = row.user_comment;
				output.guest_name = row.user_guest_name;
				output.reg_date = row.user_reg_date;
				outputs.push(output);
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});

	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(outputs));
        res.json(outputs);
	});
}
exports.guestbookRegister = function(req, res){
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = req.body.params;
	params[0].reg_ip = req.ip;
	params[0].reg_date = common.getDateTimeForDBFromDate(new Date());
	model_exhibition.exhibitionMainGuestbookRegister(evt, db_conn, params[0]);
	var output = {};
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			console.log(inspect(row));
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"배너, 분석, 방명록, 댓글 리스트 호출 실패."};
			}
			else{
				output.state = "success",
				output.reg_date = common.getDateTimeForDBFromDate(new Date())
				output.guest_name = row.user_guest_name;
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});

	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(output);
        res.json(output);
	});
}

exports.utilitySourceLoad = function(req, res){
	res.render('user/utility', {});
}

exports.exhibition = function(req, res){
	var user_hash = req.body.user_hash;

	//Data From Body
	var evt = new EventEmitter();
	var model_exhibition = require('../models/exhibition.js');
	var errors = {};
	var params = {user_hash: user_hash}
	var i=0;
	model_exhibition.exhibitionMainList(evt, db_conn, params);
	var outputs = [];
	evt
	.on('result', function(res) {
		res
		.on('row', function(row) {
			if(typeof(row) == "undefined"){
				errors = {row: "failed", msg:"전시관 리스트 호출 실패."};
			}
			else{
				var output = {
					exhibit: '',
					title: '',
					schedule_start: '',
					schedule_end: '',
					works_count: '',
					exhibition_url: '',
					user_url: ''
				};
				console.log("exhibition : " + row);
				output.title = row.exhibition_title;
				output.schedule_start = row.exhibition_schedule_start;
				output.schedule_end = row.exhibition_schedule_end;
				output.exhibit = row.exhibition_cover_image;
				output.works_count = row.exhibition_work_len;
				output.exhibition_url = row.exhibition_url;
				output.user_url = row.exhibition_user_url;
				outputs.push(output);
			}
		})
		.on('error', function(err) {
			console.log(inspect(err));
		})
		.on('info', function(info) {
			console.log(inspect(info));
		});
	});
	evt
	.on('end', function(){
        console.log("DB Connection Fin");
        console.log(inspect(outputs));
        res.json(outputs);
	});
}

exports.exhibitionSourceLoad = function(req, res){
	res.render('user/exhibition', {});
}

// 작품 목록 페이지에서 작품 추가
exports.insertWork = function(req, res) {
	// console.log('req.files: ' + inspect(req.files));
	console.log('req.body: ' + inspect(req.body));
	console.log('req.params: ' + inspect(req.params));
	var formData = req.body;
	var fs = require('fs');
	// var dstPath = '/Users/jehyeok/Documents/Project_ainnogallery-alpha1-Demo2/Project_ainnogallery-alpha1-Demo2/statics/temp/';
	var dstPath = __dirname + '/../statics/temp/';
	// console.log('req.files: ' + inspect(req.files));
	// var fileName = req.files.work_file.originalFilename;
	var fileName = hash.makeWorkHashByTitle(formData.title);
	// console.log('req.files: ' + inspect(req.files));
	// console.log('dstPath: ' + dstPath);
	// console.log('fileName: ' + fileName);

	fs.readFile(req.files.work_file.path, function(err, data) {
		if (err) {
			console.log('READFILE ERROR: ' + err);
		} else {
			fs.writeFile(dstPath + fileName, data, function(err) {
				if (err) {
					res.send('err');
				} else {
					var model_user = require('../models/user.js');
					var evt = new EventEmitter();
					var errors = {};
					// 작품 타이틀
					var title = formData.title;
					// 작품 재료
					var material = formData.material;
					// 작품 만든 날짜
					var production_date = formData.production_date;
					// 태그
					var tags = formData.tags;
					// 00X00cm 에서 가로, 세로 길이 계싼
					var size = formData.size.split(/x/i);
					var width = size[0].trim();
					var height = 0;
					console.log('size: ' + size);
					console.log('size[1]: ' + size[1]);

					if (size[1].search(/cm/i)) {
						height = size[1].replace(/cm/i, '').trim();
					}
					// 작품 픽셀
					var pixel_width = formData.pixel_width;
					var pixel_height = formData.pixel_height;
					// 작품 비율
					var width_height_ratio = pixel_height / pixel_width;
					// 작품 해쉬
					var hash = require('../lib/hash');
					console.log('hash: ' + hash);
					var hash = hash.makeWorkHashByTitle(title);
					// 아티스트
					var artist = req.params.user_url;
					// url
					var url = req.params.user_url;

					// 클라이언트 IP
					var reg_ip = req.ip;
					console.log('reg_ip: ' + req.ip);
					// 등록 날짜
					var reg_date = common.getDateTimeForDBFromDate(new Date());
					
					
					var params = {title: formData.title,
									production_date: formData.date,
									width: width,
									height: height,
									material: material,
									tags: tags,
									artist: artist,
									hash: hash,
									url: url,
									pixel_width: pixel_width,
									pixel_height: pixel_height,
									width_height_ratio: width_height_ratio,
									reg_date: reg_date,
									reg_ip: reg_ip
								};
					console.log('params: ' + inspect(params));

					var insertWorkResult = model_user.insertUserWork(evt, db_conn, params);
					insertWorkResult.on('result', function(result) {
				        result.on('row', function(row) {
				            console.log('Result row: ' + inspect(row));
				        })
				        .on('error', function(err) {
				            console.log('Result error: ' + inspect(err));
				        })
				        .on('end', function(info) {
				            console.log('Result finished successfully');
				            var data = JSON.stringify({fileName: fileName});
							res.send(data);
				        })
				    });					
				}
			});	
		}
	});
}

exports.newExhibition = function(req, res){
	res.render('user/exhibition_new');
}