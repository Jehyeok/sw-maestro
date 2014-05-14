var inspect = require('util').inspect;
var Client = require('mariasql');
var db_conn = new Client();

db_conn.connect({
	host: 'aurumplanet-vega.iptime.org',
	user: 'ainnogallery',
	password: 'vmffosltainnogallery',
	db: 'ainnogallery',
	multiStatements: true
});
console.log("[Info] DB 연결 중이야. 잠깐만 기다려봐. 곧 완료됐나 오류났나 결과가 뜰거야.");

db_conn
	.on('connect', function() {
		console.info('[Info] DB 연결 완료했어.');
	})
	.on('error', function(err) {
		console.log('[Error] DB 연결 오류 발생했어. 오류 내용 : ' + inspect(err));
		console.log('[!] 이건 이제 쓸모없어. 5초 있다가 내가 확 서버 종료시킬거야. 각오해.');

		var time_count = 5;
		var timer = setInterval(function() {
			process.stdout.write("    남은시간은 "+ time_count +"초야.    \r");
			if (time_count-- <= 0)
			{ 
				process.stdout.write("\n    안녕, 잘가.");
				clearInterval(timer);
				process.exit(1);
			}
		}, 1000);
	})
	.on('close', function(hadError) {
		if (hadError)
		{
			console.log('[Error] DB 연결 비정상 종료됐다고. 오류 내용 : ' + inspect(hadError));
			process.exit(1);
		}
		else console.log('[Into] DB 연결 정상 종료됐어.');
	});

module.exports = {
	db_conn: db_conn
};