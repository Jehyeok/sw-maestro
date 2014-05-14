/*
	models/user.js

	사용자 정보와 관련된 데이터를 다룰 때
*/

exports.get_url_by_idx = function(event, db_conn, params) {
	var sql = ""

	var query = db_conn.query(sql, function(err, rows, fields) {
		event.emit('url', err, rows);
	});
	return sql;
};

/**
 * 유저 작품들 로드
 * 
 * @param {EventEmitter}
 * @param {Client} // Client 객체는 mariasql의 객체
 * @param {Object} params
 */
exports.getUserWorks = function(evt, db_conn, params) {
	console.log("model > user.js > getUserWorks > params.user_url: " + params.user_url);
	var sql = "SELECT ";
		sql += "`A`.`idx`, ";
		sql += "`A`.`width_height_ratio`, ";
		sql += "`A`.`hash` ";
		sql += "FROM `work`	AS `A` ";
		sql += "WHERE `A`.`user_idx` = ";
		sql += "(SELECT `idx` FROM `user` WHERE `url` = ?)";
		
	var query = db_conn.query(sql, [
		params['user_url']])
	.on('result', function(result){
		evt.emit('result', result);
	});
	return evt;
}

/**
 * user_url로 user_idx 가져옴
 */

 exports.get_idx_by_url = function(evt, db_conn, params) {
 	var sql = "SELECT ";
 		sql += "`A`.`idx` ";
 		sql += "FROM `user` AS `A` ";
 		sql += "WHERE `A`.`user_url` = ";
 		sql += params.user_url + "";

 	var query = db_conn.query(sql, [
 		params['user_url']])
 	.on('result', function(result) {
 		evt.emit('result', result);
 	});
 	return evt;
 }

/**
 * 유저 작품 업로드
 *
 */

exports.insertUserWork = function(evt, db_conn, params) {
	console.log("model > user.js > insertUserWork > params: " + params); 
	var sql = "INSERT INTO ";
		sql += "`work` ";
		sql += "(`user_idx`, `hash`, `url`, `title`, `artist`, `production_date`, `material`, `width`, `height`, `pixel_width`, `pixel_height`, `width_height_ratio`, `reg_date`, `reg_ip`) ";
		sql += "VALUES ";
		sql += "((SELECT `idx` FROM `user` WHERE `url` = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	var query = db_conn.query(sql, [
		params.url,
		params.hash,
		params.url,
		params.title,
		params.artist,
		params.production_date,
		params.material,
		params.width,
		params.height,
		params.pixel_width,
		params.pixel_height,
		params.width_height_ratio,
		params.reg_date,
		params.reg_ip
		])
	.on('result', function(result) {
		evt.emit('result', result);
	});
	return evt;
}