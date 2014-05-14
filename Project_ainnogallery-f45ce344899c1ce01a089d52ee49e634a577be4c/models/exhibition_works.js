exports.getExhibitionWorks = function(evt, db_conn, params){
	console.log("getExhibitionWorks > params: " + params.exhibition_url);
	var sql = "SELECT ";
		sql += "`A`.`work_idx` ";
		sql += "FROM `exhibition_works_custom_info`	AS `A` ";
		sql += "WHERE `A`.`exhibition_idx` = ";
		sql += params.exhibition_url + "";
		
	var query = db_conn.query(sql, [
		params['exhibition_url']])
	.on('result', function(result){
		console.log("getExhibitionWorks > result: " + result[0])
		evt.emit('result', result);
	});
	return evt;
};