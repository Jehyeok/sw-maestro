// Hi everyone?

exports.getArtistList = function(evt, db_conn, params) {
	var sql = "SELECT `A`.`url`			AS `user_url`, "
			+ "`A`.`name`				AS `user_name`, "
			+ "`A`.`profile_photo`		AS `user_profilePhoto`, "
			+ "`B`.`url`				AS `exhibition_url`, "
			+ "`B`.`title`				AS `exhibition_title`, "
			+ "`B`.`schedule_start`		AS `exhibition_schedule_start`, "
			+ "`B`.`schedule_end`		AS `exhibition_schedule_end`, "
			+ "`B`.`reg_date`, "
			+ "`B`.`cover_image`		AS `exhibition_image` "
			+ "FROM `user` AS `A` "
			+ "LEFT OUTER JOIN (SELECT `url`, `title`, `schedule_start`, `schedule_end`, `cover_image`, `reg_date`, `user_idx` "
			+ "FROM (SELECT * FROM `exhibition` ORDER BY `reg_date` DESC) `E` "
			+ "GROUP BY `user_idx`) AS `B` "
			+ "ON `A`.`idx`=`B`.`user_idx` "
			+ "ORDER BY `reg_date` DESC;";

	var query = db_conn.query(sql, []).on('result', function(res){
		evt.emit('result', res);
	}).on('end', function(){
		evt.emit('end');
	});
	return sql;
}