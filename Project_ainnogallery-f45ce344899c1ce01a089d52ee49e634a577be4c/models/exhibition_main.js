exports.exhibitionMainList = function(evt, db_conn, params){
	//var index = params['index'];
	var sql = "SELECT ";
		sql += "`A`.`title` 				AS `exhibition_title`, ";
		sql += "`A`.`schedule_start`		AS `exhibition_schedule_start`, ";
		sql += "`A`.`schedule_end`			AS `exhibition_schedule_end`, ";
		sql += "`A`.`cover_image`			AS `exhibition_cover_image`, ";
		sql += "`B`.`name`					AS `user_name`, ";
		sql += "`B`.`profile_photo`			AS `user_profile_photo` ";
		sql += "FROM `exhibition`			AS `A` ";
		sql += "INNER JOIN `user` 			AS `B` ";
		sql += "ON `B`.`idx` = `A`.`user_idx` "
		sql += "WHERE ";
		sql += "`A`.`user_idx` = 4 ";
		sql += "ORDER BY `A`.`schedule_start` DESC; ";
		
	var query = db_conn.query(sql, [
		params['user_url']])
	.on('result', function(result){
		evt.emit('result', result);
	});
	return sql;
};