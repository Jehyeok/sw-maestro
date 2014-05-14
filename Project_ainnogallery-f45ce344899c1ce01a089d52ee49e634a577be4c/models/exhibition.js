exports.getUserHash = function(evt, db_conn, params){
	var sql = "SELECT ";
		sql += "`A`.`hash`		AS `user_hash` ";
		sql += "FROM `user`		AS `A` ";
		sql += "WHERE ";
		sql += "`A`.`url` = ?; ";

	var query = db_conn.query(sql, [
		params['user_url'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function(){
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainList = function(evt, db_conn, params){
	var sql = "SELECT ";
		sql += "`A`.`title` 				AS `exhibition_title`, ";
		sql += "`A`.`schedule_start`		AS `exhibition_schedule_start`, ";
		sql += "`A`.`schedule_end`			AS `exhibition_schedule_end`, ";
		sql += "`A`.`length`				AS `exhibition_work_len`, ";
		sql += "`A`.`url`					AS `exhibition_url`, ";
		sql += "`A`.`cover_image`			AS `exhibition_cover_image`, ";
		sql += "(SELECT `C`.`url` FROM `user` AS `C` WHERE `C`.`hash` = ?) AS `exhibition_user_url` ";
		sql += "FROM `exhibition`			AS `A` ";
		sql += "WHERE ";
		sql += "`A`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `B`.`idx` ";
		sql += "FROM `user` 				AS `B`";
		sql += "WHERE `B`.`hash` = ? ";
		sql += ") ";
		sql += "ORDER BY `A`.`schedule_start` DESC; ";
		
	var query = db_conn.query(sql, [
		params['user_hash'],
		params['user_hash'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
};

exports.exhibitionMainProfile = function(evt, db_conn, params){
	var sql = "SELECT ";
		sql += "`A`.`name`					AS `user_name`, ";
		sql += "`A`.`profile_photo`			AS `user_profile_photo` ,";
		sql += "`A`.`url`					AS `user_url` ";
		sql += "FROM `user` 				AS `A` ";
		sql += "WHERE ";
		sql += "`A`.`idx` ";
		sql += "IN (";
		sql += "SELECT `B`.`idx` ";
		sql += "FROM `user` 				AS `B`";
		sql += "WHERE `B`.`hash` = ? ";
		sql += "); ";
		
	var query = db_conn.query(sql, [
		params['user_hash'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainComment = function(evt, db_conn, params){
	var sql = "SELECT ";
		sql += "`A`.`comment` 				AS `user_comment`, ";
		sql += "`A`.`reg_date`				AS `user_reg_date`, ";
		sql += "`C`.`title`					AS `user_work_title`, ";
		sql += "CASE ";
		sql += "WHEN `A`.`exhibition_idx` is not null ";
		sql += "THEN (";
		sql += "SELECT ";
		sql += "`D`.`title` ";
		sql += "FROM `exhibition`			AS `D` ";
		sql += "WHERE ";
		sql += "`D`.`idx` = `A`.`exhibition_idx`) ";
		sql += "ELSE '' END  				AS `user_exhibition_title` ";
		sql += "FROM `work_reply`			AS `A` ";
		sql += "INNER JOIN `work`			AS `C` ";
		sql += "ON `C`.`idx` = `A`.`work_idx` ";
		sql += "WHERE ";
		sql += "`A`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `B`.`idx` ";
		sql += "FROM `user` 				AS `B`";
		sql += "WHERE `B`.`hash` = ? ";
		sql += ") AND ";
		sql += "`A`.`status` = 0 ";
		sql += "ORDER BY `A`.`reg_date` DESC ";
		sql += "LIMIT 2; ";
		
	var query = db_conn.query(sql, [
		params['user_hash'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainAnalytics = function(evt, db_conn, params){
	var sql = "SELECT ";
		sql += "`A`.`total_view`			AS `user_total_view`, ";
		sql += "`A`.`total_artwork`			AS `user_total_artwork`, ";
		sql += "`A`.`total_exhibition`		AS `user_total_exhibition` ";
		sql += "FROM `user_analytics`		AS `A` ";
		sql += "WHERE ";
		sql += "`A`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `B`.`idx` ";
		sql += "FROM `user` 				AS `B`";
		sql += "WHERE `B`.`hash` = ? ";
		sql += "); ";
		
	var query = db_conn.query(sql, [
		params['user_hash'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainBanner = function(evt, db_conn, params){
	/*var sql = "SELECT ";
		sql += "`A`.`banner_image`			AS `user_banner_image`, ";
		sql += "`A`.`title`					AS `user_title`, ";
		sql += "`A`.`subtitle`				AS `user_subtitle`, ";
		sql += "`A`.`banner_idx`			AS `user_banner_idx`, ";
		sql += "`A`.`link`					AS `user_link` ";
		sql += "FROM `user_banner`			AS `A` ";
		sql += "WHERE ";
		sql += "`A`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `B`.`idx` ";
		sql += "FROM `user` 				AS `B`";
		sql += "WHERE `B`.`hash` = ? ";
		sql += ") ";
		sql += "ORDER BY `A`.`banner_idx`";*/
		var sql = "SELECT * FROM (";
		sql += "SELECT ";
		sql += "`A`.`banner_image` AS `user_banner_image`, ";
		sql += "`A`.`title` AS `user_banner_title`, ";
		sql += "`A`.`subtitle` AS `user_banner_subtitle`, ";
		sql += "`A`.`banner_idx` AS `user_banner_idx`, ";
		sql += "`A`.`link` AS `user_banner_link` ";
		sql += "FROM `user_banner` AS `A` ";
		sql += "WHERE `A`.`banner_idx` = 1 ";
		sql += "AND `A`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `AA`.`idx` ";
		sql += "FROM `user` AS `AA` ";
		sql += "WHERE `AA`.`hash` = ?";
		sql += ") ";
		sql += "ORDER BY `A`.`reg_date` DESC ";
		sql += "LIMIT 1) AS `A`";
		sql += "UNION ALL ";
		sql += "SELECT * FROM (";
		sql += "SELECT ";
		sql += "`B`.`banner_image` AS `user_banner_image`, ";
		sql += "`B`.`title` AS `user_banner_title`, ";
		sql += "`B`.`subtitle` AS `user_banner_subtitle`, ";
		sql += "`B`.`banner_idx` AS `user_banner_idx`, ";
		sql += "`B`.`link` AS `user_banner_link` ";
		sql += "FROM `user_banner` AS `B` ";
		sql += "WHERE `B`.`banner_idx` = 2 ";
		sql += "AND `B`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `BB`.`idx` ";
		sql += "FROM `user` AS `BB` ";
		sql += "WHERE `BB`.`hash` = ?";
		sql += ") ";
		sql += "ORDER BY `B`.`reg_date` DESC ";
		sql += "LIMIT 1) AS `B`";
		sql += "UNION ALL ";
		sql += "SELECT * FROM (";
		sql += "SELECT ";
		sql += "`C`.`banner_image` AS `user_banner_image`, ";
		sql += "`C`.`title` AS `user_banner_title`, ";
		sql += "`C`.`subtitle` AS `user_banner_subtitle`, ";
		sql += "`C`.`banner_idx` AS `user_banner_idx`, ";
		sql += "`C`.`link` AS `user_banner_link` ";
		sql += "FROM `user_banner` AS `C` ";
		sql += "WHERE `C`.`banner_idx` = 3 ";
		sql += "AND `C`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `CC`.`idx` ";
		sql += "FROM `user` AS `CC` ";
		sql += "WHERE `CC`.`hash` = ?";
		sql += ") ";
		sql += "ORDER BY `C`.`reg_date` DESC ";
		sql += "LIMIT 1) AS `C`;";
		
	var query = db_conn.query(sql, [
		params['user_hash'],
		params['user_hash'],
		params['user_hash'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainBannerRegister = function(evt, db_conn, params){
	var sql = "INSERT ";
		sql += "INTO `user_banner` ";
		sql += "(`user_idx`, `banner_image`, `title`, `subtitle`, `banner_idx`, `link`, `reg_date`, `reg_ip`) ";
		sql += "VALUES ";
		sql += "((SELECT `idx` FROM `user` WHERE `hash` = ?), ?, ?, ?, ?, ?, ?, ?); ";
	var query = db_conn.query(sql, [
		params.user_hash,
		params.banner_image,
		params.title,
		params.subtitle,
		params.banner_idx,
		params.link,
		params.reg_date,
		params.reg_ip])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainGuestbook = function(evt, db_conn, params){
	var sql = "SELECT ";
		sql += "`A`.`comment`							AS `user_comment`, ";
		sql += "`A`.`reg_date`							AS `user_reg_date`, ";
		sql += "CASE ";
		sql += "WHEN (";
		sql += "SELECT ";
		sql +="`C`.`name` ";
		sql += "FROM `user`								AS `C` ";
		sql += "WHERE ";
		sql += "`C`.`idx` = `A`.`guest_idx`)";
		sql += "is not null ";
		sql += "THEN (";
		sql += "SELECT ";
		sql += "`D`.`name` ";
		sql += "FROM `user`								AS `D` ";
		sql += "WHERE `D`.`idx` = `A`.`guest_idx`) ";
		sql += "ELSE 'Guest' END 						AS `user_guest_name`";
		sql += "FROM `user_guestbook`					AS `A`";
		sql += "WHERE ";
		sql += "`A`.`user_idx` ";
		sql += "IN (";
		sql += "SELECT `B`.`idx` ";
		sql += "FROM `user` 							AS `B`";
		sql += "WHERE `B`.`hash` = ? ";
		sql += ") ";
		sql += "ORDER BY `A`.`reg_date` DESC; ";
		
	var query = db_conn.query(sql, [
		params['user_hash'] ])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}

exports.exhibitionMainGuestbookRegister = function(evt, db_conn, params){
	var sql = "INSERT ";
		sql += "INTO `user_guestbook` ";
		sql += "(`user_idx`, `comment`, `guest_idx`, `reg_date`, `reg_ip`) ";
		sql += "VALUES ";
		sql += "((SELECT `idx` FROM `user` WHERE `hash` = ?), ?, ?, ?, ?); ";
		sql += "SELECT ";
		sql += "CASE ";
		sql +=" WHEN (";
		sql += "SELECT ";
		sql += "`B`.`name` ";
		sql += "FROM `user` AS `B` ";
		sql += "WHERE ";
		sql += "`B`.`idx` = ?) ";
		sql += "is not null ";
		sql += "THEN (";
		sql += "SELECT ";
		sql += "`C`.`name` ";
		sql += "FROM `user` AS `C` ";
		sql += "WHERE `C`.`idx` = ?) ";
		sql += "ELSE 'Guest' END AS `user_guest_name` ";
		sql += "FROM `user_guestbook` AS `A` "
		sql += "LIMIT 1;";
	var query = db_conn.query(sql, [
		params.user_hash,
		params.comment,
		params.guest_idx,
		params.reg_date,
		params.reg_ip,
		params.guest_idx,
		params.guest_idx])
	.on('result', function(res){
		evt.emit('result', res);
	})
	.on('end', function() {
		evt.emit('end');
	});
	return sql;
}