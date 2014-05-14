// 모델명 : getUserIdxByHash
// 설명 : user_hash로 user_idx 알아냄
// params = { user_hash }
exports.getUserIdxByHash = function() {
	var sql = "SELECT ";
	sql += "`A`.`idx` ";
	sql += "FROM `user` AS `A` ";
	sql += "WHERE `A`.`hash` = '?' ";
	var query = db_conn.query(sql, [ params['user_idx'] ])
		on('result', function(res) {
			evt.emit('result', res);
		})
	return sql;
};