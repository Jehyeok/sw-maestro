var inspect = require('util').inspect;

/* 모델명 : getWorkHashAndTitleByUrl
   설명 : work_url과 user_url로 work_hash를 알아냄
   params = { user_url, work_url } */
exports.getWorkHashAndTitleByUrl = function(evt, db_conn, params) {
	console.log("start model_work_detail.getWorkHashAndTitleByUrl");
	// SELECT `hash` FROM `work` 
	// WHERE `idx` = `work`.`user_idx` AND `url` = 'work1' 
	// IN (SELECT `idx` FROM user WHERE `url` = 'test1url')
	var sql = "SELECT ";
			sql += "`A`.`hash` AS `work_hash`, ";
			sql += "`A`.`title` AS `work_title` ";
		sql += "FROM `work` AS `A` ";
		sql += "WHERE ";
			sql += "`idx` = `A`.`user_idx` AND ";
			sql += "`A`.`url` = ? ";
		sql += "IN (";
			sql += "SELECT `B`.`idx` ";
			sql += "FROM `user` AS `B` ";
			sql += "WHERE `B`.`url` = ? ";
		sql += ") ";
	var query = db_conn.query(sql, [
			params['work_url'],
			params['user_url'] ])
		.on('result', function(res) {
			evt.emit('result', res);
		});
	return sql;
};

/* 모델명 : getWorkDetail
   설명 : work_hash로 작품 디테일 다 알아냄
   params = { work_hash } */
exports.getWorkDetail = function(evt, db_conn, params) {
	var sql = "SELECT `title`, `artist`, `description`, `production_date`, `material`, `keywords`, `width`, `height`, `depth`, `size_unit`";
		sql += "FROM `work` ";
		sql += "WHERE `hash` = ? ";
	var query = db_conn.query(sql, [
			params['work_hash'] ])
		.on('result', function(res) {
			evt.emit('result', res);
		});
	return sql;
};

/* 모델명 : getRepliesByTime
   설명 : 시간순으로 댓글을 가져옴, index는 n번째
   params = { work_hash, index } */
exports.getRepliesOrderByTime = function(evt, db_conn, params) {
	//var index = params['index'];
	//var start_index = global.STATIC.REPLY_LIST_COUNT_AT_ONCE * index;
	//var count = global.STATIC.REPLY_LIST_COUNT_AT_ONCE;

	// TODO: params['sort_type']을 안 썼음
	console.log(params);
	var loaded_count = parseInt(params['loaded_count']);
	var need_count = parseInt(params['need_count']);

	var sql = "SELECT ";
			sql += "`A`.`hash` AS	 `hash`, ";
			sql += "`A`.`comment` AS	`comment`, ";
			sql += "`A`.`reg_date` AS	`post_time`, ";
			sql += "`A`.`vote_count` AS	`vote_count`, ";
			sql += "`C`.`hash` AS	`user_hash`, ";
			sql += "`C`.`name` AS	 `user_name`, ";
			sql += "`C`.`url` AS	 `user_url`, ";
			sql += "`C`.`profile_photo` AS	`user_profile_photo` "; // TODO: 사용자 사진 주소는 따로 파일명 해시 만들어내는 함수를 나중에 고안해서 컨트롤러에서 별도로 집어넣어야 함. 여기서 말고. 이거 업로드할 때 FILD MD5SUM을 이용하는 방안도 생각(중복 파일 업로드로 인한 용량 증가 대처)
		sql += "FROM `work_reply` AS `A` ";
		sql += "INNER JOIN `user` AS `C` ";
		sql += "ON `C`.`idx` = `A`.`user_idx` ";
		sql += "WHERE ";
			sql += "`A`.`status` = '0' AND ";
			sql += "`A`.`work_idx` = ";
				sql += "(SELECT `B`.`idx` ";
				sql += "FROM `work` AS `B` ";
				sql += "WHERE `B`.`hash`=:work_hash) ";
		sql += "ORDER BY `A`.`idx` DESC ";
		// TODO: 교체할지 고민 sql += "ORDER BY `A`.`reg_date` DESC ";
		sql += "LIMIT "+ loaded_count +","+ need_count;
	var query = db_conn.query(sql, {
			work_hash: params['work_hash'] })
		.on('result', function(res) {
			evt.emit('result', res);
		});
	return sql;
};

/* 모델명 : getWorkRepliesOrderByPopular
   설명 : 인기순으로 댓글을 가져옴, index는 n번째
   params = { work_hash, index } */
exports.getWorkRepliesOrderByPopular = function(evt, db_conn, params) {
	var index = params['index'];
	var start_index = global.STATIC.REPLY_LIST_COUNT_AT_ONCE * index;
	var count = global.STATIC.REPLY_LIST_COUNT_AT_ONCE;

	var sql = "SELECT ";
			sql += "`A`.`hash` AS		`work_reply_hash`, ";
			sql += "`A`.`user_hash` AS	`user_hash`, ";
			sql += "`A`.`reg_date` AS	`reg_date`, ";
			sql += "`A`.`comment` AS	`comment` ";
		sql += "FROM `work_reply` AS `A` ";
		sql += "WHERE ";
			sql += "`A`.`work_idx` = `B`.`idx` AND ";
			sql += "`A`.`status` = '0' ";	// TODO: 수정본도 고려
		sql += "ORDER BY `A`.`reg_date` DESC ";	// TODO: 인기순에 맞도록 바꿔야 함
		sql += "LIMIT ?,? ";
		sql += "IN (";
			sql += "SELECT `B`.`idx` ";
			sql += "FROM `work` AS `B` ";
			sql += "WHERE `B`.`hash` = '?'";
	sql += ") ";
	var query = db_conn.query(sql, [
			start_index,
			count,
			params['work_hash'] ])
		.on('result', function(res) {
			evt.emit('result', res);
		});
	return sql;
};

/* 모델명 : registerReply
   설명 : 댓글을 등록함
   params = { work_reply_hash, user_hash, work_idx, comment, reg_ip } */
exports.registerReply = function(evt, db_conn, params) {
	var sql = "INSERT INTO `work_reply` ";
			sql += "(`hash`, `user_idx`, `exhibition_idx`, `work_idx`, `comment`, `reg_ip`, `reg_date`) ";
		sql += "VALUES (";
			sql += ":work_reply_hash, ";
			sql += "(SELECT `idx` FROM `user` WHERE `hash`=:user_hash), ";
			sql += "(SELECT `idx` FROM `exhibition` WHERE `hash`=:exhibition_hash), ";
			sql += "(SELECT `idx` FROM `work` WHERE `hash`=:work_hash), ";
			sql += ":comment, ";
			sql += ":reg_ip, ";
			sql += ":reg_date";
		sql += "); ";

		sql += "SELECT * FROM `work_reply` WHERE `idx`=LAST_INSERT_ID(); ";
	var query = db_conn.query(sql, {
			work_reply_hash: params['work_reply_hash'],
			user_hash: params['user_hash'],
			exhibition_hash: params['exhibition_hash'],
			work_hash: params['work_hash'],
			comment: params['comment'],
			reg_ip: params['reg_ip'],
			reg_date: params['reg_date'] })
		.on('result', function(res) {
			evt.emit('result', res);
		});
	return sql;	
};

/* 모델명 : modifyReply
   설명 : 댓글을 수정함
   params = { work_reply_hash, parent_idx, user_hash, work_idx, comment, reg_ip } */
exports.modifyReply = function(evt, db_conn, params) {
	var sql = "INSERT INTO `work_reply` ";
		sql += "(`hash`, `parent_idx`, `user_idx`, `work_idx`, `comment`, `reg_ip`) ";
		sql += "VALUES ";
			sql += "('?', '?', `A`.`idx`, '?', '?', '?') ";
		sql += "SELECT `A`.`idx` ";
		sql += "FROM `user` AS `A` ";
		sql += "WHERE `A`.`hash` = '?' ";
	var query = db_conn.query(sql, [
			params['hash'],
			params['parent_idx'],
			params['work_idx'],
			params['comment'],
			params['reg_ip'],
			params['user_hash'] ])
		.on('result', function(res) {
			evt.emit('result', res);
		});
	return sql;
};

/* 모델명 : removeReply
   설명 : work_reply_hash로 댓글을 삭제함
   params = { work_reply_hash } */
exports.removeReply = function(evt, db_conn, params) {
	var sql = "UPDATE `work_reply` ";
		sql += "SET ";
			sql += "`status` = '1', ";
			sql += "`deleted_date` = :deleted_date ";
		sql += "WHERE `hash` = :hash ";
	var query = db_conn.query(sql, {
			deleted_date: params['deleted_date'],
			hash: params['hash'] })
		.on('result', function(res) {
			evt.emit('result', res);
		})
		.on('error', function(err) {
			evt.emit('error', err);
		});
	return sql;
};

